import bottle from "src/services";
import { call, put, takeEvery } from "@redux-saga/core/effects";
import * as types from "./types";
import {
    createUser,
    createUserSuccess,
    loadUserById,
    loadUserByIdSuccess,
    loadUsersSuccess,
    updateUser,
    updateUserSuccess,
} from "./actions";
import { push } from "connected-react-router";
import { setStatusAsync } from "src/store/main/actions";
import { loadStatus } from "src/store/loadStatus";
import { saveStatus } from "src/store/saveStatus";

function* loadUsersAsync(services: typeof bottle) {
    try {
        const users = yield call(services.container.ApiUser.loadUsers);
        yield put(loadUsersSuccess(users));
        yield put(setStatusAsync("loadUsers", loadStatus.loaded));
    } catch (e) {
        yield put(setStatusAsync("loadUsers", loadStatus.errorServer));
        console.error("Server error while loading users!");
        console.error(e);
    }
}

function* loadUserByIdAsync(services: typeof bottle, action: ReturnType<typeof loadUserById>) {
    try {
        const user = yield call(services.container.ApiUser.loadUser, action.id);
        yield put(loadUserByIdSuccess(user));
        yield put(setStatusAsync("loadUser", loadStatus.loaded));
    } catch (e) {
        yield put(setStatusAsync("loadUser", loadStatus.errorServer));
        console.error("Server error while loading user by id!");
        console.error(e);
    }
}

function* createUserAsync(services: typeof bottle, action: ReturnType<typeof createUser>) {
    try {
        const user = yield call(services.container.ApiUser.createUser, action.user);
        yield put(createUserSuccess(user));
        yield put(setStatusAsync("saveUser", saveStatus.saved));
        yield put(push("/users/" + user.id));
    } catch (e) {
        yield put(setStatusAsync("saveUser", saveStatus.errorServer));
        console.error("Server error while creating users!");
        console.error(e);
    }
}

function* updateUserAsync(services: typeof bottle, action: ReturnType<typeof updateUser>) {
    try {
        const user = yield call(services.container.ApiUser.updateUser, action.user);
        yield put(updateUserSuccess(user));
        yield put(setStatusAsync("saveUser", saveStatus.saved));
    } catch (e) {
        yield put(setStatusAsync("saveUser", saveStatus.errorServer));
        console.error("Server error while saving users!");
        console.error(e);
    }
}

export default function* userSaga(services: typeof bottle) {
    yield takeEvery(types.LOAD_USERS, loadUsersAsync, services);
    yield takeEvery(types.LOAD_USER_BY_ID, loadUserByIdAsync, services);
    yield takeEvery(types.CREATE_USER, createUserAsync, services);
    yield takeEvery(types.UPDATE_USER, updateUserAsync, services);
}
