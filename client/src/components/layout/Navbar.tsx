import "../../styles/navbar.css";
import { useTheme } from "../../theme/ThemeContext";

function Navbar() {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const { theme, toggleTheme } = useTheme();

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";

  };

  return (

    <header className="navbar">

      <div className="brand">

        <div className="brand-logo">
          D
        </div>

        <div>

          <h2>DevAPI Hub</h2>

          <p>
            API Development Workspace
          </p>

        </div>

      </div>

      <div className="profile">

        <div className="avatar">

          {user?.name
            ? user.name[0].toUpperCase()
            : "A"}

        </div>

        <div className="profile-info">

          <h4>
            {user?.name || "Developer"}
          </h4>

          <span>
            Online
          </span>

        </div>

        <div className="profile-actions">

          <button
            className="theme-btn"
            onClick={toggleTheme}
          >
            {theme === "light"
              ? "🌙"
              : "☀️"}
          </button>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </div>

    </header>

  );

}

export default Navbar;