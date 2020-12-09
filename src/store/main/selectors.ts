import { TStoreMain } from "./reducer";

export const getSearchWord = (state: TStoreMain) => state.searchWord;
export const getSort = (state: TStoreMain) => state.sort;
export const getStatusAsync = (state: TStoreMain) => state.statusAsync;
