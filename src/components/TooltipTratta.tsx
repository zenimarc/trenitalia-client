import React from "react";
import { Popup } from "react-leaflet";
import {
  DatiAggregPerTrattaType,
  DatiAggregPerTrattaTypePlusTrattaName,
  ViaggiaTrenoDettaglioTrattaType,
  ViaggiaTrenoTrattaType,
} from "./TrainMap";

interface TooltipTrattaProps {
  line: ViaggiaTrenoTrattaType;
  aggreg: DatiAggregPerTrattaType;
  trattaAB: DatiAggregPerTrattaTypePlusTrattaName;
  trattaBA: DatiAggregPerTrattaTypePlusTrattaName;
}

const TooltipTratta = ({
  line,
  aggreg,
  trattaAB,
  trattaBA,
}: TooltipTrattaProps) => {
  return (
    <Popup>
      <h1>{trattaAB.tratta}</h1>
      {trattaAB.trains.map((treno) => (
        <div key={treno.numeroTreno}>
          {treno.categoria +
            " " +
            treno.origine +
            " - " +
            treno.destinazione +
            " rit:" +
            treno.ritardo +
            " min"}
        </div>
      ))}
      <h1>{trattaBA.tratta}</h1>
      {trattaBA.trains.map((treno) => (
        <div key={treno.numeroTreno}>
          {treno.categoria +
            " " +
            treno.numeroTreno +
            " " +
            treno.origine +
            " - " +
            treno.destinazione +
            " rit:" +
            treno.ritardo +
            " min"}
        </div>
      ))}
      <RiassuntoTratta
        averageDelay={aggreg.averageDelay}
        numberOfTrains={aggreg.numberOfTrains}
        totalDelay={aggreg.totalDelay}
      />
    </Popup>
  );
};

interface RiassuntoTrattaProps {
  totalDelay: number | undefined;
  averageDelay: number | undefined;
  numberOfTrains: number | undefined;
}
export const RiassuntoTratta = ({
  totalDelay,
  averageDelay,
  numberOfTrains,
}: RiassuntoTrattaProps) => {
  return (
    <>
      <div style={{ marginTop: 10, fontWeight: 600 }}>
        Tratta Riassunto Generale
      </div>
      <div>ritardo totale circolante sulla tratta: {totalDelay} min</div>
      <div>
        ritardo medio treni sulla tratta:{" "}
        {averageDelay && averageDelay.toFixed(2)} min
      </div>
      <div>tot treni circolanti sulla tratta: {numberOfTrains}</div>
    </>
  );
};

export default TooltipTratta;
