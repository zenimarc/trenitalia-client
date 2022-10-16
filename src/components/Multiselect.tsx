import { Select } from "antd";
import React, { useState } from "react";
const { Option } = Select;

interface MultiselectProps {
  handleChangeFn: (value: string[]) => void;
  options: string[];
}

const Multiselect = ({ handleChangeFn, options }: MultiselectProps) => {
  const handleChange = handleChangeFn;
  let values = [] as string[];
  const children = options.map((day) => <Option key={day}>{day}</Option>);

  return (
    <Select
      mode="multiple"
      allowClear
      style={{ width: "100%" }}
      placeholder="Please select"
      defaultValue={[]}
      onChange={(val) => {
        values = [...val];
      }}
      onBlur={() => {
        handleChange(values);
      }}
      onDeselect={(val: any) => {
        handleChange(values);
      }}
      onClear={() => handleChange(values)}
    >
      {children}
    </Select>
  );
};

export default Multiselect;
