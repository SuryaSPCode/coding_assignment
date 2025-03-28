import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("http://localhost:8085/api/companies");
        setCompanies(response.data.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div>
      <h2>Company List</h2>
      {companies.length === 0 ? (
        <p>Loading or No Companies Found</p>
      ) : (
        <ul>
          {companies.map((company) => (
            <li key={company.id}>
              <Link to={`/company/details/${company.id}`}>{company.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompanyList;
