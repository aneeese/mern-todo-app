import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../app/store";
import { toast } from "react-toastify";

function Header() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    toast.success("Logout successful.", { autoClose: 1000 });
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center py-5 border-b border-gray-300 mb-11">
      <div>
        <Link to="/">Todo App</Link>
      </div>
      <ul className="list-none flex items-center justify-between">
        {user ? (
          <li className="ml-5 leading-8">
            <button
              className="flex px-5 py-2 border border-black rounded bg-black text-white text-base font-bold cursor-pointer text-center hover:scale-95"
              onClick={onLogout}
            >
              <FaSignOutAlt className="mr-1 mt-1" /> Logout
            </button>
          </li>
        ) : (
          <>
            <li className="ml-5 leading-8">
              <Link
                className="flex items-center hover:text-gray-700"
                to="/login"
              >
                <FaSignInAlt className="mr-1" /> Login
              </Link>
            </li>
            <li className="ml-5 leading-8">
              <Link
                className="flex items-center hover:text-gray-700"
                to="/register"
              >
                <FaUser className="mr-1" /> Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
