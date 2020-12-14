import { createSelector } from "reselect";
import { Map } from "immutable";
import { IStore } from "src/store/rootReducer";
import { getStatusAsync } from "src/store/main/selectors";
import Role, { sortValue } from "src/models/role";
import { TStoreRole } from "./roles/reducer";

const propsFirstSelector = (_: IStore, prop: any) => prop;

export const mainState = (state: Readonly<IStore>) => state.main;
export const mainGetStatusAsync = createSelector(mainState, getStatusAsync);

export const blockState = (state: Readonly<IStore>) => state.blocks;
export const blockGetBlockById = createSelector(blockState, propsFirstSelector, (blocks, id) => {
    return blocks.filter((block) => block.id === id);
});

export const roleState = (state: Readonly<IStore>) => state.roles;
export const rolesGetRoleCalculatedValue = (state: Readonly<IStore>): TStoreRole => {
    let result: TStoreRole = Map<Role["id"], Role>();
    state.roles.forEach((role) => {
        let sumValue = state.questions
            .filter((question) => question.role === role.id)
            .reduce((sum, question) => sum + question.value, 0);

        result = result.set(role.id, role.set("value", sumValue));
    });

    return result;
};
export const rolesGetRoleCalculatedValueSort = createSelector(rolesGetRoleCalculatedValue, sortValue);

export const questionState = (state: Readonly<IStore>) => state.questions;
export const questionsGetQuestionByBlock = createSelector(questionState, propsFirstSelector, (questions, id) => {
    return questions.filter((question) => question.block === id);
});
