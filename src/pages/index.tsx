import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

// import shared layout component
import Layout from "../components/Layout";
import AddTrainByNumber from "./AddTrainByNumber";
import CercaTreno from "./CercaTreno";
import TrainsByStations from "./FindTrainNumbersByStations";

// import routes
import HomePage from "./HomePage";
import Infomobilita from "./Infomobilita";
import RiepilogoTreno from "./RiepilogoTreno";
import SyncedTrains from "./SyncedTrains";

const Pages = () => {
  return (
    <Router>
      <Layout>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/CercaTreno" component={CercaTreno} />
        <Route path="/RiepilogoTreno/train" component={RiepilogoTreno} />
        <Route path="/mynotes" component={HomePage} />
        <Route path="/findByStations" component={TrainsByStations} />
        <Route path="/addByNumber" component={AddTrainByNumber} />
        <Route path="/followed" component={SyncedTrains} />
        <Route path="/infomobilita" component={Infomobilita} />
        <Route path="/stats" component={HomePage} />
        <Route path="/new" component={HomePage} />
        <Route path="/edit/:id" component={HomePage} />
        <Route path="/note/:id" component={HomePage} />
        <Route path="/signup" component={HomePage} />
        <Route path="/signin" component={HomePage} />
      </Layout>
    </Router>
  );
};

export default Pages;
