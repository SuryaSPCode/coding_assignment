import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API Base URL
const API_URL = "/api/companies"; 

// Async Thunks
export const fetchCompanies = createAsyncThunk("companies/fetchCompanies", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch companies");
  }
});

export const getCompanyById = createAsyncThunk("companies/getCompanyById", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to get company");
  }
});

export const createCompany = createAsyncThunk("companies/createCompany", async (companyData, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL, companyData);
    console.log("Response", response);
    
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to create company");
  }
});

export const updateCompany = createAsyncThunk("companies/updateCompany", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to update company");
  }
});

export const deleteCompany = createAsyncThunk("companies/deleteCompany", async (id, { rejectWithValue }) => {
  try {
    console.log("ID", id);
    
    await axios.delete(`${API_URL}/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to delete company");
  }
});

export const manageCompanyUsers = createAsyncThunk("companies/manageCompanyUsers", async ({ companyId, userId, action }, { rejectWithValue }) => {
  try {
    const response = await axios.patch(`${API_URL}/${companyId}/users`, { userId, action });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to manage company users");
  }
});

// Company Slice
const companySlice = createSlice({
  name: "companies",
  initialState: {
    companies: [],
    selectedCompany: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        console.log("Fetched Companies:", action.payload);
        state.loading = false;
        state.companies = action.payload.data || [];
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCompanyById.pending, (state) => {
        state.loading = true;
        state.selectedCompany = null;
        state.error = null;
      })
      .addCase(getCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCompany = action.payload;
      })
      .addCase(getCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        if (!Array.isArray(state.companies)) {
          state.companies = [];
        }
        state.companies.push(action.payload);
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        const index = state.companies.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.companies = state.companies.filter((c) => c.id !== action.payload);
      })
      .addCase(manageCompanyUsers.fulfilled, (state, action) => {
        console.log("API Response:", action.payload);
        const { companyId, updatedUsers } = action.payload; // Ensure API returns these
        const index = state.companies.findIndex((c) => c.id === companyId);
      
        if (index !== -1) {
          state.companies[index] = {
            ...state.companies[index],
            users: updatedUsers, // Only update users list, keep other data intact
          };
        }
      });
  },
});

export default companySlice.reducer;
