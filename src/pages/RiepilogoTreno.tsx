import { Divider } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";
import { getDate } from "../utils/getDate";
import { getTime } from "../utils/getTime";
import { Card, Col, DatePicker, Row, Space, Tooltip } from "antd";
import FilterBar from "../components/FilterBar";
import "moment/locale/it";
import locale from "antd/es/date-picker/locale/it_IT";
import DelayChart from "../components/DelayChart";
import delaysForChart from "../utils/delayForChart";
import ReliabilityGauge from "../components/ReliabilityGauge";
import computeReliabilityScore from "../utils/computeReliabilityScore";
import { InfoCircleOutlined } from "@ant-design/icons";
import computeAverageDelay from "../utils/computeAverageDelay";
import ColoredDelayComponent from "../components/AverageDelayComponent";
import DelayPerStationModal from "../components/DelayPerStationModal";
import Multiselect from "../components/Multiselect";
import SelectDropdown from "../components/SelectDropdown";

import {
  TrainNumber,
  Station,
  Journey,
  JourneyStation,
} from "../../../trenitalia-bot/prisma/generated/prisma-client-js";
import { convertDelayAtSpecificStation } from "../utils/utils";
import MySlider from "../components/MySlider";

const { RangePicker }: any = DatePicker;

interface RiepilogoTrenoParams {
  trainNumber: string;
}

type TrainResp = TrainNumber & {
  departureLocation: Station;
  arrivalLocation: Station;
  journeys: (Journey & {
    stations: (JourneyStation & {
      station: Station;
    })[];
  })[];
};

