import React, { useState, useEffect, useCallback } from "react";
import useAxiosInterceptor from "../api/axiosInterceptor"; // Import custom hook
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const UserList = () => {
  const [users, setUser] = useState([]);
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const axiosJWT = useAxiosInterceptor(); // Panggil custom hook di dalam komponen

  // Wrap getUsers with useCallback to memoize it
  const getUsers = useCallback(async () => {
    try {
      // Gunakan axiosJWT untuk permintaan yang memerlukan autentikasi
      const response = await axiosJWT.get("/users");
      setUser(response.data);
    } catch (error) {
      console.log("Error fetching users:", error);
      // Tangani error 401/403 secara spesifik (token tidak valid/expired)
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setAuth(null); // Hapus status autentikasi
        navigate("/login"); // Redirect ke halaman login
      }
    }
  }, [axiosJWT, setAuth, navigate]); // Include dependencies

  useEffect(() => {
    getUsers();
  }, [getUsers]); // Now include getUsers in dependency array

  const deleteUser = async (id) => {
    try {
      await axiosJWT.delete(`/users/${id}`); // Gunakan axiosJWT
      getUsers(); // Refresh daftar pengguna setelah penghapusan
    } catch (error) {
      console.log("Error deleting user:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setAuth(null);
        navigate("/login");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axiosJWT.delete("/logout"); // Gunakan axiosJWT
      setAuth(null); // Kosongkan konteks autentikasi
      navigate("/login");
    } catch (error) {
      console.log("Error logging out:", error);
      // Meskipun logout gagal di server, tetap kosongkan status auth lokal dan navigasi
      setAuth(null);
      navigate("/login");
    }
  };

  return (
    <div className="columns mt-5 is-centered">
      <div className="column is-half">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <Link to="/users/add" className="button is-success">
            Add New
          </Link>
          <button onClick={handleLogout} className="button is-danger">
            Logout
          </button>
        </div>
        <table className="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Title</th>
              <th>Notes</th>
              <th>Date Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? ( // Tampilkan pesan jika tidak ada catatan
              users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.title}</td>
                  <td>{user.isi_notes}</td>
                  <td>{new Date(user.date_created).toLocaleString()}</td>
                   <td>
                    <div className="buttons">
                      <Link to={`/users/edit/${user.id}`} className="button is-small is-info">
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="button is-small is-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="has-text-centered">Tidak ada catatan untuk ditampilkan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;