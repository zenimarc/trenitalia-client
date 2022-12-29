import React, { useEffect, useRef, useState } from "react";
import { Button, Container, TextField } from "@mui/material";
import { useHistory } from "react-router";
import { UserTracking } from "../../../trenitalia-bot/src/types";
import ButtonAsLink from "../components/ButtonAsLink";
import { Divider, DatePicker, DatePickerProps } from "antd";
import { useLocation } from "react-router-dom";
import moment from "moment";

interface infomobilitaType {
  id: string;
  date: string;
  infomobilita: string;
}

const Infomobilita: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  let savedDate = params.get("date");
  let filterDateObj: Date;
  if (!savedDate || isNaN(Date.parse(savedDate))) {
    filterDateObj = new Date();
  } else {
    filterDateObj = savedDate ? new Date(savedDate) : new Date();
  }

  const [data, setData] = useState<infomobilitaType>();
  /* const [filterDate, setFilterDate] = useState<Date>(
    new Date(savedDate || new Date())
  ); */
  const [isLoading, setIsLoading] = useState(true);
  const [nothingFound, setNothingFound] = useState(false);
  const history = useHistory();

  const parsedJson = data && JSON.parse(data.infomobilita);
  const avvisi = parsedJson;

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);

    /* setFilterDate(date ? new Date(date?.toISOString()) : new Date()); */
    const newLocation = {
      ...location,
      search: `?date=${date ? date.toISOString() : new Date().toISOString()}`,
    };
    history.push(newLocation);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      let apiUrl = process.env.REACT_APP_API_URI + "/viaggiatreno/infomobilita";
      if (filterDateObj) {
        apiUrl += "?date=" + filterDateObj.toISOString();
      }
      try {
        const resp = await fetch(apiUrl as string);
        if (!resp.ok) {
          setNothingFound(true);
          setIsLoading(false);
        }
        const respJson = await resp.json();
        setData(respJson);
        setIsLoading(false);
        setNothingFound(false);
      } catch (e) {
        setNothingFound(true);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [history.location]);

  return (
    <div>
      <h1>Storico Avvisi infomobilita</h1>
      <DatePicker onChange={onChange} value={moment(filterDateObj)} />
      <Divider />
      {isLoading && <div>loading...</div>}
      <div>
        {!isLoading &&
          !nothingFound &&
          avvisi &&
          Object.keys(avvisi).map((key) => {
            const content = avvisi[key];
            return (
              <div key={key}>
                <div dangerouslySetInnerHTML={{ __html: content }} />
                <Divider />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Infomobilita;
