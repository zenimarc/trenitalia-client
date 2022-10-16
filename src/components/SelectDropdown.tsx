import { Select } from "antd";
import React, { useState } from "react";
const { Option } = Select;

interface SelectDropdownProps {
  handleChangeFn: (value: any, data: any) => void;
  options: { name: string; value: string | number }[] | undefined;
  defaultVal: string | undefined;
}

const SelectDropdown = ({
  handleChangeFn,
  options,
  defaultVal,
}: SelectDropdownProps) => {
  const handleChange = handleChangeFn;
  let values = [] as string[];
  const children = options?.map((station) => (
    <Option key={station.value} value={station.value}>
      {station.name}
    </Option>
  ));

  return (
    <Select
      showSearch
      placeholder="Select a station"
      optionFilterProp="children"
      onChange={handleChange}
      defaultValue={defaultVal}
      filterOption={(input, option) =>
        (option!.children as unknown as string)
          .toLowerCase()
          .includes(input.toLowerCase())
      }
    >
      {children}
    </Select>
  );
};

export default SelectDropdown;
