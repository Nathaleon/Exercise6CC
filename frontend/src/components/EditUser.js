import React, { useState, useEffect, useCallback } from "react";
import useAxiosInterceptor from "../api/axiosInterceptor"; // PENTING: Import custom hook ini
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth"; // Import useAuth untuk penanganan error logout

const EditUser = () => {
  // State variables untuk input form
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [isiNotes, setIsiNotes] = useState("");
  const [msg, setMsg] = useState(""); // State untuk pesan error/informasi, jika diperlukan untuk update error

  const navigate = useNavigate();
  const { id } = useParams(); // Mengambil ID dari URL
  // Panggil useAxiosInterceptor untuk mendapatkan instance Axios yang sudah diatur
  const axiosJWT = useAxiosInterceptor();
  // Gunakan useAuth untuk mengakses setAuth, yang diperlukan untuk menghapus status auth jika token tidak valid
  const { setAuth } = useAuth();

  // useCallback untuk membungkus fungsi yang akan digunakan di useEffect
  const getUserById = useCallback(async () => {
    try {
      // PENTING: Gunakan 'axiosJWT' untuk permintaan GET yang memerlukan autentikasi
      const response = await axiosJWT.get(`/users/${id}`); // Endpoint untuk mendapatkan user berdasarkan ID
      setName(response.data.name);
      setTitle(response.data.title);
      setIsiNotes(response.data.isi_notes);
    } catch (error) {
      console.error("Error fetching user:", error);
   
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setAuth(null); 
        navigate("/login"); 
      }
  
    }
  }, [id, axiosJWT, navigate, setAuth]); 


  useEffect(() => {
    getUserById();
  }, [getUserById]); 

  const updateUser = async (e) => {
    e.preventDefault();
    setMsg(""); // Bersihkan pesan error sebelumnya

    if (!name || !title || !isiNotes) {
      setMsg("Semua kolom harus diisi");
      return;
    }

    try {
    
      await axiosJWT.patch(`/users/${id}`, { 
        name,
        title,
        isi_notes: isiNotes,
      });
      navigate("/users"); 
    } catch (error) {
      console.error("Error updating user:", error);
      // Tangani error 401 (Unauthorized) atau 403 (Forbidden)
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setAuth(null); 
        navigate("/login"); 
      } else {
       
        setMsg(error.response?.data?.msg || "Gagal memperbarui catatan. Silakan coba lagi.");
      }
    }
  };

  return (
    <div className="columns mt-5 is-centered">
      <div className="column is-half">
        <form onSubmit={updateUser}>
          {}
          {msg && <p className="has-text-danger mb-4">{msg}</p>}

          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Notes</label>
            <div className="control">
              <textarea
                className="textarea"
                value={isiNotes}
                onChange={(e) => setIsiNotes(e.target.value)}
                placeholder="Enter notes here"
              ></textarea>
            </div>
          </div>

          <div className="field">
            <button type="submit" className="button is-success">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
