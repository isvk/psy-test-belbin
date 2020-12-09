import { createSelector } from "reselect";
import { IStore } from "src/store/rootReducer";
import { getStatusAsync } from "./main/selectors";

const propsFirstSelector = (_: IStore, prop: any) => prop;

export const mainState = (state: Readonly<IStore>) => state.main;
export const mainGetStatusAsync = createSelector(mainState, getStatusAsync);

export const blockState = (state: Readonly<IStore>) => state.blocks;
export const blockGetBlockById = createSelector(blockState, propsFirstSelector, (blocks, id) => {
    return blocks.filter((block) => block.id === id);
});

export const roleState = (state: Readonly<IStore>) => state.roles;

export const questionState = (state: Readonly<IStore>) => state.questions;
export const questionsGetQuestionByBlock = createSelector(questionState, propsFirstSelector, (questions, id) => {
    return questions.filter((question) => question.block === id);
});
