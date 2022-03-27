import React, { useState } from "react";
import { Button, Container, TextField } from "@mui/material";
import { useHistory } from "react-router";
import CardTrainNumber from "../components/CardTrainNumber";

const CercaTreno: React.FC = () => {
  const [trainNumber, setTrainNumber] = useState("");
  const [startLocationId, setStartLocationId] = useState(null);
  const [data, setData] = useState([]);
  const history = useHistory();
  return (
    <div>
      <h1>Cerca treno con numero</h1>
      <div style={{ display: "flex", maxWidth: "30em" }}>
        <TextField
          id="trainNumber"
          label="numero treno"
          variant="outlined"
          onChange={(e) => setTrainNumber(e.target.value)}
        />
        <Button
          variant="contained"
          style={{ marginLeft: "1em" }}
          onClick={async () => {
            const reqdata = await fetch(
              process.env.REACT_APP_API_URI + "/synced-train/" + trainNumber
            );
            const syncTrains = await reqdata.json();
            if (syncTrains.length === 1) {
              const { name, departureLocationId } = syncTrains[0];
              history.push({
                pathname: "RiepilogoTreno/train",
                search: `?trainNum=${name}&startLocationId=${departureLocationId}`,
              });
            } else {
              setData(syncTrains);
            }
          }}
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
                  search: `?trainNum=${trainData.name}&startLocationId=${trainData.departureLocation.id}`,
                });
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default CercaTreno;
