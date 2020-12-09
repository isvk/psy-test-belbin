import React from "react";
import styled from "styled-components";
import { Switch, Route, Redirect } from "react-router-dom";
import TestPage from "src/components/TestPage/TestPage";

function App() {
    return (
        <Wrapper>
            <Switch>
                <Route exact path="/">
                    <Redirect to="/block/1" />
                </Route>
                <Route exact path="/block/:idBlock" component={TestPage} />
            </Switch>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    max-width: 935px;
    margin: 0 auto;
    padding: 0 1em;
`;

export default App;
