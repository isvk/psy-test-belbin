import bottle from "src/services";
import { call, put, takeEvery } from "@redux-saga/core/effects";
import * as types from "./types";
import { loadQuestionsSuccess } from "./actions";
import { setStatusAsync } from "src/store/main/actions";
import { loadStatus } from "src/store/loadStatus";

function* loadQuestionsAsync(services: typeof bottle) {
    try {
        const questions = yield call(services.container.ApiQuestion.loadQuestions);
        yield put(loadQuestionsSuccess(questions));
        yield put(setStatusAsync("loadQuestions", loadStatus.loaded));
    } catch (e) {
        yield put(setStatusAsync("loadQuestions", loadStatus.errorServer));
        console.error("Server error while loading questions!");
        console.error(e);
    }
}

export default function* questionSaga(services: typeof bottle) {
    yield takeEvery(types.LOAD_QUESTIONS, loadQuestionsAsync, services);
}
