import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Space, Switch } from "antd";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { ViaggiaTrenoAPI } from "../utils/viaggiatrenoApi";
import MeteoIcon, { getMeteoIconUrl } from "./MeteoIcon";
import pLimit from "p-limit";
import { getColorFromValue } from "../utils/colorPalettes";
import ColorPaletteLegend from "./ColorPaletteLegend";
import TooltipTratta from "./TooltipTratta";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const TrainMap = () => {
  const [stationsList, setStaionsList] = useState<ViaggiaTrenoStationsType[]>(
    []
  );
  const [tratte, setTratte] = useState<ViaggiaTrenoTrattaType[]>([]);
  const [datiMeteo, setDatiMeteo] = useState<
    Record<string, ViaggiaTrenoMeteoType>
  >({});
  const [showMeteo, setShowMeteo] = useState(false);
  const [showCityLabels, setShowCityLabels] = useState(true);
  const [tratteNumNameMap, setTratteNumNameMap] = useState<
    Record<number, string>
  >({});
  const [datiAggregTratte, setDatiAggregTratte] = useState<DatiAggregType>();
  const [isLoading, setIsLoading] = useState(true);

  console.log(stationsList);
  console.log(tratte);
  const position: [number, number] = [41.9, 12.5]; // center the map on Italy
  const pointsRet = stationsList.filter(
    (p) => p.dettZoomStaz[0].pinpointVisible
  );
  const points = removeDuplicates(pointsRet, "codStazione");

  // BOUNDS FOR ITALY
  const minLat = 35.0; // Minimum latitude
  const maxLat = 48.0; // Maximum latitude
  const minLon = 5.0; // Minimum longitude
  const maxLon = 20.0; // Maximum longitude
  const bounds: [[number, number], [number, number]] = [
    [minLat, minLon],
    [maxLat, maxLon],
  ];

  //PALETTE FOR DELAYS
  const minValuePalette = 0;
  const maxValuePalette = 60;
  const palette = ["#00ff00", "#ffbb00", "#ff0000"]; // green, yellow, red

  const dotIcon = new L.DivIcon({
    className: "dot-icon",
    html: `<div style="background-color: black; width: 10px; height: 10px; border-radius: 5px;"></div>`,
  });
  const getDotLabel = (text: string) => {
    return new L.DivIcon({
      className: "dot-label",
      html: `<div>${text}</div>`,
      iconAnchor: [5, 25],
    });
  };
  const getCustomDotIcon = (stationId: string) => {
    const iconWidth = 30;
    const iconHeight = 30;
    if (showMeteo && Boolean(datiMeteo[stationId])) {
      return new L.DivIcon({
        className: "dot-icon",
        html: `<img src="${getMeteoIconUrl(datiMeteo[stationId].oggiTempo)}">`,
        iconAnchor: [iconWidth / 2, iconHeight / 2],
      });
    } else {
      return dotIcon;
    }
  };

  useEffect(() => {
    async function fetchData() {
      const viaggiaTrenoAPI = ViaggiaTrenoAPI();
      viaggiaTrenoAPI.getStations().then(setStaionsList);
      viaggiaTrenoAPI.getMeteo().then(setDatiMeteo);
      const tratte: ViaggiaTrenoTrattaType[] =
        await viaggiaTrenoAPI.getTratte();
      setTratte(tratte);
      const filteredTratte = getCopyNoDuplicates(tratte);
      const listaTupleTratte = filteredTratte.map((tratta) => [
        tratta.trattaAB,
        tratta.trattaBA,
      ]);
      console.log("sDDDD", tratte.length, filteredTratte.length);
      const tasks = listaTupleTratte.map((tuplaTratte) => {
        return async () => {
          return await viaggiaTrenoAPI.getDettaglioTratta(
            tuplaTratte[0],
            tuplaTratte[1]
          );
        };
      });
      //.slice(0, 10);
      console.log(tasks);
      const limit = pLimit(5);
      const results: ViaggiaTrenoDettaglioTrattaRespType[] = await Promise.all(
        tasks.map((task) => limit(() => task()))
      );
      console.log("risolti: ", results);
      //console.log("tupletratte: ", listaTupleTratte);
      const trattaNumNameDict: Record<number, string> = {};
      const resultsTrainPartMerged = results.reduce((accum, current, idx) => {
        //updating the numTratta - NameTratta disctionary map
        const nameTratta1 = current[0].tratta;
        const numTratta1 = listaTupleTratte[idx][0];
        const nameTratta2 = current[1].tratta;
        const numTratta2 = listaTupleTratte[idx][1];
        trattaNumNameDict[numTratta1] = nameTratta1;
        trattaNumNameDict[numTratta2] = nameTratta2;
        //console.log(numTratta1, " corrisponde a ", nameTratta1);
        return [...accum, ...current[0].treni, ...current[1].treni];
      }, [] as ViaggiaTrenoDettaglioTrattaTypeInner[]);
      console.log("mappaTrattaID", trattaNumNameDict);
      const tratteDataDict: DatiDictAggregPerTrattaType = {};
      let maxNumberCirculatingPerTratta = 1;
      for (const trenoInTratta of resultsTrainPartMerged) {
        // i'm computing the properties of each tratta incrementally while i see trains appartaining to that tratta
        if (trenoInTratta.tratta in tratteDataDict) {
          // append trenoInTratta to the array associated with the key in tratteDataDict
          const { numberOfTrains, totalDelay } =
            tratteDataDict[trenoInTratta.tratta];
          const { ritardo: newDelay } = trenoInTratta;
          tratteDataDict[trenoInTratta.tratta].averageDelay =
            calcAverageIncrementally(newDelay, totalDelay, numberOfTrains);
          tratteDataDict[trenoInTratta.tratta].numberOfTrains =
            numberOfTrains + 1;
          tratteDataDict[trenoInTratta.tratta].totalDelay =
            totalDelay + newDelay;

          // update maxProperties numberoftrains
          if (
            tratteDataDict[trenoInTratta.tratta].numberOfTrains >
            maxNumberCirculatingPerTratta
          ) {
            maxNumberCirculatingPerTratta =
              tratteDataDict[trenoInTratta.tratta].numberOfTrains;
          }

          tratteDataDict[trenoInTratta.tratta].trains.push(trenoInTratta);
        } else {
          // create a new key in tratteDataDict and initialize its associated array with trenoInTratta
          tratteDataDict[trenoInTratta.tratta] = {
            trains: [trenoInTratta],
            numberOfTrains: 1,
            totalDelay: trenoInTratta.ritardo,
            averageDelay: trenoInTratta.ritardo,
          };
        }
      }
      console.log("risultato finito div per tratta", tratteDataDict);
      setDatiAggregTratte({
        maxCirculatingPerTratta: maxNumberCirculatingPerTratta,
        tratte: tratteDataDict,
      });
      setTratteNumNameMap(trattaNumNameDict);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Row>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: 10 }}>Attiva meteo</div>
          <Switch defaultChecked={false} onChange={setShowMeteo} />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: 10 }}>Mostra etichette città</div>
          <Switch defaultChecked={true} onChange={setShowCityLabels} />
        </div>
      </Row>
      <MapContainer
        style={{ height: 800 }}
        center={position}
        zoom={6}
        minZoom={6}
        maxBounds={bounds}
      >
        <ColorPaletteLegend
          minValue={minValuePalette}
          maxValue={maxValuePalette}
          palette={palette}
          style={{
            position: "absolute",
            top: 10,
            right: 20,
            width: 30,
            zIndex: 1000,
          }}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
        />
        {points.map((point) => (
          <React.Fragment key={point.codStazione}>
            <Marker
              position={[point.lat, point.lon]}
              icon={getCustomDotIcon(point.codStazione)}
            >
              {/* <Tooltip
              direction="right"
              offset={[0, 0]}
              opacity={1}
              permanent={point.dettZoomStaz[0].labelVisible}
            >
              {point.nomeCitta}
            </Tooltip> */}
              <Popup>{point.nomeCitta}</Popup>
            </Marker>
            {point.dettZoomStaz[0].labelVisible && showCityLabels && (
              <Marker
                position={[point.lat, point.lon]}
                icon={getDotLabel(point.nomeCitta)}
              />
            )}
          </React.Fragment>
        ))}
        {tratte.map((line) => {
          const aggregDataCouple =
            datiAggregTratte &&
            aggregateTwoTratte(line.trattaAB, line.trattaBA, datiAggregTratte);
          const avgDelayTratta = aggregDataCouple?.averageDelay;
          //console.log(aggregDataCouple);
          return (
            <Polyline
              key={String(line.nodoA) + String(line.nodoB)}
              positions={[
                [line.latitudineA, line.longitudineA],
                [line.latitudineB, line.longitudineB],
              ]}
              color={
                line.occupata
                  ? getColorFromValue(
                      aggregDataCouple?.averageDelay || 0,
                      minValuePalette,
                      maxValuePalette,
                      palette
                    )
                  : "#9e9e9e"
              }
              weight={
                aggregDataCouple
                  ? calcWeight(
                      datiAggregTratte.maxCirculatingPerTratta,
                      aggregDataCouple.numberOfTrains
                    )
                  : 1
              }
              children={
                aggregDataCouple && (
                  <TooltipTratta
                    line={line}
                    aggreg={aggregDataCouple}
                    numNameMap={tratteNumNameMap}
                  />
                )
              }
              eventHandlers={{
                click: (e) => {
                  console.log("clicked line", line.trattaAB, line.trattaBA);
                },
              }}
            />
          );
        })}
      </MapContainer>
    </>
  );
};

