import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const [companies, setCompanies] = useState([]);
  console.log("Companies",companies.map((company) => company.id));
  
  useEffect(() => {
    fetch("/api/companies")
    .then((res) => res.json())
    .then((data) => setCompanies(data.data));
  }, []);
  if (!companies) return <p>Loading...</p>;
  return (
    <div>
      <h2>Welcome to the Management System</h2>
      <nav>
        <ul>
          <li><Link to="/admin/companies">Manage Companies</Link></li>
          <li><Link to="/admin/users">Manage Users</Link></li>
          <li><Link to="/company/details">Company Details</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;
