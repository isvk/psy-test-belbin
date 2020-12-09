import { Record } from "immutable";

export interface IQuestion {
    id: number;
    block: number;
    text: string;
}

export const initialQuestion: IQuestion = {
    id: 0,
    block: 0,
    text: "",
};

export default class Question extends Record(initialQuestion) {}
