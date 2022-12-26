import React from "react";
import { Popup } from "react-leaflet";
import {
  DatiAggregPerTrattaType,
  ViaggiaTrenoDettaglioTrattaType,
  ViaggiaTrenoTrattaType,
} from "./TrainMap";

interface TooltipTrattaProps {
  line: ViaggiaTrenoTrattaType;
  aggreg: DatiAggregPerTrattaType;
  trattaAB: ViaggiaTrenoDettaglioTrattaType;
  trattaBA: ViaggiaTrenoDettaglioTrattaType;
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
      {trattaAB.treni.map((treno) => (
        <div key={treno.numeroTreno}>
          {treno.origine +
            " - " +
            treno.destinazione +
            " rit:" +
            treno.ritardo +
            " min"}
        </div>
      ))}
      <h1>{trattaBA.tratta}</h1>
      {trattaBA.treni.map((treno) => (
        <div key={treno.numeroTreno}>
          {treno.origine +
            " - " +
            treno.destinazione +
            " rit:" +
            treno.ritardo +
            " min"}
        </div>
      ))}
      <div style={{ marginTop: 10, fontWeight: 600 }}>
        Tratta Riassunto Generale
      </div>
      <div>ritardo totale circolante sulla tratta: {aggreg.totalDelay} min</div>
      <div>
        ritardo medio treni sulla tratta: {aggreg.averageDelay.toFixed(2)} min
      </div>
      <div>tot treni circolanti sulla tratta: {aggreg.numberOfTrains}</div>
    </Popup>
  );
};

export default TooltipTratta;
