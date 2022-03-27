import React, { useState } from "react";
import styled from "styled-components";
import { getDate } from "../utils/getDate";
import { getTime } from "../utils/getTime";

const CardTrainNumber = ({
  trainNumber,
  denomination,
  date,
  startLocation,
  startLocationId,
  endLocation,
  onClickFn,
}: CardTrainNumberParams) => {
  const CardTrainNumberDiv = styled.div`
    display: flex;
    flex-direction: row;
    background-color: #86b1d6;
    border: 1em;
    border-color: black;
    border-radius: 16px;
    padding: 1em;
    margin-top: 1em;
    cursor: pointer;
  `;

  return (
    <CardTrainNumberDiv
      onClick={() => {
        onClickFn();
      }}
    >
      treno {trainNumber} {denomination} <br />
      da {startLocation} a {endLocation}
    </CardTrainNumberDiv>
  );
};

type CardTrainNumberParams = {
  trainNumber: string;
  denomination: string;
  date: string;
  startLocation: string;
  startLocationId: number;
  endLocation: string;
  onClickFn: Function;
};

export default CardTrainNumber;
