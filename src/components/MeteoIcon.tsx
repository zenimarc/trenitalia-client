import React from "react";

export const getMeteoIconUrl = (num: number) =>
  `http://www.viaggiatreno.it/infomobilitamobile/img/legenda/meteo/${num}_new.png`;

const MeteoIcon = ({ num }: { num: number }) => {
  return <img src={getMeteoIconUrl(num)} />;
};

export default MeteoIcon;
