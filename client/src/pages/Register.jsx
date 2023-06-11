import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { Avatar, Box } from "@mui/material";
import axios from "axios";
import useUserStore from "../app/store";
import Spinner from "../components/Spinner";
import config from "../config/settings";

function Register() {
  const navigate = useNavigate();
  const startLoading = useUserStore((state) => state.startLoading);
  const stopLoading = useUserStore((state) => state.stopLoading);
  const loading = useUserStore((state) => state.loading);

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
        startLoading();
        const response = await axios.post(`${config.apiUrl}/users`, {
          name,
          image,
          email,
          password,
        });
        if (response.status == 201) {
          stopLoading();
          toast.success("Account created successfully.", {
            autoClose: 1000,
            closeOnClick: true,
          });
          navigate("/login");
        }
      } catch (error) {
        stopLoading();
        toast.error("Error. Email address already registered.");
      }
    }
  };

  return (
    <>
      <section className="flex flex-col mb-8 px-5">
        <h1 className="flex justify-center font-bold mb-4 text-4xl m-4">
          <FaUser /> Register
        </h1>
        <p className="leading-7 text-3xl font-semibold text-gray-500 m-2">
          Please create an account
        </p>
      </section>

      <section className="w-1/2 mx-auto pb-7">
        <form onSubmit={onSubmit}>
          <div className="mb-4">
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
          <div className="mb-4">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
              id="name"
              name="name"
              value={name}
              placeholder="Enter your name"
              onChange={onChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
              id="password"
              name="password"
              value={password}
              placeholder="Enter password"
              onChange={onChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
              id="password2"
              name="password2"
              value={password2}
              placeholder="Confirm password"
              onChange={onChange}
            />
          </div>
          <div className="mb-4">
            {loading ? (
              <Spinner />
            ) : (
              <button
                type="submit"
                className="w-full px-5 py-2 border border-black rounded bg-black text-white text-base font-bold cursor-pointer text-center mb-5 hover:scale-95"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </section>
    </>
  );
}

export default Register;
