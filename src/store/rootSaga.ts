import { all } from "redux-saga/effects";
import Bottle from "bottlejs";
import authSaga from "src/store/auth/saga";
import userSaga from "src/store/users/saga";

export default (services: Bottle) => {
    return function* rootSaga() {
        yield all([authSaga(services), userSaga(services)]);
    };
};
