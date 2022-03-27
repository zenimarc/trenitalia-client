import React, { useState } from "react";
import { Button, Container, TextField } from "@mui/material";
import { useHistory } from "react-router";
import CardTrainNumber from "../components/CardTrainNumber";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const AddTrainByNumber: React.FC = () => {
  const [trainName, setTrainName] = useState("");
  const [classification, setClassification] = useState("");
  const [startLocationID, setStartLocationID] = useState("");
  const [pageMsg, setPageMsg] = useState("");
  const [trainChoices, setTrainChoices] = useState([]);
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
                console.log(JSON.stringify(data));
                setPageMsg(data.messages);
                setTrainChoices(data.data);
              });
          }}
        >
          Aggiungi
        </Button>
      </div>
      <div className="more-details-box">
        <div>{pageMsg}</div>
        {trainChoices.length > 1 && (
          <div>
            {trainChoices.map((trainData: any) => {
              return (
                <div>
                  <CardTrainNumber
                    onClickFn={async () => {
                      const data = await fetch(
                        process.env.REACT_APP_API_URI + "/add-user-tracking",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            trainName: trainData.transportMeanName,
                            classification: trainData.transportDenomination,
                            startLocationID: trainData.startLocation.locationId,
                          }),
                        }
                      );
                      const obj = await data.json();
                      setPageMsg(obj.messages);
                      setTrainChoices([]);
                    }}
                    trainNumber={trainData.transportMeanName}
                    date={trainData.startTime}
                    denomination={trainData.transportDenomination}
                    startLocation={trainData.startLocation.name}
                    startLocationId={trainData.startLocation.locationId}
                    endLocation={trainData.endLocation.name}
                  />
                  <br />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTrainByNumber;
