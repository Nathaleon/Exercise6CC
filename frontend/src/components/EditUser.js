import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../utils";

const EditUser = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState(""); 
  const [isiNotes, setIsiNotes] = useState(""); 
  const navigate = useNavigate();
  const { id } = useParams();

  const getUserById = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/${id}`);
      setName(response.data.name);
      setTitle(response.data.title); 
      setIsiNotes(response.data.isi_notes); 
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, [id]); 

  
  useEffect(() => {
    getUserById();
  }, [getUserById]);

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${BASE_URL}/users/${id}`, {
        name,
        title, 
        isi_notes: isiNotes, 
      });
      navigate("/");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="columns mt-5 is-centered">
      <div className="column is-half">
        <form onSubmit={updateUser}>
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