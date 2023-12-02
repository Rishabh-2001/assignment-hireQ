import { configureStore } from "@reduxjs/toolkit";
import usersSlice from "./slices/users.slice";



export default configureStore({
    reducer:{
        users: usersSlice,
    }
})

