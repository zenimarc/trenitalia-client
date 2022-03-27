export const getTime = (stringDate: string) => {
  const date = new Date(stringDate);
  return date.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
