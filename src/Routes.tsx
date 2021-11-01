import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Page1 from "./pages/Page1";
import NotFound from "./pages/NotFound";

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Page1} />
        <Route path="/page-1" component={Page1} />
        <Route path="/page-2" component={Page1} />
        <Route path="/page-3" component={Page1} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
