import React, { useState, useEffect, FC } from "react";
import ReactDOM from "react";
import { Line } from "@ant-design/plots";
import { DelayDataCharts } from "../../../trenitalia-bot/src/types";

interface DelayChartProps {
  data: DelayDataCharts;
}

const DelayChart: FC<DelayChartProps> = ({ data }) => {
  const config = {
    data,
    xField: "date",
    yField: "value",
    label: {},
    point: {
      size: 5,
      shape: "diamond",
      style: {
        fill: "white",
        stroke: "#5B8FF9",
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: "#000",
          fill: "red",
        },
      },
    },
    interactions: [
      {
        type: "marker-active",
      },
    ],
  };
  return <Line {...config} />;
};

export default DelayChart;
