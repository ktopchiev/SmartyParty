import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User } from "../../models/User";
import type { LoginRequest } from "../../models/LoginRequest";
import type RegisterRequest from "../../models/RegisterRequest";
import { getJwtTokenFromLocalStorage } from "../../util/utilities";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_APP_API_URL,
        credentials: 'include',
    }),
    tagTypes: ['User'],
    endpoints: (build) => {
        return {
            login: build.mutation<User, LoginRequest | null>({
                query: (credentials) => (
                    {
                        url: "user/login",
                        method: "POST",
                        body: credentials
                    }
                ),
                invalidatesTags: ['User']
            }),
            refresh: build.mutation<User, void>({
                query: () => ({
                    url: "user/refresh",
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${getJwtTokenFromLocalStorage()}`
                    }
                })
            }),
            userRegister: build.mutation<string, RegisterRequest>({
                query: (credentials) => ({
                    url: "user/register",
                    method: "POST",
                    body: credentials
                }),
                invalidatesTags: ['User']
            }),
        }
    }
})

export const { useLoginMutation, useRefreshMutation, useUserRegisterMutation } = userApi;