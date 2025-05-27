import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { rtkQueryErrorLogger } from "./middleware/rtkQueryErrorLogger";
import { userApi } from "./user/userApi";
import { userSlice } from "./user/userSlice";
import { connectionUserSlice } from "./signalR/connectionUserSlice";

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        [userApi.reducerPath]: userApi.reducer,
        room: connectionUserSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({})
            .concat([
                userApi.middleware
            ])
            .prepend(rtkQueryErrorLogger);
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();