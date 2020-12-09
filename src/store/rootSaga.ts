import { all } from "redux-saga/effects";
import Bottle from "bottlejs";
import questionSaga from "src/store/questions/saga";

export default (services: Bottle) => {
    return function* rootSaga() {
        yield all([questionSaga(services)]);
    };
};
