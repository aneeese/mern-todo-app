import { useEffect, useState } from "react";
import TaskItem from "../components/TaskItem";
import { Avatar, Box } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useUserStore from "../app/store";
import Spinner from "../components/Spinner";
import config from "../config/settings";

function Dashboard() {
  const [tasks, setTasks] = useState({});
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const startLoading = useUserStore((state) => state.startLoading);
  const stopLoading = useUserStore((state) => state.stopLoading);
  const loading = useUserStore((state) => state.loading);

  useEffect(() => {
    if (user) {
      startLoading();
      fetchData();
      stopLoading();
    } else {
      navigate("/login");
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/tasks`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.log(error.message);
      toast.error("Could not fetch the data.");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      startLoading();
      const taskText = { user: user._id, task: text };
      const setHeader = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
      };

      await axios.post(`${config.apiUrl}/tasks`, taskText, setHeader);
      stopLoading();
      setText("");
      toast.success("New item added.", { autoClose: 1000 });
      fetchData();
    } catch (error) {
      stopLoading();
      console.log(error.message);
      toast.error("Please add some text to add.", { autoClose: 1000 });
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="center" marginBottom="0.1rem">
        <label htmlFor="file-input">
          <Avatar
            alt="Selected Image"
            src={user && user.image}
            sx={{
              width: 100,
              height: 100,
              borderColor: "black",
            }}
          />
        </label>
      </Box>

      <section className="flex flex-col mb-5 px-5">
        <h6 className="flex justify-center font-semibold mb-4 text-2xl m-4">
          Welcome {user && user.name}
        </h6>
      </section>

      <section className="w-1/2 mx-auto">
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="text"
              className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
              id="text"
              placeholder="Add a item."
              value={text}
              onChange={(e) => setText(e.target.value)}
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
                Add Task
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="w-1/2 mx-auto">
        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 gap-1">
            {tasks.map((task) => (
              <TaskItem key={task._id} task={task} update={fetchData} />
            ))}
          </div>
        ) : (
          <h3>You have not set any tasks</h3>
        )}
      </section>
    </>
  );
}

export default Dashboard;
