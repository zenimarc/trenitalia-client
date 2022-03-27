import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";
import { getDate } from "../utils/getDate";
import { getTime } from "../utils/getTime";

interface RiepilogoTrenoParams {
  trainNumber: string;
}

const RiepilogoTreno: React.FC = (props) => {
  const params = useParams<RiepilogoTrenoParams>();
  const search = useLocation().search;
  const trainNum = new URLSearchParams(search).get("trainNum");
  const startLocationId = new URLSearchParams(search).get("startLocationId");
  const [data, setData] = useState<any>({});
  const [dataReady, setReady] = useState(false);
  useEffect(() => {
    fetch(
      (process.env.REACT_APP_API_URI +
        "/train?trainNumber=" +
        trainNum +
        "&startLocationId=" +
        startLocationId) as string
    )
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setData(data);
        setReady(true);
      });
  }, []);

  return (
    <div>
      {!dataReady && <div>Caricamento...</div>}
      {dataReady && (
        <>
          <h1>riepilogo treno {data.classification + " " + data.name} </h1>
          <h2>
            da {data.departureLocation.name} a {data.arrivalLocation.name}
          </h2>
        </>
      )}
      {dataReady &&
        data.journeys.map((journey: any, index: number) => (
          <>
            <CardTreno key={index} journey={journey} name={data.name} />
            <Divider style={{ padding: "0.5em" }}></Divider>
          </>
        ))}
    </div>
  );
};

export default RiepilogoTreno;

const CardTreno: React.FC<{ journey: any; name: string }> = ({
  journey,
  name,
}) => {
  return (
    <>
      <div>
        Treno {name} del {getDate(journey.date)} delle ore{" "}
        {getTime(journey.date)}
      </div>
      {journey.isCanceled ? (
        <div>treno cancellato</div>
      ) : (
        <RitardoText delay={journey.delay} />
      )}
    </>
  );
};

const RitardoText: React.FC<{ delay: number }> = ({ delay }) => {
  return (
    <div>
      Arrivato con{" "}
      <span style={delay > 0 ? DelayStyle.delayed : DelayStyle.anticipated}>
        {delay / 60000}
      </span>{" "}
      minuti di
      <span style={delay > 0 ? DelayStyle.delayed : DelayStyle.anticipated}>
        {delay >= 0 ? " ritardo" : " anticipo"}
      </span>
    </div>
  );
};

const DelayStyle = {
  delayed: {
    color: "red",
  },
  anticipated: {
    color: "green",
  },
};
