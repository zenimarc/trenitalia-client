const API = "http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno";

export const ViaggiaTrenoAPI = () => {
  const getStations = async () => {
    const url = process.env.REACT_APP_API_URI + "/viaggiatreno/elencoStazioni";
    const data = await fetch(url);
    const dataJson = await data.json();
    return dataJson;
  };
  const getTratte = async () => {
    const url = process.env.REACT_APP_API_URI + "/viaggiatreno/elencoTratte";
    const data = await fetch(url);
    const dataJson = await data.json();
    return dataJson;
  };
  const getMeteo = async () => {
    const url = process.env.REACT_APP_API_URI + "/viaggiatreno/datiMeteo";
    const data = await fetch(url);
    const dataJson = await data.json();
    return dataJson;
  };
  const getDettaglioTratta = async (tratta1: number, tratta2: number) => {
    const url =
      process.env.REACT_APP_API_URI +
      `/viaggiatreno/dettaglioTratta?tratta1=${tratta1}&tratta2=${tratta2}`;
    const data = await fetch(url);
    const dataJson = await data.json();
    return dataJson;
  };

  return {
    getStations,
    getTratte,
    getMeteo,
    getDettaglioTratta,
  };
};
