import React from "react";
import { Popup } from "react-leaflet";
import { DatiAggregPerTrattaType, ViaggiaTrenoTrattaType } from "./TrainMap";

interface TooltipTrattaProps {
  line: ViaggiaTrenoTrattaType;
  aggreg: DatiAggregPerTrattaType;
  numNameMap: Record<number, string>;
}

const TooltipTratta = ({ line, aggreg, numNameMap }: TooltipTrattaProps) => {
  return (
    <Popup>
      <h1>{numNameMap[line.trattaAB]}</h1>
      <h1>{numNameMap[line.trattaBA]}</h1>
      <div>ritardo totale circolante sulla tratta: {aggreg.totalDelay}min</div>
      <div>ritardo medio treni sulla tratta: {aggreg.averageDelay}min</div>
      <div>tot treni circolanti sulla tratta: {aggreg.numberOfTrains}</div>
    </Popup>
  );
};

export default TooltipTratta;
