import { ResponseAutocompletionStation } from "../../../trenitalia-bot/src/types";

export const convertAutocompleteStationToSelectData = (
  data: ResponseAutocompletionStation[]
): { value: string; label: string }[] => {
  return data.map((elem) => {
    return { value: String(elem.locationId), label: elem.name };
  });
};
