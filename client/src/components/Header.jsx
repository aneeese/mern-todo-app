import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from '../app/store';

function Header() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Todo App</Link>
      </div>
      <ul>
        {user ? (
          <li>
            <button className="btn" onClick={onLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login">
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li>
              <Link to="/register">
                <FaUser /> Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
