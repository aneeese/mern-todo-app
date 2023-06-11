import { useState } from "react";
import axios from "axios";
import useUserStore from "../app/store";
import { MdDeleteSweep } from "react-icons/md";
import { HiCheckCircle } from "react-icons/hi";
import { toast } from "react-toastify";
import config from "../config/settings";
import Spinner from "./Spinner";

function TaskItem({ task, update }) {
  const user = useUserStore((state) => state.user);
  const [checked, setChecked] = useState(false);
  const startLoading = useUserStore((state) => state.startLoading);
  const stopLoading = useUserStore((state) => state.stopLoading);
  const loading = useUserStore((state) => state.loading);

  const deleteTask = async (id) => {
    try {
      startLoading();
      const setHeader = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const response = await axios.delete(
        `${config.apiUrl}/tasks/${id}`,
        setHeader
      );
      stopLoading();
      console.log(response);
      update();
      toast.success("Deleted successfully.", { autoClose: 1000 });
    } catch (error) {
      stopLoading();
      console.log(error.message);
      toast.error("Could not delete. An error occured.");
    }
  };

  const handleUpdate = async (id, value) => {
    setChecked(value);
    startLoading();
    try {
      const setHeader = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const data = { completed: !checked };
      const response = await axios.put(
        `${config.apiUrl}/tasks/${id}`,
        data,
        setHeader
      );
      stopLoading();
      console.log(response);
      update();
      toast.success("Updated successfully.", { autoClose: 1000 });
    } catch (error) {
      stopLoading();
      console.log(error.message);
      toast.error("Could not update. An error occured.");
    }
  };

  return (
    <div className="w-full max-h-full bg-opacity-30 rounded-lg overflow-auto text-gray-700">
      <ul>
        <li
          className={`bg-opacity-70 flex items-center p-2 rounded-full mb-3 ${
            task.completed ? "bg-red-400" : "bg-gray-300"
          }`}
        >
          <label className="flex items-start text-gray-700 mr-2 text-sm leading-6 relative">
            {task.completed ? (
              <HiCheckCircle size={21} className="m-auto mr-2" />
            ) : loading ? (
              <Spinner />
            ) : (
              <input
                value={task.completed}
                className="w-4 h-4 rounded-full border border-gray-700 m-auto mr-2 appearance-none cursor-pointer hover:scale-90"
                onChange={(e) => handleUpdate(task._id, e.target.checked)}
                type="checkbox"
                disabled={task.completed}
              />
            )}

            <span
              className={`text-md ${
                task.completed ? "line-through text-gray-700" : "none"
              }`}
            >
              {task.task}
            </span>
            {task.completed && (
              <p className="text-md font-bold ml-2">
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
            className={`ml-auto mr-2 block cursor-pointer`}
          >
            {loading ? (
              <Spinner />
            ) : (
              <MdDeleteSweep className="hover:scale-90" color="red" size={21} />
            )}
          </span>
        </li>
      </ul>
    </div>
  );
}

export default TaskItem;
