import { Record } from "immutable";
import { IUser } from "src/models/user";
import { loadStatus } from "src/store/loadStatus";
import { saveStatus } from "src/store/saveStatus";
import { authStatus } from "src/store/authStatus";

export interface IMain {
    searchWord: string;
    sort: { field: keyof IUser; isAscending: boolean };
    statusAsync: { authUser: authStatus; loadUser: loadStatus; loadUsers: loadStatus; saveUser: saveStatus };
}

const initialMain: IMain = {
    searchWord: "",
    sort: { field: "id", isAscending: true },
    statusAsync: {
        authUser: authStatus.notAuth,
        loadUser: loadStatus.notLoaded,
        loadUsers: loadStatus.notLoaded,
        saveUser: saveStatus.notSaved,
    },
};

export default class Main extends Record(initialMain) {}
