import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../../models/User";

interface InitialState {
    user: User | null;
    loggedIn: boolean;
}

const init = () => {
    const initialState: InitialState = {
        user: null,
        loggedIn: false
    }

    return initialState;
}

export const userSlice = createSlice({
    name: "user",
    initialState: init(),
    reducers: {
        setCurrentUser: (state, action) => {
            state.user = action.payload;
            state.loggedIn = true;
        },
        setLogOut: (state) => {
            state.user = null;
            state.loggedIn = false;
            localStorage.removeItem("user");
        }

    },
});

export const { setCurrentUser, setLogOut } = userSlice.actions