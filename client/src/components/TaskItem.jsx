import { useState } from "react";
import axios from "axios";
import useUserStore from "../app/store";

function TaskItem({ task }) {
  const url = "https://mern-todo-app-production-3286.up.railway.app/tasks/";
  const user = useUserStore((state) => state.user);
  const [checked, setChecked] = useState(false);

  const deleteTask = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };

    const response = await axios.delete(url + id, config);
    console.log(response);
  };

  const handleUpdate = async (id, value) => {
    setChecked(value);
    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };

    const data = { completed: !checked };

    const response = await axios.put(url + id, data, config);
    console.log(response);
  };

  return (
    <div className="app-container">
      <ul className="task-list">
        <li className={`task-list-item ${task.completed ? 'completed-class' : ''}`}>
          <label className="task-list-item-label">
            <input
              value={task.completed}
              onChange={(e) => handleUpdate(task._id, e.target.checked)}
              type="checkbox"
              disabled={task.completed}
            />
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.task}
            </span>
            {task.completed && (
              <p className="completed-at">
                Completed at:{" "}
                {new Date(task.updatedAt).toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
            )}
          </label>
          <span
            onClick={() => deleteTask(task._id)}
            className="delete-btn"
            title="Delete Task"
          ></span>
        </li>
      </ul>
    </div>
  );
}

export default TaskItem;
