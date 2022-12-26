import React from "react";
import { getColorFromValue } from "../utils/colorPalettes";

interface LegendProps {
  minValue: number;
  maxValue: number;
  palette: string[];
  style?: React.CSSProperties;
  className?: string;
}

const ColorPaletteLegend = ({
  minValue,
  maxValue,
  palette,
  style,
  className,
}: LegendProps) => {
  return (
    <div className={`legend ${className}`} style={style}>
      <div>Ritardo (min)</div>
      <div style={{ position: "relative" }}>
        {Array.from({ length: maxValue + 1 }).map((_, i) => {
          const value = i;
          const color = getColorFromValue(value, minValue, maxValue, palette);
          return (
            <div
              key={i}
              className="legend-item"
              style={{ backgroundColor: color, height: 1 }}
            />
          );
        })}
        {/* Add the minimum and maximum values as text */}
        <div style={{ position: "absolute", top: -5, left: -10 }}>
          {minValue}
        </div>
        <div style={{ position: "absolute", bottom: -15, left: -15 }}>
          {">" + maxValue}
        </div>
      </div>
      {/* Add a legend item for each value in the range */}
    </div>
  );
};

export default ColorPaletteLegend;
