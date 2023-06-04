import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { Avatar, Box } from "@mui/material";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    if (image) {
      console.log("File has been set.");
    }
  }, [image]);

  const { name, email, password, password2 } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error("Passwords do not match");
    } else {
      try {
        const url = "https://mern-todo-app-production-3286.up.railway.app/users";
        const response = await axios.post(url, { name, image, email, password });
        navigate("/login");
      } catch (error) {
        toast.error("Error. Invalid data.");
      }
    }
  };

  return (
    <>
      <section className="heading">
        <h1>
          <FaUser /> Register
        </h1>
        <p>Please create an account</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <Box display="flex" justifyContent="center" marginBottom="1rem">
              <label htmlFor="file-input">
                <Avatar
                  alt="Selected Image"
                  src={image}
                  sx={{
                    width: 100,
                    height: 100,
                    marginBottom: "1rem",
                    cursor: "pointer",
                    borderColor: "black",
                  }}
                />
              </label>
            </Box>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setImage(URL.createObjectURL(file));
              }}
              style={{ display: "none" }}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={name}
              placeholder="Enter your name"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              placeholder="Enter password"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password2"
              name="password2"
              value={password2}
              placeholder="Confirm password"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-block">
              Submit
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Register;
