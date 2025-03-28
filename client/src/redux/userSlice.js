import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/api/users");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch users");
  }
});

// Get a specific user by ID
export const getUserById = createAsyncThunk("users/getUserById", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch user details");
  }
});

// Create a new user
export const createUser = createAsyncThunk("users/createUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/users", userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to create user");
  }
});

// Update a user
export const updateUser = createAsyncThunk("users/updateUser", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/api/users/${id}`, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to update user");
  }
});

// Deactivate a user (sets active=false)
export const deactivateUser = createAsyncThunk("users/deactivateUser", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.patch(`/api/users/${id}/deactivate`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to deactivate user");
  }
});

// Delete a user
export const deleteUser = createAsyncThunk("users/deleteUser", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/users/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to delete user");
  }
});

// Migrate user to a new company
export const migrateUser = createAsyncThunk(
  "users/migrateUser",
  async ({ userId, newCompanyId }, { rejectWithValue }) => {
    try {
      //console.log("CM", userId);
      console.log("Migrating User:", { userId, newCompanyId });
      
      const response = await axios.patch(`/api/users/${userId}/migrate`, { newCompanyId }, { 
        validateStatus: (status) => status < 500 // Reject only 4xx, not 5xx
      });
      return response.data; // Expect success message from backend
    } catch (error) {
      console.error("Migration Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: "Failed to migrate user" });
    }
  }
);


const userSlice = createSlice({
  name: "users",
  initialState: { users: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        console.log("Fetched User by ID in Redux:", action.payload);
        state.selectedUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload.data);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deactivateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.users[index].active = false;
      })
      .addCase(deactivateUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(migrateUser.fulfilled, (state, action) => {
        console.log("Migration response:", action.payload);
        if (!Array.isArray(state.users)) return;
        const { id, companyId } = action.payload; 
        const index = state.users.findIndex((u) => u.id === id);
        if (index !== -1) {
          state.users[index].companyId = companyId;
        }
      })
      .addCase(migrateUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default userSlice.reducer;
