import React, { useState } from "react";
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
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { QuestionCircle as InfoIcon } from "@styled-icons/bootstrap/QuestionCircle";
import IconButton from "@material-ui/core/IconButton";

export default function TestPage() {
    const dispatch = useCustomDispatch();
    const statusAsync = useCustomSelector(mainGetStatusAsync);
    let { idBlock } = useParams<{ idBlock: string }>();
    const blocks = useCustomSelector(blockState);
    const currentBlock = blocks.find((block) => block.id === Number(idBlock));
    const questions = useCustomSelector(questionsGetQuestionByBlock, currentBlock?.id);
    const [openInfo, setOpenInfo] = useState(false);

    const sumValueQuestions = questions.reduce<number>((sum, question) => sum + question.value, 0);
    const possibleMaximumValueQuestion = 10 - sumValueQuestions;

    const useStyles = makeStyles({
        instructionsText: {
            fontSize: "1em",
            lineHeight: 1.1,
        },
    });

    const classes = useStyles();

    const handleChangeQuestion = (event: any, newValue: number | number[], id: IQuestion["id"]) => {
        if (questions.find((q) => q.id === id)?.value !== Number(newValue)) {
            dispatch(setValue(id, Number(newValue)));
        }
    };

    if (statusAsync.loadBlocks === loadStatus.notLoaded) {
        return <LoadBlocks />;
    }

    if (statusAsync.loadRoles === loadStatus.notLoaded) {
        return <LoadRoles />;
    }

    /*Беги, просто беги!*/

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

                <Typography gutterBottom className={classes.instructionsText}>
                    <Bold>Инструкция.</Bold> В каждом из семи блоков данного теста распределите 10 баллов между
                    возможными ответами согласно тому, как вы полагаете они лучше всего подходят вашему собственному
                    поведению. Если вы согласны с каким-либо утверждением на все 100%, вы можете отдать ему все 10
                    баллов.
                </Typography>

                <Typography gutterBottom variant={"h6"} component={"h2"}>
                    Часть {currentBlock.id} из {blocks.size}
                </Typography>

                <FixNameBlock>
                    <Typography variant={"h6"} component={"h2"}>
                        {currentBlock.title}
                    </Typography>
                </FixNameBlock>

                {questions.valueSeq().map((question) => (
                    <WrapperQuestion key={question.id}>
                        <WrapperLabel>
                            <Typography id={"slider-question-" + question.id} gutterBottom>
                                {question.text}
                            </Typography>
                        </WrapperLabel>

                        <WrapperWrapperSlider>
                            <WrapperSlider paddingRight={(question.value + possibleMaximumValueQuestion) * 10}>
                                <Slider
                                    onChange={(event: any, newValue: number | number[]) =>
                                        handleChangeQuestion(event, newValue, question.id)
                                    }
                                    value={question.value}
                                    defaultValue={0}
                                    aria-labelledby={"slider-question-" + question.id}
                                    step={1}
                                    min={0}
                                    max={
                                        question.value + possibleMaximumValueQuestion === 0
                                            ? 1
                                            : question.value + possibleMaximumValueQuestion
                                    }
                                    valueLabelDisplay="on"
                                    marks={marks}
                                    disabled={question.value + possibleMaximumValueQuestion === 0}
                                />
                            </WrapperSlider>
                        </WrapperWrapperSlider>
                    </WrapperQuestion>
                ))}
                <WrapperControlPanel>
                    <WrapperTooltipInfo>
                        <TooltipInfo open={openInfo}>
                            <Typography>
                                Нужно распределить <b>{possibleMaximumValueQuestion}</b> из 10 баллов для продолжение
                                теста
                            </Typography>
                            <ButtonInfo onClick={() => setOpenInfo(false)}>Понятно</ButtonInfo>
                        </TooltipInfo>
                        <IconButton aria-label="info" onClick={() => setOpenInfo(true)}>
                            <InfoIconStyled size="20" />
                        </IconButton>
                    </WrapperTooltipInfo>

                    {currentBlock.id < blocks.size && (
                        <Button
                            variant="contained"
                            color="primary"
                            to={"/block/" + (currentBlock.id + 1)}
                            component={RouterLink}
                            disabled={sumValueQuestions < 10}
                        >
                            Далее
                        </Button>
                    )}

                    {currentBlock.id === blocks.size && (
                        <Button
                            variant="contained"
                            color="primary"
                            to="/test_result"
                            component={RouterLink}
                            disabled={sumValueQuestions < 10}
                        >
                            Результат
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

const WrapperWrapperSlider = styled.div`
    padding: 0 2em;
`;

const WrapperSlider = styled.div`
    display: flex;
    width: ${(props: { paddingRight: number }) => (props.paddingRight > 0 ? props.paddingRight : 10)}%;
    user-select: none;
`;

const WrapperLabel = styled.div`
    padding-bottom: 1.75em;
    user-select: none;
`;

const Bold = styled.strong`
    font-weight: bold;
`;

const FixNameBlock = styled.div`
    position: sticky;
    padding: 1em 0;
    top: 0;
    min-height: 2em;
    z-index: 10000;
    background-color: #fff;
    border-bottom: 1px solid #e5e5e5;
`;

const WrapperControlPanel = styled.div`
    display: flex;
    position: fixed;
    bottom: 0;
    justify-content: center;
    padding: 1em 0;
    min-height: 2em;
    width: 100%;
    z-index: 10000;
    max-width: 935px;
    background-color: #fff;
    border-top: 1px solid #e5e5e5;

    @media (max-width: 768px) {
        padding-bottom: 3em;
    }
`;

const InfoIconStyled = styled(InfoIcon)`
    color: #3f51b5;
`;

const WrapperTooltipInfo = styled.div`
    position: relative;
    display: inline-block;
`;

const TooltipInfo = styled.div`
    visibility: ${(props: { open: boolean }) => (props.open ? "visible" : "hidden")};
    width: 240px;
    background-color: #1c1c1c;
    color: #ccc;
    text-align: center;
    padding: 5px;
    border-radius: 3px;

    bottom: 100%;
    left: 50%;
    margin-left: -120px;
    position: absolute;
    z-index: 1;
`;

const ButtonInfo = styled.div`
    cursor: pointer;
    background-color: #fff;
    color: #242424;
    padding: 0.5em;
    margin: 0.5em;
    border: 1px solid #ccc;
    border-radius: 1px;
`;

const marks = [
    { value: 0, label: "0" },
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
    { value: 7, label: "7" },
    { value: 8, label: "8" },
    { value: 9, label: "9" },
    { value: 10, label: "10" },
];
