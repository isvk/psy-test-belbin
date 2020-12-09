import * as types from "./types";
import Question from "src/models/question";

export const loadQuestions = () =>
    ({
        type: types.LOAD_QUESTIONS,
    } as const);

export const loadQuestionsSuccess = (questions: Question[]) =>
    ({
        type: types.LOAD_QUESTIONS_SUCCESS,
        questions,
    } as const);
