import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
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
import computeReliabilityScore, {
  maxDelayForAGoodJourney,
} from "../utils/computeReliabilityScore";
import { InfoCircleOutlined } from "@ant-design/icons";
import computeAverageDelay from "../utils/computeAverageDelay";
import AverageDelayComponent from "../components/AverageDelayComponent";

const { RangePicker } = DatePicker;

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
          <div>
            <h1>riepilogo treno {data.classification + " " + data.name} </h1>
            <h2>
              da {data.departureLocation.name} a {data.arrivalLocation.name}
            </h2>
          </div>
        </>
      )}
      <div>
        <FilterBar>
          <h2 style={{ padding: "1em", margin: 0 }}>Filtri</h2>
          <Space direction="vertical" size={12}>
            <RangePicker
              locale={locale}
              format="DD/MM/YYYY"
              onChange={(date) => {
                // better solution: make useState start end time update only the values, the filter will update another routine
                if (!date) {
                  // date not selected, get all
                  setReady(false);
                  fetch(
                    `${process.env.REACT_APP_API_URI}/train?trainNumber=${trainNum}&startLocationId=${startLocationId}` as string
                  )
                    .then((data) => data.json())
                    .then((data) => {
                      console.log(data);
                      setData(data);
                      setReady(true);
                    });
                  return;
                }
                const startDate = date[0]?.startOf("day").toJSON();
                const endDate = date[1]?.endOf("day").toJSON();
                setReady(false);
                fetch(
                  `${process.env.REACT_APP_API_URI}/train?trainNumber=${trainNum}&startLocationId=${startLocationId}&startDate=${startDate}&endDate=${endDate}` as string
                )
                  .then((data) => data.json())
                  .then((data) => {
                    console.log(data);
                    setData(data);
                    setReady(true);
                  });
              }}
            />
          </Space>
        </FilterBar>
      </div>
      {dataReady && (
        <>
          <Row>
            <Col flex="0 1 300px">
              <Card
                title={
                  <Tooltip
                    title={`indica la percentuale di viaggi in cui il treno ha avuto
                    un ritardo accettabile (inferiore a ${
                      maxDelayForAGoodJourney / (1000 * 60)
                    } minuti)`}
                    placement="bottom"
                  >
                    Indice di Affidabilità <InfoCircleOutlined />
                  </Tooltip>
                }
              >
                <ReliabilityGauge
                  percent={computeReliabilityScore(data.journeys)}
                />
              </Card>
            </Col>
            <Col flex="0 1 300px">
              <Card title="Ritardo medio" style={{ height: "100%" }}>
                <AverageDelayComponent
                  delay={computeAverageDelay(data.journeys)}
                />
              </Card>
            </Col>
          </Row>

          <DelayChart data={delaysForChart(data.journeys)} />
          {data.journeys.map((journey: any, index: number) => (
            <>
              <CardTreno key={index} journey={journey} name={data.name} />
              <Divider style={{ padding: "0.5em" }}></Divider>
            </>
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
