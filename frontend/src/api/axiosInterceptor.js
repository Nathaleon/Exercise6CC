import { useMemo } from 'react';
import axios from "axios";
import axiosInstance from "./axiosInstance"; // Assuming this is your base axios instance
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useAuth } from "../auth/useAuth";

const useAxiosInterceptor = () => {
  const { auth, setAuth } = useAuth();

  const axiosJWT = useMemo(() => {
    console.log("useAxiosInterceptor: Re-creating axiosJWT instance.");
    console.log("useAxiosInterceptor: Current auth state in useMemo:", auth); // Log auth state

    const instance = axios.create({
      baseURL: axiosInstance.defaults.baseURL,
      withCredentials: true,
    });

    instance.interceptors.request.use(
      async (config) => {
        const user = auth; // Use the auth object from context
        console.log("Request Interceptor: Processing request. Current user:", user); // Log di setiap permintaan

        // If no user or no accessToken, skip adding Authorization header
        if (!user || !user.accessToken) {
          console.log("Request Interceptor: No user or accessToken found. Skipping Authorization header.");
          return config;
        }

        // Decode the access token to check its expiration
        const decoded = jwtDecode(user.accessToken);
        // Check if the token is expired (less than 1 second remaining)
        const isExpired = dayjs.unix(decoded.exp).diff(dayjs()) < 1;

        if (!isExpired) {
          // If token is not expired, add it to the Authorization header
          config.headers.Authorization = `Bearer ${user.accessToken}`;
          console.log("Request Interceptor: Token not expired. Added Authorization header.");
          return config;
        }

        // If token is expired, attempt to refresh it
        console.log("Request Interceptor: Token expired. Attempting refresh.");
        try {
          // Call the /token endpoint to get a new access token using the refresh token cookie
          const res = await axiosInstance.get("/token");
          // Set the new access token in the Authorization header for the current request
          config.headers.Authorization = `Bearer ${res.data.accessToken}`;
          // Update the auth state in the AuthProvider with the new access token
          // We spread the existing auth to preserve username, and only update accessToken
          setAuth({ ...user, accessToken: res.data.accessToken }); 
          console.log("Request Interceptor: Token refreshed successfully. New accessToken:", res.data.accessToken);
        } catch (error) {
          console.error("Request Interceptor: Token refresh failed", error);
          // *** IMPORTANT FIX: If token refresh fails, clear the authentication state ***
          // This ensures the user is logged out if their refresh token is invalid or expired.
          setAuth(null); // This will trigger the 'Auth cleared' path in AuthProvider
          // You might also want to redirect to the login page here, 
          // but that's typically handled by a higher-level component reacting to `auth` becoming null.
          return Promise.reject(error); // Reject the promise to stop the original request
        }
        return config; // Return the modified config
      },
      (error) => {
        // Handle any errors that occur before the request is sent (e.g., config issues)
        console.error("Request Interceptor: Request error:", error);
        return Promise.reject(error); // Propagate the error
      }
    );

    instance.interceptors.response.use(
      (response) => response, // If response is successful, just return it
      (error) => {
        // Handle errors from API responses (e.g., 401, 500)
        console.error("Response Interceptor: API call failed with error:", error.response?.status, error.response?.data);
        // You could add specific error handling here, e.g., if (error.response?.status === 401) setAuth(null);
        // However, the request interceptor's refresh logic should ideally handle most 401s related to token expiry.
        return Promise.reject(error); // Propagate the error
      }
    );

    return instance;
  }, [auth, setAuth]); // Re-create the memoized instance if auth or setAuth changes

  return axiosJWT;
};

export default useAxiosInterceptor;
