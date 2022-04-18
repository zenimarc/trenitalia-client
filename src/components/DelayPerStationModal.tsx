import React, { FC, useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { Timeline } from "antd";
import styled from "styled-components";
import ColoredDelayComponent from "./AverageDelayComponent";
import convertMsToMinutes from "../utils/convertMsToMinutes";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface DelayPerStationModalProps {
  journey: any;
  visible: boolean;
  closeFn: Function;
}

const DelayPerStationModal: FC<DelayPerStationModalProps> = ({
  journey,
  visible,
  closeFn,
}) => {
  return (
    <Modal
      title={`Viaggio del ${new Date(
        journey.date
      ).toLocaleDateString()} (chiuso con ${convertMsToMinutes(
        journey.delay
      )}min)`}
      visible={visible}
      onOk={() => closeFn()}
      onCancel={() => closeFn()}
    >
      <Timeline>
        <div>
          {journey.stations &&
            journey.stations.map((station: StationDelay, idx: number) => {
              const isLastStation = () => idx === journey.stations.length - 1;
              const isFirstStation = () => idx === 0;
              return (
                <Timeline.Item style={{ paddingBottom: 0 }}>
                  <>
                    {idx >= 1 && (
                      <AccumulatedDelay
                        delay={
                          convertMsToMinutes(station.arrivalDelay) -
                          convertMsToMinutes(
                            journey.stations[idx - 1].arrivalDelay
                          )
                        }
                      />
                    )}
                    <DelayInStation
                      stationDelay={station}
                      isFirstStation={isFirstStation()}
                      isLastStation={isLastStation()}
                    />
                  </>
                </Timeline.Item>
              );
            })}
        </div>
      </Timeline>
    </Modal>
  );
};

export default DelayPerStationModal;

type StationDelay = {
  actualPlatform: string;
  arrivalDelay: number;
  arrivalTime: string;
  departureDelay: number;
  departureTime: string;
  plannedPlatform: string;
  station: {
    id: number;
    name: string;
  };
  stationId: number;
};

const DelayInStation = ({
  stationDelay,
  isLastStation = false,
  isFirstStation = false,
}: {
  stationDelay: StationDelay;
  isLastStation?: boolean;
  isFirstStation?: boolean;
}) => {
  const {
    actualPlatform,
    arrivalDelay,
    arrivalTime,
    departureDelay,
    departureTime,
    plannedPlatform,
    station,
  } = stationDelay;
  const stationName = station.name;

  const binarioMatch = () => actualPlatform === plannedPlatform;

  return (
    <StationDelayDiv>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <h3>{stationName}</h3>
        <div>
          binario
          <div style={{ fontWeight: 500 }}>
            <PlannedBinarioSpan isBinarioMatch={binarioMatch()}>
              {plannedPlatform}
            </PlannedBinarioSpan>{" "}
            {binarioMatch() ? "" : " ->" + actualPlatform}
          </div>
        </div>
      </div>
      {!isFirstStation && (
        <SmallDelayDescr
          descr="ritardo all'arrivo"
          delay={convertMsToMinutes(arrivalDelay)}
        />
      )}
      {!isLastStation && (
        <SmallDelayDescr
          descr="ritardo in partenza"
          delay={convertMsToMinutes(departureDelay)}
        />
      )}
    </StationDelayDiv>
  );
};

const AccumulatedDelay = ({ delay }: { delay: number }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", padding: "1em" }}>
        <AccessTimeIcon style={{ marginRight: "0.1em" }} />{" "}
        {delay >= 0 ? "accumulato" : "recuperato"}{" "}
        <SmallDelayDescr
          delay={delay}
          descr="minuti"
          absoluteValueMode={true}
        />
      </div>
    </div>
  );
};

const SmallDelayDescr = ({
  delay,
  descr,
  absoluteValueMode = false,
}: {
  delay: number;
  descr: string;
  absoluteValueMode?: boolean;
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ width: "40px" }}>
        <ColoredDelayComponent
          height="20px"
          fontSize="12"
          delay={delay}
          absoluteValuesMode={absoluteValueMode}
        />{" "}
      </div>
      <span style={{ marginLeft: "0.4em" }}>{descr}</span>
    </div>
  );
};

const PlannedBinarioSpan = styled.span<{ isBinarioMatch: boolean }>`
  color: ${(props) => (props.isBinarioMatch ? "black" : "red")};
`;

const StationDelayDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  padding: 10px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.25);
`;
