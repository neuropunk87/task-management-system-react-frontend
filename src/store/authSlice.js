import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./axiosInstance";

export const loginUser = createAsyncThunk("auth/loginUser", async (userData, { rejectWithValue}) => {
  try {
    const response = await axiosInstance.post("users/login/", userData);
    localStorage.setItem("token", response.data.access);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.detail || "Login failed");
  }
});

export const registerUser = createAsyncThunk("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("users/register/", userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.detail || "Registration failed");
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    localStorage.removeItem("token");
    return null;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchProfile = createAsyncThunk("auth/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("users/profile/");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.detail || "Failed to load profile");
  }
});

export const updateProfile = createAsyncThunk("auth/updateProfile", async (profileData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put("users/profile/", profileData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.detail || "Failed to update profile");
  }
});

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ old_password, new_password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("users/profile/change-password/", {
        old_password,
        new_password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Failed to change password");
    }
  }
);

export const uploadAvatar = createAsyncThunk("auth/uploadAvatar", async (file, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axiosInstance.put("users/profile/avatar/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.detail || "Failed to update avatar");
  }
});


const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.avatar = action.payload.data.avatar;
        }
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
