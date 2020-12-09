import { Map } from "immutable";
import { ActionTypesInfer } from "src/store/actionTypes";
import Question from "src/models/question";
import * as types from "./types";
import * as actions from "./actions";

export type TStoreQuestion = Map<Question["id"], Question>;

const reducer = (state: TStoreQuestion = Map(), action: ActionTypesInfer<typeof actions>) => {
    switch (action.type) {
        case types.LOAD_QUESTIONS_SUCCESS:
            action.questions.forEach((question: Question) => {
                if (!state.has(question.id)) {
                    state = state.set(question.id, question);
                }
            });
            return state;

        default:
            return state;
    }
};

export default reducer;
