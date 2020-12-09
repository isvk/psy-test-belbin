import React from "react";
import styled from "styled-components";
import useCustomDispatch from "src/hooks/useCustomDispatch";
import useCustomSelector from "src/hooks/useCustomSelector";
import { setValue } from "src/store/questions/actions";
import { loadStatus } from "src/store/loadStatus";
import { mainGetStatusAsync, questionsGetQuestionByBlock } from "src/store/rootSelector";
import { IQuestion } from "src/models/question";
import Alert from "src/components/Alert/Alert";
import LoadQuestions from "src/components/Loading/LoadQuestions";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

export default function TestPage() {
    const dispatch = useCustomDispatch();
    const statusAsync = useCustomSelector(mainGetStatusAsync);
    const questions = useCustomSelector(questionsGetQuestionByBlock, 1);
    const classes = useStyles();

    const sumValueQuestions = questions.reduce<number>((sum, question) => sum + question.value, 0);
    const possibleMaximumValueQuestion = 10 - sumValueQuestions;

    const handleChangeQuestion = (event: any, newValue: number | number[], id: IQuestion["id"]) => {
        if (sumValueQuestions < 10) {
            dispatch(setValue(id, Number(newValue)));
        } else {
            dispatch(setValue(id, Number(newValue) - (sumValueQuestions - 10)));
        }
    };

    if (statusAsync.loadQuestions === loadStatus.notLoaded && questions.size === 0) {
        return <LoadQuestions />;
    } else if (statusAsync.loadQuestions === loadStatus.load) {
        return <Alert type="preload" text="Загрузка вопросов" />;
    } else if (statusAsync.loadQuestions === loadStatus.errorServer) {
        return <Alert type="warning" text="Ошибка загрузки вопросов" />;
    } else if (questions.size > 0) {
        return (
            <div>
                <Typography gutterBottom variant={"h5"} component={"h1"}>
                    Страница прохождения теста
                </Typography>

                {questions.valueSeq().map((question) => (
                    <WrapperQuestion key={question.id}>
                        <WrapperLabel>
                            <Typography id={"slider-question-" + question.id} gutterBottom>
                                {question.text}
                            </Typography>
                        </WrapperLabel>

                        <WrapperSlider paddingRight={(question.value + possibleMaximumValueQuestion) * 10}>
                            <div className={classes.root}>
                                <Slider
                                    onChange={(event: any, newValue: number | number[]) =>
                                        handleChangeQuestion(event, newValue, question.id)
                                    }
                                    value={question.value}
                                    defaultValue={0}
                                    aria-labelledby={"slider-question-" + question.id}
                                    aria-valuemax={5}
                                    step={1}
                                    min={0}
                                    max={question.value + possibleMaximumValueQuestion}
                                    valueLabelDisplay="on"
                                    marks={marks()}
                                    disabled={question.value + possibleMaximumValueQuestion === 0}
                                />
                            </div>
                        </WrapperSlider>
                    </WrapperQuestion>
                ))}
            </div>
        );
    }

    return <Alert type="warning" text="Не предвиденная ошибка" />;
}

const WrapperQuestion = styled.div`
    margin: 2em 0;
`;

const WrapperSlider = styled.div`
    display: flex;
    width: ${(props: { paddingRight: number }) => (props.paddingRight > 0 ? props.paddingRight : 10)}%;
`;

const WrapperLabel = styled.div`
    padding-bottom: 1.75em;
    user-select: none;
`;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
        },
        margin: {
            height: theme.spacing(3),
        },
    })
);

const marks = () => {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mark) => {
        return { value: mark, label: mark + "" };
    });
};
