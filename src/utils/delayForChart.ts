import {
  TrainNumber,
  Station,
  Journey,
  JourneyStation,
} from "../../../trenitalia-bot/prisma/generated/prisma-client-js";

const delaysForChart = (
  journeys: (Journey & {
    stations: (JourneyStation & {
      station: Station;
    })[];
  })[]
) => {
  return journeys.map((journey) => {
    const date = new Date(journey.date).toLocaleDateString();
    if (journey.isCanceled)
      return {
        date,
        value: 120, // IN CASO DI TRENO CANCELLATO SETTO 2 ORE (120 minuti)
      };
    return {
      date,
      value: journey.delay / 60000,
    };
  });
};

export default delaysForChart;
