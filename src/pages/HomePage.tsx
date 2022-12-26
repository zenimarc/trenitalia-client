import React, { useEffect } from "react";
import MeteoIcon from "../components/MeteoIcon";
import TrainMap from "../components/TrainMap";

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = "TrenitaliaBOT";
  }, []); // Empty dependency array ensures that the effect is only run on mount
  return (
    <div>
      <h1>MAPPA SITUAZIONE ATTUALE</h1>
      <TrainMap />
    </div>
  );
};

export default HomePage;