export default TrainMap;

//function to remove duplicates trattaAB TrattaBA
const getCopyNoDuplicates = (originalList: ViaggiaTrenoTrattaType[]) => {
  const filteredList = [];
  const seenTrattas = new Set();

  for (const item of originalList) {
    const trattaPair = JSON.stringify([item.trattaAB, item.trattaBA]);
    if (!seenTrattas.has(trattaPair)) {
      filteredList.push(item);
      seenTrattas.add(trattaPair);
    }
  }
  return filteredList;
};

function removeDuplicates(array: any, field: string) {
  // Create an object to store the values of the field
  const values: any = {};

  // Initialize a new array to store the unique items
  const result = [];

  // Iterate over the array
  for (const item of array) {
    // If the field value has not been seen before, add the item to the result array and mark the field value as seen
    if (!values[item[field]]) {
      result.push(item);
      values[item[field]] = true;
    }
  }

  // Return the result array
  return result;
}

function calcWeight(maxNum: number, num: number) {
  let maxWeight = 10;
  if (maxNum < 5) {
    maxWeight = 5;
  }
  return Math.floor((num / maxNum) * maxWeight);
}

function calcAverageIncrementally(
  newValue: number,
  currentSum: number,
  currentCount: number
) {
  currentSum += newValue;
  currentCount++;
  return currentSum / currentCount;
}

