import React, { useState, useEffect, FC } from "react";
import ReactDOM from "react";
import { Line } from "@ant-design/plots";
import { DelayDataCharts } from "../../../trenitalia-bot/src/types";
import { InfoCircleOutlined } from "@ant-design/icons";

interface DelayChartProps {
  data: DelayDataCharts;
  setDetailedJourney: Function;
}

const DelayChart: FC<DelayChartProps> = ({ data, setDetailedJourney }) => {
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
  return (
    <>
      <div>
        <InfoCircleOutlined /> clicca su un punto del grafico per vedere il
        dettaglio del viaggio
      </div>
      <Line
        {...config}
        onReady={(chartInstance) => {
          chartInstance.on("element:click", (args: any) => {
            try {
              console.log(args);
              const date = args.data.data.date;
              console.log("dettaglio del ", date);
              if (date) setDetailedJourney(date);
            } catch (e) {
              console.log(e);
            }
          });
        }}
      />
    </>
  );
};

export default DelayChart;
