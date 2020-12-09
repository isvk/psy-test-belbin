import React from "react";
import useCustomSelector from "src/hooks/useCustomSelector";
import { loadStatus } from "src/store/loadStatus";
import { mainGetStatusAsync, questionState } from "src/store/rootSelector";
import Alert from "src/components/Alert/Alert";
import LoadQuestions from "src/components/Loading/LoadQuestions";

export default function TestPage() {
    const statusAsync = useCustomSelector(mainGetStatusAsync);
    const questions = useCustomSelector(questionState);

    if (statusAsync.loadQuestions === loadStatus.notLoaded && questions.size === 0) {
        return <LoadQuestions />;
    } else if (statusAsync.loadQuestions === loadStatus.load) {
        return <Alert type="preload" text="Загрузка вопросов" />;
    } else if (statusAsync.loadQuestions === loadStatus.errorServer) {
        return <Alert type="warning" text="Ошибка загрузки вопросов" />;
    } else if (questions.size > 0) {
        return (
            <div>
                <h1>Страница прохождения теста</h1>
                {questions.valueSeq().map((question) => (
                    <div key={question.id}>{question.text}</div>
                ))}
            </div>
        );
    }

    return <Alert type="warning" text="Не предвиденная ошибка" />;
}
