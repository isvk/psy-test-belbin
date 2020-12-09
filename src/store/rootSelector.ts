import { createSelector } from "reselect";
import { IStore } from "src/store/rootReducer";
import { getStatusAsync } from "./main/selectors";

const propsFirstSelector = (_: IStore, prop: any) => prop;

export const mainState = (state: Readonly<IStore>) => state.main;
export const mainGetStatusAsync = createSelector(mainState, getStatusAsync);

export const questionState = (state: Readonly<IStore>) => state.questions;
export const questionsGetQuestionByBlock = createSelector(questionState, propsFirstSelector, (questions, id) => {
    return questions.filter((question) => question.block === id);
});
