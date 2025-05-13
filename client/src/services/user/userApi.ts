import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { UserResponse } from "../../models/UserResponse";
import type { LoginModel } from "../../models/LoginModel";
import type UserRegisterModel from "../../models/UserRegisterModel";
import { getJwtTokenFromLocalStorage } from "../../util/utility";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_APP_API_URL,
        credentials: 'include',
    }),
    tagTypes: ['User'],
    endpoints: (build) => {
        return {
            login: build.mutation<UserResponse, LoginModel | null>({
                query: (credentials) => (
                    {
                        url: "user/login",
                        method: "POST",
                        body: credentials
                    }
                ),
                invalidatesTags: ['User']
            }),
            refresh: build.mutation<UserResponse, void>({
                query: () => ({
                    url: "user/refresh",
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${getJwtTokenFromLocalStorage()}`
                    }
                })
            }),
            registerUser: build.mutation<string, UserRegisterModel>({
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

export const { useLoginMutation, useRefreshMutation, useRegisterUserMutation } = userApi;