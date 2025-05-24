import { useMemo } from 'react';
import axios from "axios";
import axiosInstance from "./axiosInstance";
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
        const user = auth;
        console.log("Request Interceptor: Processing request. Current user:", user); // Log di setiap permintaan
        if (!user || !user.accessToken) {
          console.log("Request Interceptor: No user or accessToken found. Skipping Authorization header.");
          return config;
        }

        const decoded = jwtDecode(user.accessToken);
        const isExpired = dayjs.unix(decoded.exp).diff(dayjs()) < 1;

        if (!isExpired) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
          console.log("Request Interceptor: Token not expired. Added Authorization header.");
          return config;
        }

        console.log("Request Interceptor: Token expired. Attempting refresh.");
        try {
          const res = await axiosInstance.get("/token");
          config.headers.Authorization = `Bearer ${res.data.accessToken}`;
          setAuth({ ...auth, accessToken: res.data.accessToken });
          console.log("Request Interceptor: Token refreshed successfully. New accessToken:", res.data.accessToken);
        } catch (error) {
          console.error("Request Interceptor: Token refresh failed", error);
          
        }
        return config;
      },
      (error) => {
        console.error("Request Interceptor: Request error:", error);
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("Response Interceptor: API call failed with error:", error.response?.status, error.response?.data);
        return Promise.reject(error);
      }
    );

    return instance;
  }, [auth, setAuth]); 

  return axiosJWT;
};

export default useAxiosInterceptor;
