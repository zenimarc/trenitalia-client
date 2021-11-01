import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

// import shared layout component
import Layout from "../components/Layout";
import CercaTreno from "./CercaTreno";

// import routes
import Page1 from "./Page1";
import RiepilogoTreno from "./RiepilogoTreno";

const Pages = () => {
  return (
    <Router>
      <Layout>
        <Route exact path="/" component={Page1} />
        <Route exact path="/CercaTreno" component={CercaTreno} />
        <Route
          exact
          path="/RiepilogoTreno/:trainNumber"
          component={RiepilogoTreno}
        />
        <Route path="/mynotes" component={Page1} />
        <Route path="/favorites" component={Page1} />
        <Route path="/new" component={Page1} />
        <Route path="/edit/:id" component={Page1} />
        <Route path="/note/:id" component={Page1} />
        <Route path="/signup" component={Page1} />
        <Route path="/signin" component={Page1} />
      </Layout>
    </Router>
  );
};

export default Pages;
