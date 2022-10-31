import React from "react";
import { Container } from "react-bootstrap";
import "./App.scss";
import Register from "./pages/Register";
import Provider from "./Provider";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  return (
    <Provider>
      <BrowserRouter>
        <Container className="pt-5">
          <Switch>
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route exact path="/" component={Home} />
          </Switch>
        </Container>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
