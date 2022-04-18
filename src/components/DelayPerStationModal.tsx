import React, { FC, useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { Timeline } from "antd";
import styled from "styled-components";
import ColoredDelayComponent from "./AverageDelayComponent";
import convertMsToMinutes from "../utils/convertMsToMinutes";

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
      title={`Viaggio del ${new Date(journey.date).toLocaleDateString()}`}
      visible={visible}
      onOk={() => closeFn()}
      onCancel={() => closeFn()}
    >
      <Timeline>
        <div>
          {journey.stations &&
            journey.stations.map((station: StationDelay, idx: number) => {
              return (
                <Timeline.Item>
                  {idx >= 1 && (
                    <div>
                      accumulato{" "}
                      {convertMsToMinutes(station.arrivalDelay) -
                        convertMsToMinutes(
                          journey.stations[idx - 1].arrivalDelay
                        )}
                    </div>
                  )}
                  <DelayInStation stationDelay={station} />
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

interface DelayInStationProps {
  stationDelay: StationDelay;
}

const DelayInStation: FC<DelayInStationProps> = ({ stationDelay }) => {
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
      <div style={{ display: "flex" }}>
        <div style={{ width: "40px" }}>
          <ColoredDelayComponent
            height="20px"
            fontSize="12"
            delay={convertMsToMinutes(arrivalDelay)}
          />{" "}
        </div>
        <span style={{ marginLeft: "0.4em" }}>
          minuti di ritardo all'arrivo
        </span>
      </div>
    </StationDelayDiv>
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
