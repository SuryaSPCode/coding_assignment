import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h2>Welcome to the Management System</h2>
      <nav>
        <ul>
          <li><Link to="/admin/companies">Manage Companies</Link></li>
          <li><Link to="/admin/users">Manage Users</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;
