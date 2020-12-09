import * as types from "./types";
import Main from "src/models/main";
import { loadStatus } from "src/store/loadStatus";
import { saveStatus } from "src/store/saveStatus";
import { authStatus } from "src/store/authStatus";

export const setSearchWord = (searchWord: Main["searchWord"]) =>
    ({
        type: types.SET_SEARCH_WORD,
        searchWord,
    } as const);

export const setSort = (sort: Main["sort"]) =>
    ({
        type: types.SET_SORT,
        sort,
    } as const);

export const setStatusAsync = (status: keyof Main["statusAsync"], value: loadStatus | saveStatus | authStatus) =>
    ({
        type: types.SET_STATUS_ASYNC,
        status,
        value,
    } as const);
