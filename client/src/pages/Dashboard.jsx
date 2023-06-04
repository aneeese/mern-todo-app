import { useEffect, useState } from "react";
import TaskItem from "../components/TaskItem";
import { Avatar, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUserStore from "../app/store";

function Dashboard() {
  const base_url = 'https://mern-todo-app-production-3286.up.railway.app/';
  const [tasks, setTasks] = useState("");
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [user, text, tasks]);

  const fetchData = async () => {
    const response = await axios.get(`${base_url}tasks`, {
        headers: { Authorization: `Bearer ${user?.token}` }});
    setTasks(response.data);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const taskText = { user: user._id, task: text };
    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(`${base_url}tasks`, taskText, config);
    setTasks(response.data);
    setText("");
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
              marginBottom: "0.5rem",
              cursor: "pointer",
              borderColor: "black",
            }}
          />
        </label>
      </Box>

      <section className="heading">
        <h6>Welcome {user && user.name}</h6>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="text"
              id="text"
              placeholder="Add a item."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="form-group">
            <button className="btn btn-block" type="submit">
              Add Task
            </button>
          </div>
        </form>
      </section>

      <section className="content">
        {tasks.length > 0 ? (
          <div className="tasks">
            {tasks.map((task) => (
              <TaskItem key={task._id} task={task} />
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
