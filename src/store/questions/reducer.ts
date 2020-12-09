import { Map } from "immutable";
import { ActionTypesInfer } from "src/store/actionTypes";
import User from "src/models/user";
import * as types from "./types";
import * as actions from "./actions";

export type TStoreUser = Map<User["id"], User>;

const reducer = (state: TStoreUser = Map(), action: ActionTypesInfer<typeof actions>) => {
    switch (action.type) {
        case types.LOAD_USERS_SUCCESS:
            action.users.forEach((user: User) => {
                if (!state.has(user.id)) {
                    state = state.set(user.id, user);
                }
            });
            return state;

        case types.LOAD_USER_BY_ID_SUCCESS:
            if (!state.has(action.user.id)) {
                state = state.set(action.user.id, action.user);
            }
            return state;

        case types.CREATE_USER_SUCCESS:
            return state.set(action.user.id, action.user);

        case types.UPDATE_USER_SUCCESS:
            return state.set(action.user.id, action.user);

        default:
            return state;
    }
};

export default reducer;
