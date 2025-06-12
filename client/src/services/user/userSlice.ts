import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../models/User";

interface InitialState {
    user: User | null;
    loggedIn: boolean;
    registered: boolean;
}

const init = () => {
    const initialState: InitialState = {
        user: null,
        loggedIn: false,
        registered: false,
    }

    return initialState;
}

export const userSlice = createSlice({
    name: "user",
    initialState: init(),
    reducers: {
        setCurrentUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.loggedIn = true;
        },
        setLogOut: (state) => {
            state.user = null;
            state.loggedIn = false;
            localStorage.removeItem("user");
        },
        setRegistered: (state, action: PayloadAction<boolean>) => {
            state.registered = action.payload;
        }

    },
});

export const { setCurrentUser, setLogOut, setRegistered } = userSlice.actions