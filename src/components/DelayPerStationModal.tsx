import React, { FC, useEffect, useState } from "react";
import { Modal, Button, Tooltip } from "antd";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import styled from "styled-components";
import ColoredDelayComponent from "./AverageDelayComponent";
import convertMsToMinutes from "../utils/convertMsToMinutes";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { TimelineOppositeContent } from "@mui/lab";
import { EvStationSharp } from "@mui/icons-material";

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
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot variant="outlined" />
                    <TimelineConnector
                      children={
                        idx < journey.stations.length - 1 && (
                          <Tooltip
                            placement="bottom"
                            title={`ritardo accumulato tra ${
                              station.station.name
                            } e ${journey.stations[idx + 1].station.name}`}
                          >
                            <div style={{ marginTop: "2em" }}>
                              <AccumulatedDelay
                                delay={
                                  convertMsToMinutes(
                                    journey.stations[idx + 1].arrivalDelay
                                  ) - convertMsToMinutes(station.arrivalDelay)
                                }
                              />
                            </div>
                          </Tooltip>
                        )
                      }
                    />
                  </TimelineSeparator>
                  <TimelineContent>
                    <>
                      <DelayInStation stationDelay={station} />
                    </>
                  </TimelineContent>
                  <TimelineOppositeContent style={{ display: "none" }} />
                </TimelineItem>
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

const DelayInStation = ({ stationDelay }: { stationDelay: StationDelay }) => {
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
      <div>
        partito con {convertMsToMinutes(departureDelay)} minuti di ritardo
      </div>
      <div>
        arrivato con {convertMsToMinutes(arrivalDelay)} minuti di ritardo
      </div>
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
      <div style={{ display: "flex", alignItems: "center" }}>
        <SmallDelayDescr delay={delay} descr="" absoluteValueMode={false} />
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
