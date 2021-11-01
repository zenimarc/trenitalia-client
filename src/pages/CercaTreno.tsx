import React, { useState } from "react";
import { Button, Container, TextField } from "@mui/material";
import { useHistory } from "react-router";

const CercaTreno: React.FC = () => {
  const [trainNumber, setTrainNumber] = useState("");
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
          onClick={() => {
            history.push("/RiepilogoTreno/" + trainNumber);
          }}
        >
          Cerca
        </Button>
      </div>
    </div>
  );
};

export default CercaTreno;
