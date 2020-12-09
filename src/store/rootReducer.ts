import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { History, LocationState } from "history";
import main, { TStoreMain } from "src/store/main/reducer";
import questions, { TStoreQuestion } from "src/store/questions/reducer";

export interface IStore {
    router: typeof connectRouter;
    main: TStoreMain;
    questions: TStoreQuestion;
}

const createRootReducer = (history: History<LocationState>) =>
    combineReducers({
        router: connectRouter(history),
        main,
        questions,
    });

export default createRootReducer;
