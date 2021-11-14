import React, { useState } from "react";
import { Button, Container, TextField } from "@mui/material";
import { useHistory } from "react-router";

const AddTrainByNumber: React.FC = () => {
  const [trainName, setTrainName] = useState("");
  const [classification, setClassification] = useState("");
  const [startLocationID, setStartLocationID] = useState("");
  const [pageMsg, setPageMsg] = useState("");
  const history = useHistory();
  return (
    <div>
      <h1>aggiungi treno ai seguiti con numero</h1>
      <div style={{ display: "flex", maxWidth: "30em" }}>
        <TextField
          id="trainNumber"
          label="numero treno"
          variant="outlined"
          onChange={(e) => {
            setTrainName(e.target.value);
          }}
        />
        <Button
          variant="contained"
          style={{ marginLeft: "1em" }}
          onClick={() => {
            fetch(
              (process.env.REACT_APP_API_URI +
                "/add-user-tracking-onlynum") as string,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  trainName,
                  classification,
                  startLocationID,
                }),
              }
            )
              .then((data) => data.json())
              .then((data) => {
                console.log(data);
                setPageMsg(data.messages);
              });
          }}
        >
          Aggiungi
        </Button>
      </div>
      <div>{pageMsg}</div>
    </div>
  );
};

export default AddTrainByNumber;
