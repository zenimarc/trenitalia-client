export const convertDate = (stringDate: string) => {
  const date = new Date(stringDate);
  return date.toLocaleDateString("it-IT");
};
