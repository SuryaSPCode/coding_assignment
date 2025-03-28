import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/CompanyAdmin.css";
import { Link } from "react-router-dom";
import { showToast } from "../utils/toastService";
import {
  fetchCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  manageCompanyUsers,
  getCompanyById
} from "../redux/companySlice";

const CompanyAdmin = () => {
  const dispatch = useDispatch();
  const { companies, loading, error } = useSelector((state) => state.companies);
  const selectedCompany = useSelector((state) => state.companies.selectedCompany);

  console.log("Companies data:", companies); 

  const [companyData, setCompanyData] = useState({ name: "", address: "" });
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [userId, setUserId] = useState("");
  const [actionType, setActionType] = useState("add");
  const [companyId, setCompanyId] = useState("");


  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  const handleCreateCompany = () => {
    dispatch(createCompany(companyData))
      .unwrap()
      .then(() => {
        showToast("success", "Company Created Successfully!");
        setCompanyData({ name: "", address: "" });
      })
      .catch(() => {
        showToast("error", "Failed to create company");
      });
  };

  const handleUpdateCompany = () => {
    if (selectedCompanyId) {
      dispatch(updateCompany({ id: selectedCompanyId, data: companyData }))
      .unwrap()
      .then(() => {
        showToast("info", "Updated Company Successfully!");
        setSelectedCompanyId(null);
        setCompanyData({ name: "", address: "" });
      })
      .catch(() => {
        showToast("error", "Updated Failed");
      });
    }
  };

  const handleDeleteCompany = (id) => {
    dispatch(deleteCompany(id));
  };

  const handleManageCompanyUsers = () => {
    if (selectedCompanyId && userId) {
      dispatch(manageCompanyUsers({ companyId: selectedCompanyId, userId, action: actionType }));
      showToast("success","User got Moved to Different Company");
      setUserId("");
    }
  };

  const handleEditCompany = (company) => {
    setSelectedCompanyId(company.id);
    setCompanyData({ name: company.name, address: company.address });
  };

  const handleGetCompanyById = () => {
    if (companyId) {
      dispatch(getCompanyById(companyId));
    }
  };
  

  return (
    <div className="container">
  <h2>Manage Companies</h2>

  {error && <p className="error">{error}</p>}
  {loading && <p>Loading...</p>}

  <input
    type="text"
    placeholder="Company Name"
    value={companyData.name}
    onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
  />

  <input
    type="text"
    placeholder="Address"
    value={companyData.address}
    onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
  />

  <button onClick={handleCreateCompany}>Create Company</button>
  <button onClick={handleUpdateCompany} disabled={!selectedCompanyId}>Update Company</button>

  <h3>Find Company by ID</h3>
  <input
    type="text"
    placeholder="Enter Company ID"
    value={companyId}
    onChange={(e) => setCompanyId(e.target.value)}
  />
  <button onClick={handleGetCompanyById}>Get Company</button>

  {selectedCompany && (
    <div className="company-details">
      <h3>Company Details</h3>
      <p><strong>Name:</strong> {selectedCompany.data.name}</p>
      <p><strong>Address:</strong> {selectedCompany.data.address}</p>
    </div>
  )}

  {companies.length === 0 ? (
    <p>No companies available. Add a new company.</p>
  ) : (
    <ul className="company-list">
      {companies.map((company) => (
        <li key={company.id}>
          {company.name} - {company.address}
          <button onClick={() => handleEditCompany(company)}>Edit</button>
          <button onClick={() => handleDeleteCompany(company.id)}>Delete</button>
          <Link to={`/company/details/${company.id}`}>Location</Link>
        </li>
      ))}
    </ul>
  )}

  <h3>Manage Company Users</h3>
  <select onChange={(e) => setSelectedCompanyId(e.target.value)}>
    <option value="">Select Company</option>
    {companies.map((company) => (
      <option key={company.id} value={company.id}>
        {company.name}
      </option>
    ))}
  </select>

  <input type="text" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
  <select onChange={(e) => setActionType(e.target.value)}>
    <option value="add">Add User</option>
    <option value="remove">Remove User</option>
  </select>
  <button onClick={handleManageCompanyUsers}>Manage User</button>
</div>

  );
};

export default CompanyAdmin;
