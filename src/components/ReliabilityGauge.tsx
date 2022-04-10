import React, { useState, useEffect, FC } from "react";
import ReactDOM from "react-dom";
import { Gauge } from "@ant-design/plots";

interface ReliabilityGaugeProps {
  percent: number;
}

const ReliabilityGauge: FC<ReliabilityGaugeProps> = ({ percent }) => {
  const config = {
    style: {
      maxHeight: "200px",
    },
    percent,
    range: {
      ticks: [0, 1 / 2, 9 / 10, 1],
      color: ["#F4664A", "#FAAD14", "#30BF78"],
    },
    indicator: {
      pointer: {
        style: {
          stroke: "#D0D0D0",
        },
      },
      pin: {
        style: {
          stroke: "#D0D0D0",
        },
      },
    },
    statistic: {
      content: {
        style: {
          fontSize: "36px",
          lineHeight: "36px",
        },
      },
    },
  };
  return <Gauge {...config} />;
};

export default ReliabilityGauge;
