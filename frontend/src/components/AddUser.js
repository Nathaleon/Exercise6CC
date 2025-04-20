import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils";


const AddUser = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState(""); 
  const [isiNotes, setIsiNotes] = useState(""); 
  const navigate = useNavigate();

  const saveUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/users`, {
        name,
        title, 
        isi_notes: isiNotes, 
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="columns mt-5 is-centered">
      <div className="column is-half">
        <form onSubmit={saveUser}>
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