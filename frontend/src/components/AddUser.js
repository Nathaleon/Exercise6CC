import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosInterceptor from "../api/axiosInterceptor"; 
import { useAuth } from "../auth/useAuth"; 

const AddUser = () => {
  
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [isiNotes, setIsiNotes] = useState("");
  const [msg, setMsg] = useState(""); 

  const navigate = useNavigate();
 
  const axiosJWT = useAxiosInterceptor();

  const { setAuth } = useAuth();

  const saveUser = async (e) => {
    e.preventDefault();
    setMsg(""); 

    // Validasi input di sisi client
    if (!name || !title || !isiNotes) {
      setMsg("Semua kolom harus diisi"); // Tampilkan pesan validasi
      return;
    }

    try {
     
      await axiosJWT.post("/users", { 
        name,
        title,
        isi_notes: isiNotes, 
      });
      navigate("/users"); 
    } catch (error) {
      console.error("Error saving user:", error);
     
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setAuth(null); 
        navigate("/login"); 
      } else {
        setMsg(error.response?.data?.msg || "Gagal menyimpan catatan. Silakan coba lagi.");
      }
    }
  };

  return (
    <div className="columns mt-5 is-centered">
      <div className="column is-half">
        <form onSubmit={saveUser}>
          {/* Tampilkan pesan error/informasi di UI jika ada */}
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
