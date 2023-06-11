import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import useUserStore from "../app/store";
import Spinner from "../components/Spinner";
import config from "../config/settings";

function Login() {
  const setUser = useUserStore((state) => state.setUser);
  const startLoading = useUserStore((state) => state.startLoading);
  const stopLoading = useUserStore((state) => state.stopLoading);
  const loading = useUserStore((state) => state.loading);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    startLoading();
    try {
      const response = await axios.post(`${config.apiUrl}/users/login`, {
        email,
        password,
      });
      toast.success("Login Successfull.", {
        autoClose: 1000,
        closeOnClick: true,
      });
      setUser(response.data);
      stopLoading();
      navigate("/");
    } catch (error) {
      stopLoading();
      toast.error("Invalid user credentials.");
      setFormData({ email: "", password: "" });
    }
  };

  return (
    <>
      <section className="flex flex-col mb-8 px-5">
        <h1 className="flex justify-center font-bold mb-4 text-4xl m-7">
          <FaSignInAlt /> Login
        </h1>
        <p className="leading-7 text-3xl font-semibold text-gray-500 m-3">
          Login and start setting tasks
        </p>
      </section>

      <section className="w-1/2 mx-auto">
        <form onSubmit={onSubmit}>
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

export default Login;
