import React, { FC } from "react";
import styled from "styled-components";

interface ColoredDelayComponentProps {
  delay: number; //in minutes
  absoluteValuesMode?: boolean;
  height?: string;
  fontSize?: string;
}

const ColoredDelayComponent: FC<ColoredDelayComponentProps> = ({
  delay,
  height,
  fontSize,
  absoluteValuesMode = false,
}) => {
  let bgColor = "#fff";
  if (delay < 5) {
    bgColor = "#99e2b4";
  } else if (delay < 15) {
    bgColor = "#f4d35e";
  } else if (delay < 30) {
    bgColor = "#ff7900";
  } else {
    bgColor = "#cc5c6f";
  }

  return (
    <DelayStyle height={height} fontSize={fontSize} bgColor={bgColor}>
      {absoluteValuesMode ? Math.abs(delay) : delay}
    </DelayStyle>
  );
};

export default ColoredDelayComponent;

const DelayStyle = styled.div<{
  bgColor: string;
  height?: string;
  fontSize?: string;
}>`
  background-color: ${(props) => props.bgColor};
  height: ${(props) => props.height || "100px"};
  font-size: ${(props) => props.fontSize || "5em"};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
`;