const RiepilogoTreno: React.FC = (props) => {
  const params = useParams<RiepilogoTrenoParams>();
  const search = useLocation().search;
  const trainNum = new URLSearchParams(search).get("trainNum");
  const trainId = new URLSearchParams(search).get("trainId");
  const startLocationId = new URLSearchParams(search).get("startLocationId");
  const [consideredStation, setConsideredStation] = useState<{
    name: string;
    id: number;
  }>();
  const [filters, setFilters] = useState({
    startDate: undefined,
    endDate: undefined,
    weekDays: [] as string[],
  });

  const [data, setData] = useState<TrainResp>({} as TrainResp); // could be dangerous but until dataReady this is not used
  const listOfStations = useRef<
    | (JourneyStation & {
        station: Station;
      })[]
    | undefined
  >();
  const [toleratedDelay, setToleratedDelay] = useState(5);
  const [detailedJourney, setDetailedJourney] = useState({});
  const [showDetailedJourneyModal, setShowDetailedJourneyModal] =
    useState(false);
  const [dataReady, setReady] = useState(false);
  const journeysDelaysMappedToConsideredStation = data?.journeys?.map(
    (journey) => {
      return convertDelayAtSpecificStation(journey, consideredStation?.id);
    }
  );
  const journeysDepartureDelaysFromDepLocation = data?.journeys?.map(
    (journey) => {
      return convertDelayAtSpecificStation(
        journey,
        data.departureLocationId,
        false
      );
    }
  );

  useEffect(() => {
    setReady(false);
    fetch(
      `${
        process.env.REACT_APP_API_URI
      }/train?trainNumber=${trainNum}&startLocationId=${startLocationId}&trainId=${trainId}&startDate=${
        filters.startDate || ""
      }&endDate=${filters.endDate || ""}&weekDays=${JSON.stringify(
        filters.weekDays
      )}` as string
    )
      .then((data) => data.json())
      .then((datajson) => {
        const data = datajson as TrainResp;
        console.log(data);
        setData(data);
        listOfStations.current =
          data.journeys.length > 0 ? data.journeys[0].stations : undefined;
        setReady(true);
      });
  }, [filters.endDate, filters.startDate, filters.weekDays]);

  return (
    <div>
      {!dataReady && <div>Caricamento...</div>}
      {dataReady && (
        <>
          <div>
            <h1>riepilogo treno {data.classification + " " + data.name} </h1>
            <h2>
              da {data.departureLocation.name} a {data.arrivalLocation.name}
            </h2>
          </div>
        </>
      )}

      <FilterBar>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            minWidth: 300,
          }}
        >
          <h2 style={{ padding: "1em", margin: 0 }}>Filtri</h2>
          <div>
            <div>date inizio e fine</div>
            <RangePicker
              locale={locale}
              format="DD/MM/YYYY"
              onChange={(date: any) => {
                // better solution: make useState start end time update only the values, the filter will update another routine
                if (!date) {
                  setFilters({
                    ...filters,
                    startDate: undefined,
                    endDate: undefined,
                  });
                  return;
                }
                const startDate = date[0]?.startOf("day").toJSON();
                const endDate = date[1]?.endOf("day").toJSON();
                setFilters({ ...filters, startDate, endDate });
              }}
            />
          </div>
        </div>

        <div
          style={{ flex: 1, marginLeft: "1em", minWidth: 200, maxWidth: 400 }}
        >
          <div>giorni della settimana considerati</div>
          <Multiselect
            handleChangeFn={(value) => {
              //console.log(value);
              if (JSON.stringify(value) !== JSON.stringify(filters.weekDays)) {
                setFilters({ ...filters, weekDays: value });
              }
            }}
            options={[
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ]}
          />
        </div>
      </FilterBar>

      {dataReady && (
        <>
          <Row>
            <Space style={{ paddingBottom: "1em" }}>
              Seleziona una stazione specifica per avere dettagli mirati
              <SelectDropdown
                handleChangeFn={(val, data) => {
                  console.log(data);
                  setConsideredStation({
                    name: data.children,
                    id: data.value,
                  });
                }}
                options={listOfStations.current?.slice(1).map((stat) => {
                  return { name: stat.station.name, value: stat.station.id };
                })}
                defaultVal={
                  consideredStation?.name ||
                  (listOfStations.current
                    ? listOfStations.current[listOfStations.current.length - 1]
                        .station.name
                    : undefined)
                }
              />
            </Space>
          </Row>
          <Row>
            <Col flex="0 1 300px">
              <Card
                title={
                  <Tooltip
                    title={`indica la percentuale di viaggi in cui il treno ha avuto
                    un ritardo tollerabile`}
                    placement="bottom"
                  >
                    Indice di Affidabilità <InfoCircleOutlined />
                  </Tooltip>
                }
              >
                <div>Imposta il tuo ritardo tollerabile</div>
                <MySlider
                  defaultToleratedDelay={toleratedDelay}
                  handleChangeFn={(value) => {
                    setToleratedDelay(value);
                  }}
                />
                <ReliabilityGauge
                  percent={computeReliabilityScore(
                    journeysDelaysMappedToConsideredStation,
                    toleratedDelay
                  )}
                />
              </Card>
            </Col>
            <Col flex="0 1 300px">
              <Card
                title={
                  "Ritardo medio all'arrivo a " +
                  (consideredStation?.name || data.arrivalLocation.name)
                }
                style={{ height: "100%" }}
              >
                <ColoredDelayComponent
                  delay={computeAverageDelay(
                    journeysDelaysMappedToConsideredStation
                  )}
                />
              </Card>
            </Col>
            <Col flex="0 1 300px">
              <Card
                title={
                  "Ritardo medio in partenza da " + data.departureLocation.name
                }
                style={{ height: "100%" }}
              >
                <ColoredDelayComponent
                  delay={computeAverageDelay(
                    journeysDepartureDelaysFromDepLocation
                  )}
                />
              </Card>
            </Col>
          </Row>

          <DelayChart
            data={delaysForChart(journeysDelaysMappedToConsideredStation)}
            setDetailedJourney={(date: string) => {
              const selected = data.journeys.filter((journey: any) => {
                return delaysForChart([journey])[0].date === date;
              });
              setDetailedJourney(selected[0]);
              console.log(detailedJourney);
              setShowDetailedJourneyModal(true);
            }}
          />

          <DelayPerStationModal
            journey={detailedJourney}
            visible={showDetailedJourneyModal}
            closeFn={() => setShowDetailedJourneyModal(false)}
          />

          {data.journeys.map((journey: any, index: number) => (
            <div key={journey.id}>
              <CardTreno journey={journey} name={data.name} />
              <Divider style={{ padding: "0.5em" }}></Divider>
            </div>
          ))}
        </>
      )}
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
