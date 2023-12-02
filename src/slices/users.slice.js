import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const initialState = {
  state: {
    isFetching: false,
  },
  usersData: {
    isLoading: false,
    error: "",
    data: {},
  },
  deletedUsers: [],
};

export const getAllUsers = createAsyncThunk(
  "admin/getAllVender",
  async (_, thunkAPI) => {
    try {
      let url = `${BASE_URL}`;
      const response = await axios.get(url);

      return response?.data;
    } catch (error) {
      console.log("SE", error);
      return thunkAPI.rejectWithValue(error?.response?.data?.error);
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    deleteUser: (state, action) => {
      console.log("ACT", action);
      let allData = state?.usersData?.data;
      let deletedUserArr = action?.payload;

      for (let i = 0; i < deletedUserArr?.length; i++) {
        let updatedDeleteObj = deletedUserArr[i];
        updatedDeleteObj = { ...updatedDeleteObj, status: "INACTIVE" }; // this i did for status filter and handling the action button
        const newData =
          allData &&
          allData?.filter((item) => item?.id !== deletedUserArr[i]?.id);
        deletedUserArr[i] = updatedDeleteObj;
        allData = newData;
      }

      let prevDeleted = state.deletedUsers;
      let mergedNewDeletedUsers = prevDeleted.concat(deletedUserArr);
      state.deletedUsers = mergedNewDeletedUsers;
      state.usersData.data = allData;
      return;
      // Add other user properties as needed
    },
    saveEditedData: (state, action) => {
      state.usersData.data = action?.payload;
    },
  },
  extraReducers: {
    [getAllUsers.pending]: (state) => {
      state.usersData.isLoading = true;
    },
    [getAllUsers.fulfilled]: (state, action) => {
      state.usersData.isLoading = false;
      state.usersData.data = action?.payload;
      // return action?.payload;
    },
    [getAllUsers.rejected]: (state, action) => {
      state.usersData.isLoading = false;
      state.usersData.error = action.payload;
      console.log("Failed act", action);
    },
  },
});

export const { deleteUser, saveEditedData } = usersSlice.actions;

export default usersSlice.reducer;
