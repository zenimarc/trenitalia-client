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

  console.log(stationsList);
  console.log(tratte);
  const position: [number, number] = [41.9, 12.5]; // center the map on Italy
  const points = stationsList.filter((p) => p.dettZoomStaz[0].pinpointVisible);

  // BOUNDS FOR ITALY
  const minLat = 35.0; // Minimum latitude
  const maxLat = 48.0; // Maximum latitude
  const minLon = 5.0; // Minimum longitude
  const maxLon = 20.0; // Maximum longitude
  const bounds: [[number, number], [number, number]] = [
    [minLat, minLon],
    [maxLat, maxLon],
  ];

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
      const tratteDataDict = {};
      const listaTupleTratte = tratte.map((tratta) => [
        tratta.trattaAB,
        tratta.trattaBA,
      ]);
      const tasks = listaTupleTratte.map((tuplaTratte) => {
        return async () => {
          await viaggiaTrenoAPI.getDettaglioTratta(
            tuplaTratte[0],
            tuplaTratte[1]
          );
        };
      });
      console.log(tasks);

      Promise.allSettled(tasks, { concurrency: 6 })
        .then((results) => {
          // all tasks are complete
          console.log(results);
        })
        .catch((error) => {
          // one or more tasks failed
          console.error(error);
        });
    }

    fetchData();
  }, []);

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
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
        />
        {points.map((point) => (
          <>
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
          </>
        ))}
        {tratte.map((line) => (
          <Polyline
            positions={[
              [line.latitudineA, line.longitudineA],
              [line.latitudineB, line.longitudineB],
            ]}
            color={line.occupata ? "blue" : "gray"}
          />
        ))}
      </MapContainer>
    </>
  );
};

export default TrainMap;

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

interface ViaggiaTrenoTrattaType {
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
