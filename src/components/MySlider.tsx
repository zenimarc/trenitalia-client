import { Col, InputNumber, Row, Slider } from "antd";
import React, { useState } from "react";

interface SliderDropdownProps {
  handleChangeFn: (value: any) => void;
  defaultToleratedDelay: number;
}

const MySlider = ({
  handleChangeFn,
  defaultToleratedDelay,
}: SliderDropdownProps) => {
  const [inputValue, setInputValue] = useState(defaultToleratedDelay);

  const onChange = (newValue: number) => {
    setInputValue(newValue);
    handleChangeFn(newValue);
  };

  return (
    <Row>
      <Col span={12}>
        <Slider
          min={1}
          max={30}
          onChange={onChange}
          value={typeof inputValue === "number" ? inputValue : 0}
        />
      </Col>
      <Col span={4}>
        <InputNumber
          min={1}
          max={30}
          style={{ margin: "0 16px" }}
          value={inputValue}
          onChange={onChange}
        />
      </Col>
    </Row>
  );
};

export default MySlider;
