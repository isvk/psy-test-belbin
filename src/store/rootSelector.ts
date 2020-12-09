import { createSelector } from "reselect";
import { IStore } from "src/store/rootReducer";
import { getToken, getRedirectUrl } from "src/store/auth/selectors";
import { getSearchWord, getSort, getStatusAsync } from "src/store/main/selectors";
import { filterByPartUsername, sortByField } from "src/models/user";

const propsFirstSelector = (_: IStore, prop: any) => prop;

export const authState = (state: Readonly<IStore>) => state.auth;
export const authGetToken = createSelector(authState, getToken);
export const authGetRedirectUrl = createSelector(authState, getRedirectUrl);

export const mainState = (state: Readonly<IStore>) => state.main;
export const mainGetSearchWord = createSelector(mainState, getSearchWord);
export const mainGetSort = createSelector(mainState, getSort);
export const mainGetStatusAsync = createSelector(mainState, getStatusAsync);

export const userState = (state: Readonly<IStore>) => state.users;
export const userStateFilterByPartUsername = (state: Readonly<IStore>) => {
    if (state.main.searchWord.length === 0) return state;
    return { ...state, users: filterByPartUsername(state.users, state.main.searchWord) };
};
export const usersGetUserFilterByPartUsername = createSelector(userStateFilterByPartUsername, userState);
export const userStateSort = (state: Readonly<IStore>) => {
    return { ...state, users: sortByField(state.users, state.main.sort.field, state.main.sort.isAscending) };
};
export const usersGetUsersSort = createSelector(userStateSort, userState);
export const userStateUserFilterByPartUsernameAndSort = createSelector(userStateFilterByPartUsername, userStateSort);
export const usersGetUsersFilterByPartUsernameAndSort = createSelector(
    userStateUserFilterByPartUsernameAndSort,
    userState
);
export const usersGetUserById = createSelector(userState, propsFirstSelector, (users, id) => {
    return users.find((user) => user.id === id);
});
