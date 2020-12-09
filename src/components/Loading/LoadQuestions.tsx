import React, { useEffect } from "react";
import useCustomDispatch from "src/hooks/useCustomDispatch";
import { loadQuestions } from "src/store/questions/actions";

export default function LoadQuestions() {
    const dispatch = useCustomDispatch();

    useEffect(() => {
        dispatch(loadQuestions());
    }, [dispatch]);

    return <></>;
}
