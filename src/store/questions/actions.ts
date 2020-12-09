import * as types from "./types";
import User from "src/models/user";

export const loadUsers = () =>
    ({
        type: types.LOAD_USERS,
    } as const);

export const loadUsersSuccess = (users: User[]) =>
    ({
        type: types.LOAD_USERS_SUCCESS,
        users,
    } as const);

export const loadUserById = (id: User["id"]) =>
    ({
        type: types.LOAD_USER_BY_ID,
        id,
    } as const);

export const loadUserByIdSuccess = (user: User) =>
    ({
        type: types.LOAD_USER_BY_ID_SUCCESS,
        user,
    } as const);

export const createUser = (user: User) =>
    ({
        type: types.CREATE_USER,
        user,
    } as const);

export const createUserSuccess = (user: User) =>
    ({
        type: types.CREATE_USER_SUCCESS,
        user,
    } as const);

export const updateUser = (user: User) =>
    ({
        type: types.UPDATE_USER,
        user,
    } as const);

export const updateUserSuccess = (user: User) =>
    ({
        type: types.UPDATE_USER_SUCCESS,
        user,
    } as const);
