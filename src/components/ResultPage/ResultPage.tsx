import React from "react";
import styled from "styled-components";
import useCustomSelector from "src/hooks/useCustomSelector";
import { mainGetStatusAsync, rolesGetRoleCalculatedValueSort } from "src/store/rootSelector";
import { loadStatus } from "src/store/loadStatus";
import LoadRoles from "src/components/Loading/LoadRoles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import Box from "@material-ui/core/Box";
import Role from "src/models/role";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import * as packageJson from "../../../package.json";

export default function ResultPage() {
    const statusAsync = useCustomSelector(mainGetStatusAsync);
    const roles = useCustomSelector(rolesGetRoleCalculatedValueSort);

    const useStyles = makeStyles({
        tableContainer: {
            maxWidth: 450,
            marginBottom: "1em",
        },
    });

    const classes = useStyles();

    if (statusAsync.loadRoles === loadStatus.notLoaded) {
        return <LoadRoles />;
    }

    const sumAllValue = roles.reduce((sum, role) => sum + role.value, 0);

    const interpretation: { max: Role; second?: Role; min: Role } = {
        max: roles.first(),
        second: roles.slice(1, 2).first(),
        min: roles.last(),
    };

    if (roles && roles.find((role) => role.value > 0)) {
        return (
            <Box>
                <Typography gutterBottom variant={"h4"} component={"h2"}>
                    Результат теста
                </Typography>

                <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table size="small">
                        <TableBody>
                            {roles.valueSeq().map((role) => (
                                <TableRow key={"role" + role.id}>
                                    <TableCell>{role.name}</TableCell>
                                    <TableCell align="right">{Math.round((role.value * 100) / sumAllValue)}%</TableCell>
                                    <TableCell align="right">{role.value} (б)</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box mb={"1em"}>
                    <Typography gutterBottom variant={"h4"} component={"h3"}>
                        Интерпретация результата
                    </Typography>

                    {interpretation.max && (
                        <Box mb={"1em"}>
                            <Typography gutterBottom variant={"h5"} component={"h3"}>
                                Лучшая роль - {interpretation.max.name} / {interpretation.max.value}%
                            </Typography>
                            <Typography gutterBottom>
                                Наивысший балл по командной роли показывает, что Вы можете можете лучше всего исполнять
                                роль <Bold>{interpretation.max.name}</Bold> в управленческой команде.
                            </Typography>
                            <Typography gutterBottom>Характеристика. {interpretation.max.characteristic}</Typography>
                            <Typography gutterBottom>Функциональность. {interpretation.min.functionality}</Typography>
                        </Box>
                    )}

                    {interpretation.second && (
                        <Box mb={"1em"}>
                            <Typography gutterBottom variant={"h5"} component={"h3"}>
                                Поддерживающая роль - {interpretation.second.name} / {interpretation.second.value}%
                            </Typography>
                            <Typography>
                                Поддерживающую роль, на которую Вы можете переключиться, если Ваша основная командная
                                роль по каким-либо причинам не нужна группе - <Bold>{interpretation.second.name}</Bold>
                            </Typography>
                            <Typography gutterBottom>Характеристика. {interpretation.max.characteristic}</Typography>
                            <Typography gutterBottom>Функциональность. {interpretation.min.functionality}</Typography>
                        </Box>
                    )}

                    {interpretation.min && (
                        <Box mb={"1em"}>
                            <Typography gutterBottom variant={"h5"} component={"h3"}>
                                Слабое место - {interpretation.min.name} / {interpretation.min.value}%
                            </Typography>
                            <Typography gutterBottom>
                                Ваше слабое место - <Bold>{interpretation.min.name}</Bold>
                            </Typography>
                            <Typography gutterBottom>Характеристика. {interpretation.max.characteristic}</Typography>
                            <Typography gutterBottom>Функциональность. {interpretation.min.functionality}</Typography>
                        </Box>
                    )}
                </Box>

                <WrapperControlPanel>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => (window.location.href = packageJson.homepage)}
                    >
                        Пройти тест заново
                    </Button>
                </WrapperControlPanel>
            </Box>
        );
    }

    return (
        <>
            <Redirect to="/" />
        </>
    );
}

const Bold = styled.strong`
    font-weight: bold;
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
