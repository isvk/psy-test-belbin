import { Record } from "immutable";
import { loadStatus } from "src/store/loadStatus";

export interface IMain {
    statusAsync: { loadQuestions: loadStatus };
}

const initialMain: IMain = {
    statusAsync: {
        loadQuestions: loadStatus.notLoaded,
    },
};

export default class Main extends Record(initialMain) {}
