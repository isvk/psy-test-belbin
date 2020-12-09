import React from "react";
import styled from "styled-components";
import useCustomDispatch from "src/hooks/useCustomDispatch";
import useCustomSelector from "src/hooks/useCustomSelector";
import { useParams } from "react-router";
import { setValue } from "src/store/questions/actions";
import { loadStatus } from "src/store/loadStatus";
import { blockState, mainGetStatusAsync, questionsGetQuestionByBlock } from "src/store/rootSelector";
import { IQuestion } from "src/models/question";
import Alert from "src/components/Alert/Alert";
import LoadBlocks from "src/components/Loading/LoadBlocks";
import LoadRoles from "src/components/Loading/LoadRoles";
import LoadQuestions from "src/components/Loading/LoadQuestions";
import { Link as RouterLink } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";

export default function TestPage() {
    const dispatch = useCustomDispatch();
    const statusAsync = useCustomSelector(mainGetStatusAsync);
    let { idBlock } = useParams<{ idBlock: string }>();
    const blocks = useCustomSelector(blockState);
    const currentBlock = blocks.find((block) => block.id === Number(idBlock));
    const questions = useCustomSelector(questionsGetQuestionByBlock, currentBlock?.id);
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

    if (statusAsync.loadBlocks === loadStatus.notLoaded) {
        return <LoadBlocks />;
    }

    if (statusAsync.loadRoles === loadStatus.notLoaded) {
        return <LoadRoles />;
    }

    if (statusAsync.loadQuestions === loadStatus.notLoaded && questions.size === 0) {
        return <LoadQuestions />;
    } else if (statusAsync.loadQuestions === loadStatus.load) {
        return <Alert type="preload" text="Загрузка вопросов" />;
    } else if (statusAsync.loadQuestions === loadStatus.errorServer) {
        return <Alert type="warning" text="Ошибка загрузки вопросов" />;
    } else if (questions.size > 0 && currentBlock) {
        return (
            <div>
                <Typography gutterBottom variant={"h5"} component={"h1"}>
                    Тест Белбина на вашу роль в команде – пройти тест онлайн
                </Typography>

                <Typography gutterBottom variant={"h6"} component={"h2"}>
                    Часть {currentBlock.id} из {blocks.size}
                </Typography>

                <Typography gutterBottom variant={"h6"} component={"h2"}>
                    {currentBlock.title}
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

                <WrapperControlPanel>
                    {sumValueQuestions < 10 && (
                        <Warning>
                            <Typography>
                                Нужно распределить {possibleMaximumValueQuestion} из 10 баллов для продолжение теста
                            </Typography>
                        </Warning>
                    )}

                    {currentBlock.id < blocks.size && (
                        <Button
                            variant="contained"
                            color="primary"
                            to={"/block/" + (Number(idBlock) + 1)}
                            component={RouterLink}
                            disabled={sumValueQuestions < 10}
                        >
                            Далее
                        </Button>
                    )}
                </WrapperControlPanel>
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

const WrapperControlPanel = styled.div`
    display: flex;
    justify-content: flex-end;
    margin: 1em 0;
`;

const Warning = styled.div`
    display: flex;
    align-items: flex-end;
    padding-right: 1em;
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