function aggregateTwoTratte(
  tratta1: number,
  tratta2: number,
  aggregate: DatiAggregType
): DatiAggregPerTrattaType {
  const tratta1Dati = aggregate.tratte[tratta1];
  const tratta2Dati = aggregate.tratte[tratta2];
  if (!tratta1Dati && !tratta2Dati) {
    //console.log("problemi", tratta1, tratta2, aggregate);
    return {
      trains: [],
      averageDelay: 0,
      numberOfTrains: 1,
      totalDelay: 0,
    };
  }
  if (!tratta1Dati) {
    return tratta2Dati;
  }
  if (!tratta2Dati) {
    return tratta1Dati;
  }

  return {
    trains: [...tratta1Dati.trains, ...tratta2Dati.trains],
    averageDelay:
      (tratta1Dati.averageDelay * tratta1Dati.numberOfTrains +
        tratta2Dati.averageDelay * tratta2Dati.numberOfTrains) /
      (tratta1Dati.numberOfTrains + tratta2Dati.numberOfTrains),
    numberOfTrains: tratta1Dati.numberOfTrains + tratta2Dati.numberOfTrains,
    totalDelay: tratta1Dati.totalDelay + tratta2Dati.totalDelay,
  };
}

interface DatiAggregType {
  maxCirculatingPerTratta: number;
  tratte: DatiDictAggregPerTrattaType;
}

type DatiDictAggregPerTrattaType = Record<number, DatiAggregPerTrattaType>;

export interface DatiAggregPerTrattaType {
  trains: ViaggiaTrenoDettaglioTrattaTypeInner[];
  averageDelay: number;
  numberOfTrains: number;
  totalDelay: number;
}

interface DettZoomStaz {
  codiceStazione: string;
  zoomStartRange: number;
  zoomStopRange: number;
  pinpointVisibile: boolean;
  pinpointVisible: boolean;
  labelVisibile: boolean;
  labelVisible: boolean;
  codiceRegione?: any;
}

interface MappaCitta {
  urlImagePinpoint: string;
  urlImageBaloon: string;
}

