import { ResponseAutocompletionStation } from "../../../trenitalia-bot/src/types";

import {
  TrainNumber,
  Station,
  Journey,
  JourneyStation,
} from "../../../trenitalia-bot/prisma/generated/prisma-client-js";

export const convertAutocompleteStationToSelectData = (
  data: ResponseAutocompletionStation[]
): { value: string; label: string }[] => {
  return data.map((elem) => {
    return { value: String(elem.locationId), label: elem.name };
  });
};

export const convertDelayAtSpecificStation = (
  journey: Journey & {
    stations: (JourneyStation & {
      station: Station;
    })[];
  },
  specificStationId: number | undefined,
  delayAtArrival: boolean = true
) => {
  if (specificStationId === undefined) {
    return journey;
  }
  if (delayAtArrival) {
    return {
      ...journey,
      delay:
        journey.stations.find((el) => el.stationId === specificStationId)
          ?.arrivalDelay || journey.delay,
    };
  } else {
    return {
      ...journey,
      delay:
        journey.stations.find((el) => el.stationId === specificStationId)
          ?.departureDelay || 0,
    };
  }
};
