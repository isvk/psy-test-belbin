import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { History, LocationState } from "history";
import auth, { TStoreAuth } from "src/store/auth/reducer";
import users, { TStoreUser } from "src/store/users/reducer";
import main, { TStoreMain } from "src/store/main/reducer";

export interface IStore {
    router: typeof connectRouter;
    auth: TStoreAuth;
    users: TStoreUser;
    main: TStoreMain;
}

const createRootReducer = (history: History<LocationState>) =>
    combineReducers({
        router: connectRouter(history),
        auth,
        users,
        main,
    });

export default createRootReducer;