interface Localita {
  nomeLungo: string;
  nomeBreve: string;
  label: string;
  id: string;
}

interface ViaggiaTrenoStationsType {
  codReg: number;
  tipoStazione: number;
  dettZoomStaz: DettZoomStaz[];
  pstaz: any[];
  mappaCitta: MappaCitta;
  codiceStazione: string;
  codStazione: string;
  lat: number;
  lon: number;
  latMappaCitta: number;
  lonMappaCitta: number;
  localita: Localita;
  esterno: boolean;
  offsetX: number;
  offsetY: number;
  nomeCitta: string;
}

interface ViaggiaTrenoMeteoType {
  codStazione: string;
  oggiTemperatura: number;
  oggiTemperaturaMattino: number;
  oggiTemperaturaPomeriggio: number;
  oggiTemperaturaSera: number;
  oggiTempo: number;
  oggiTempoMattino: number;
  oggiTempoPomeriggio: number;
  oggiTempoSera: number;
  domaniTemperatura: number;
  domaniTemperaturaMattino: number;
  domaniTemperaturaPomeriggio: number;
  domaniTemperaturaSera: number;
  domaniTempo: number;
  domaniTempoMattino: number;
  domaniTempoPomeriggio: number;
  domaniTempoSera: number;
}

export interface ViaggiaTrenoTrattaType {
  nodoA: string;
  nodoB: string;
  trattaAB: number;
  trattaBA: number;
  parentAB: number;
  parentBA: number;
  latitudineA: number;
  longitudineA: number;
  latitudineB: number;
  longitudineB: number;
  occupata: boolean;
}

type ViaggiaTrenoDettaglioTrattaRespType = ViaggiaTrenoDettaglioTrattaType[];
interface ViaggiaTrenoDettaglioTrattaType {
  tratta: any;
  treni: ViaggiaTrenoDettaglioTrattaTypeInner[];
}

interface ViaggiaTrenoDettaglioTrattaTypeInner {
  numeroTreno: number;
  categoria: string;
  categoriaDescrizione: any;
  origine: string;
  codOrigine: string;
  destinazione: string;
  codDestinazione: string;
  origineEstera: any;
  destinazioneEstera: any;
  oraPartenzaEstera: any;
  oraArrivoEstera: any;
  tratta: number;
  regione: number;
  origineZero: any;
  destinazioneZero: any;
  orarioPartenzaZero: any;
  orarioArrivoZero: any;
  circolante: boolean;
  codiceCliente: number;
  binarioEffettivoArrivoCodice: any;
  binarioEffettivoArrivoDescrizione: any;
  binarioEffettivoArrivoTipo: any;
  binarioProgrammatoArrivoCodice: any;
  binarioProgrammatoArrivoDescrizione: any;
  binarioEffettivoPartenzaCodice: any;
  binarioEffettivoPartenzaDescrizione: any;
  binarioEffettivoPartenzaTipo: any;
  binarioProgrammatoPartenzaCodice: any;
  binarioProgrammatoPartenzaDescrizione: any;
  subTitle: any;
  esisteCorsaZero: any;
  orientamento: any;
  inStazione: boolean;
  haCambiNumero: boolean;
  nonPartito: boolean;
  provvedimento: number;
  riprogrammazione: string;
  orarioPartenza: number;
  orarioArrivo: number;
  stazionePartenza: any;
  stazioneArrivo: any;
  statoTreno: any;
  corrispondenze: any;
  servizi: any;
  ritardo: number;
  tipoProdotto: string;
  compOrarioPartenzaZeroEffettivo: string;
  compOrarioArrivoZeroEffettivo: any;
  compOrarioPartenzaZero: string;
  compOrarioArrivoZero: any;
  compOrarioArrivo: string;
  compOrarioPartenza: string;
  compNumeroTreno: string;
  compOrientamento: string[];
  compTipologiaTreno: string;
  compClassRitardoTxt: string;
  compClassRitardoLine: string;
  compImgRitardo2: string;
  compImgRitardo: string;
  compRitardo: string[];
  compRitardoAndamento: string[];
  compInStazionePartenza: string[];
  compInStazioneArrivo: string[];
  compOrarioEffettivoArrivo: string;
  compDurata: string;
  compImgCambiNumerazione: string;
  materiale_label: any;
  dataPartenzaTreno: number;
}
