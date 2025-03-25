import { Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Home from "./pages/Home";
import CompanyDetail from "./pages/CompanyDetail";
import CompanyAdmin from "./components/CompanyAdmin";
import UserAdmin from "./components/UserAdmin";

function App() {
  return (
    <Provider store={store}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Company & User Management</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/company/:id" element={<CompanyDetail />} />
          <Route path="/admin/companies" element={<CompanyAdmin />} />
          <Route path="/admin/users" element={<UserAdmin />} />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
