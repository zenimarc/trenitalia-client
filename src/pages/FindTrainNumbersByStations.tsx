import React, { useState } from "react";
import { Button, Container, TextField } from "@mui/material";
import { useHistory } from "react-router";
import AsyncSelect from "react-select/async";
import { convertAutocompleteStationToSelectData } from "../utils/utils";
import { ResponseAutocompletionStation } from "../../../trenitalia-bot/src/types";

const filterData = (
  data: { value: string; label: string }[],
  inputValue: string
) => {
  return data.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

const promiseOptions = (inputValue: string) =>
  new Promise<{ value: string; label: string }[]>(async (resolve) => {
    if (inputValue.length < 3) return [];
    const data = await fetch(
      (process.env.REACT_APP_API_URI +
        "/autocomplete-station/" +
        inputValue) as string
    ).then((data) => data.json());
    resolve(
      filterData(convertAutocompleteStationToSelectData(data), inputValue)
    );
  });

const TrainsByStations: React.FC = () => {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [startStation, setStartStation] = useState("");
  const [endStation, setEndStation] = useState("");
  const [res, setRes] = useState<
    { trainName: string; classification: string; startLocationID: number }[]
  >([]);
  const [isLoadingRes, setIsLoadingRes] = useState(false);
  const [pageMsg, setPageMsg] = useState("");
  const history = useHistory();

  const getTrainsNumbers = async () => {
    setIsLoadingRes(true);
    const data = await fetch(
      (process.env.REACT_APP_API_URI +
        "/getTrainsFromStartAndEndLocations?startLocationID=" +
        startLocation +
        "&endLocationID=" +
        endLocation) as string
    ).then((data) => data.json());
    setRes(data.data);
    setIsLoadingRes(false);
    setPageMsg(data.messages);
  };

  return (
    <div>
      <h1>Cerca treno per stazioni</h1>
      <div
        style={{ display: "flex", maxWidth: "30em", flexDirection: "column" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={{ padding: 3 }}>DA</p>
          <div style={{ width: "100%" }}>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={promiseOptions}
              onChange={(newValue) => {
                const data = newValue as { label: string; value: string };
                setStartLocation(data.value);
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={{ padding: 3 }}>A</p>
          <div style={{ width: "100%" }}>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={promiseOptions}
              onChange={(newValue) => {
                const data = newValue as { label: string; value: string };
                setEndLocation(data.value);
              }}
            />
          </div>
        </div>

        <Button
          variant="contained"
          style={{ marginLeft: "1em" }}
          disabled={isLoadingRes ? true : false}
          onClick={() => {
            getTrainsNumbers();
            //history.push("/RiepilogoTreno/");
            console.log(res);
            console.log(startLocation);
            console.log(endLocation);
          }}
        >
          {isLoadingRes ? "Caricamento" : "Cerca"}
        </Button>
        <div>
          {pageMsg ? <p>{pageMsg}</p> : <></>}
          <p>Results:</p>
          <Button
            variant="contained"
            style={{ marginLeft: "1em" }}
            disabled={isLoadingRes ? true : false}
            onClick={async () => {
              for (const treno of res) {
                addTrain(
                  treno.trainName,
                  treno.classification,
                  treno.startLocationID
                );
              }
            }}
          >
            Aggiungi tutti
          </Button>
          {res.map((elem: any, index) => (
            <div key={index}>
              {elem.classification} {elem.trainName}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainsByStations;

const addTrain = (
  trainName: string,
  classification: string,
  startLocationID: number
) => {
  fetch((process.env.REACT_APP_API_URI + "/add-user-tracking") as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      trainName,
      classification,
      startLocationID,
    }),
  })
    .then((data) => data.json())
    .then((data) => {
      console.log(data);
      return data;
    });
};
