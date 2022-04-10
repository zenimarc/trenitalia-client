import React, { FC } from "react";
import styled from "styled-components";

interface AverageDelayComponentProps {
  delay: number; //in minutes
}

const AverageDelayComponent: FC<AverageDelayComponentProps> = ({ delay }) => {
  let bgColor = "#fff";
  if (delay < 5) {
    bgColor = "#99e2b4";
  } else if (delay < 15) {
    bgColor = "#f4d35e";
  } else if (delay < 30) {
    bgColor = "#ff7900";
  } else {
    bgColor = "#a0001c";
  }
  const DelayStyle = styled.div`
    background-color: ${bgColor};
    height: 100px;
    font-size: 5em;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  return <DelayStyle>{delay}</DelayStyle>;
};

export default AverageDelayComponent;
