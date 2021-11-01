import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { convertDate } from "../utils/convertDate";

interface RiepilogoTrenoParams {
  trainNumber: string;
}

const RiepilogoTreno: React.FC = (props) => {
  const params = useParams<RiepilogoTrenoParams>();
  const [data, setData] = useState<any>({});
  const [dataReady, setReady] = useState(false);
  useEffect(() => {
    fetch(
      (process.env.REACT_APP_API_URI +
        "/trainNumber/" +
        params.trainNumber) as string
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
      <h1>riepilogo treno {data.classification + " " + data.name}</h1>
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
        Treno {name} del {convertDate(journey.date)}
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
