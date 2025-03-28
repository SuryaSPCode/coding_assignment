import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../utils/toastService";
import "../styles/UserAdmin.css";
import {
  fetchUsers,
  getUserById,
  createUser,
  updateUser,
  deactivateUser,
  deleteUser,
  migrateUser,
} from "../redux/userSlice";
import { fetchCompanies } from "../redux/companySlice";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const { companies } = useSelector((state) => state.companies);
  const [migrationError, setMigrationError] = useState(null);
  const selectedUser = useSelector((state) => state.users.selectedUser);
  console.log("Selected User from Redux:", selectedUser);
  
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    designation: "",
    dateOfBirth: "",
    active: true,
    companyId: "",
  });
  
  const [selectedUserId, setSelectedUserId] = useState("");
  const [targetCompanyId, setTargetCompanyId] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchCompanies());
  }, [dispatch]);

  const handleCreateUser = () => {
    console.log("DATA", userData);
    
    dispatch(createUser(userData));
    showToast("success","Created Successfully");
    setUserData({ firstName: "", lastName: "", email: "", active: true, companyId: "" });
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    if (selectedUserId) {
      dispatch(updateUser({ id: selectedUserId, data: userData }))
        .unwrap()
        .then(() => {
          console.log("User updated successfully!");
          dispatch(fetchUsers());
          setSelectedUserId("");
          setUserData({
            firstName: "",
            lastName: "",
            email: "",
            designation: "",
            dateOfBirth: "",
            active: true,
            companyId: "",
          });
        })
        .catch((error) => console.error("Update error:", error));
        showToast("success","Updated Successfully");
    }
  };

  const handleDeactivateUser = (id) => {
    dispatch(deactivateUser(id));
    showToast("success","Deactived Successfully");
  };

  const handleDeleteUser = (id) => {
    dispatch(deleteUser(id));
    showToast("success","Deleted Successfully");
  };

  const handleGetUserById = async () => {
    if (selectedUserId) {
      dispatch(getUserById(selectedUserId));
    }
  };

  const handleMigrateUser = async () => {
  console.log("selectedUserId:", selectedUserId);
  console.log("targetCompanyId:", targetCompanyId);

  if (!selectedUserId || !targetCompanyId) {
    console.error("User ID or Target Company ID is missing!");
    return;
  }

  try {
    console.log("Dispatching migrateUser...");
    const response = await dispatch(migrateUser({ userId: selectedUserId, newCompanyId: targetCompanyId })).unwrap();
    console.log("Migration Success:", response);
    showToast("success","Migrated")
    dispatch(fetchUsers()); // Refresh list
  } catch (error) {
    setMigrationError(true);
    console.error("Migration Error:", error);
  }

  setSelectedUserId("");
  setTargetCompanyId("");
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Creating User:", userData);
    dispatch(createUser(userData));
    setUserData({ firstName: "", lastName: "", email: "", designation: "", dateOfBirth: "", active: true });
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEditUser = async (id) => {
    setSelectedUserId(id); // Store selected user ID
    dispatch(getUserById(id)) // Fetch user details from API
      .unwrap()
      .then((user) => {
        setUserData({
          firstName: user.data.firstName,
          lastName: user.data.lastName,
          email: user.data.email,
          designation: user.data.designation,
          dateOfBirth: user.data.dateOfBirth,
          active: user.data.active,
          companyId: user.data.companyId,
        });
      })
      .catch((error) => console.error("Error fetching user:", error));
  };
  
  


  return (
    <div>
      <h2>Manage Users</h2>
      <form onSubmit={selectedUserId ? handleUpdateUser : handleCreateUser}>
        <input type="text" name="firstName" placeholder="First Name" value={userData.firstName} onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Last Name" value={userData.lastName} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleChange} required />
        <input type="text" name="designation" placeholder="Designation" value={userData.designation} onChange={handleChange} required />
        <input type="date" name="dateOfBirth" value={userData.dateOfBirth} onChange={handleChange} required />
        
        <label>
          Active:
          <input type="checkbox" name="active" checked={userData.active} onChange={handleChange} />
        </label>

        <select value={userData.companyId} onChange={(e) => setUserData({ ...userData, companyId: e.target.value })}>
        <option value="">Select Company</option>
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>

        <button type="submit">Create User</button>
      </form>
      {/* <button onClick={handleCreateUser}>Create User</button> */}
      <br />

      <input
        type="text"
        placeholder="Enter User ID"
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
      />
      <button onClick={handleGetUserById}>Get User</button>
      <button onClick={handleUpdateUser}>Update User</button>

      {/* Show user details if selectedUser exists */}
      {selectedUser && selectedUser.data && (
        <div>
        <h3>User Details</h3>
        <p><strong>Name:</strong> {selectedUser.data?.firstName} {selectedUser.data?.lastName}</p>
        <p><strong>Email:</strong> {selectedUser.data?.email}</p>
        <p><strong>Designation:</strong> {selectedUser.data?.designation}</p>
        <p><strong>Date of Birth:</strong> {selectedUser.data?.dateOfBirth}</p>
        <p><strong>Active:</strong> {selectedUser.data?.active ? "Yes" : "No"}</p>
        <p><strong>Company:</strong> {selectedUser.data?.companyId}</p>
      </div>
      )}

      <h3>Migrate User</h3>
      <input
        type="text"
        placeholder="User ID"
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
      />
      <select value={targetCompanyId} onChange={(e) => setTargetCompanyId(e.target.value)}>
        <option value="">Select Target Company</option>
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
      <button onClick={handleMigrateUser}>Migrate User</button>

      <div>
        {migrationError && <p style={{ color: "red" }}>{migrationError}</p>}
        {/* Migration form here */}
      </div>

    {/* Check if the user list is empty */}
    {users.length === 0 ? (
      <p>No users available. Add a new user.</p>
    ) : (
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.firstName} {user.lastName} - {user.email} 
            (Company: {user.companyId}) ({user.active ? "Active" : "Inactive"})
            <button onClick={() => handleEditUser(user.id)}>Edit</button>
            <button onClick={() => handleDeactivateUser(user.id)}>Deactivate</button>
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    )}
    </div>
  );
};

export default AdminPanel;
