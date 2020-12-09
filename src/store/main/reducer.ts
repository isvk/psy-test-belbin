import { ActionTypesInfer } from "src/store/actionTypes";
import Main from "src/models/main";
import * as types from "./types";
import * as actions from "./actions";

export type TStoreMain = Main;

const reducer = (state: TStoreMain = new Main(), action: ActionTypesInfer<typeof actions>) => {
    switch (action.type) {
        case types.SET_SEARCH_WORD:
            return state.set("searchWord", action.searchWord);

        case types.SET_SORT:
            return state.set("sort", action.sort);

        case types.SET_STATUS_ASYNC:
            return state.set("statusAsync", { ...state.statusAsync, [action.status]: action.value });

        default:
            return state;
    }
};

export default reducer;
