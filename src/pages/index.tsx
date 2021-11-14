import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

// import shared layout component
import Layout from "../components/Layout";
import AddTrainByNumber from "./AddTrainByNumber";
import CercaTreno from "./CercaTreno";
import TrainsByStations from "./FindTrainNumbersByStations";

// import routes
import Page1 from "./Page1";
import RiepilogoTreno from "./RiepilogoTreno";
import SyncedTrains from "./SyncedTrains";

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
        <Route path="/findByStations" component={TrainsByStations} />
        <Route path="/addByNumber" component={AddTrainByNumber} />
        <Route path="/followed" component={SyncedTrains} />
        <Route path="/stats" component={Page1} />
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
