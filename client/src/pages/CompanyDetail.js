import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CompanyMap from "../components/CompanyMap";

const CompanyDetail = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8085/api/companies/${id}`)
      .then((res) => setCompany(res.data.data))
      .catch((err) => console.error(err));
  }, [id]);
  
  return company ? (
    <div>
      <h2>{company.name}</h2>
      <p>{company.address}</p>
      <CompanyMap lat={company.lat} lng={company.lng} />
    </div>
  ) : <p>Loading...</p>;
};

export default CompanyDetail;
