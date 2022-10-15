import React, { useState } from "react";
import { Button, Container, TextField } from "@mui/material";
import { useHistory } from "react-router";
import CardTrainNumber from "../components/CardTrainNumber";

const CercaTreno: React.FC = () => {
  const [trainNumber, setTrainNumber] = useState("");
  const [startLocationId, setStartLocationId] = useState(null);
  const [data, setData] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const history = useHistory();

  const onClickFn = async () => {
    const reqdata = await fetch(
      process.env.REACT_APP_API_URI + "/synced-train/" + trainNumber
    );
    const syncTrains = await reqdata.json();
    setNotFound(false);
    if (syncTrains.length === 0) {
      setNotFound(true);
    }
    if (syncTrains.length === 1) {
      const { name, departureLocationId, id } = syncTrains[0];
      history.push({
        pathname: "RiepilogoTreno/train",
        search: `?trainNum=${name}&startLocationId=${departureLocationId}&trainId=${id}`,
      });
    } else {
      setData(syncTrains);
    }
  };

  return (
    <div>
      <h1>Cerca treno con numero</h1>
      <div style={{ display: "flex", maxWidth: "30em" }}>
        <TextField
          id="trainNumber"
          label="numero treno"
          variant="outlined"
          onChange={(e) => setTrainNumber(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") onClickFn();
          }}
        />
        <Button
          variant="contained"
          style={{ marginLeft: "1em" }}
          onClick={() => onClickFn()}
        >
          Cerca
        </Button>
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", marginTop: "1em" }}
      >
        {data.length > 1 &&
          data.map((trainData: any) => (
            <CardTrainNumber
              trainNumber={trainData.name}
              date=""
              denomination={trainData.classification}
              startLocation={trainData.departureLocation.name}
              startLocationId={trainData.departureLocation.id}
              endLocation={trainData.arrivalLocation.name}
              onClickFn={() => {
                history.push({
                  pathname: "RiepilogoTreno/train",
                  search: `?trainNum=${trainData.name}&startLocationId=${trainData.departureLocation.id}&trainId=${trainData.id}`,
                });
              }}
            />
          ))}
        {notFound && <div>Treno non in database</div>}
      </div>
    </div>
  );
};

export default CercaTreno;
