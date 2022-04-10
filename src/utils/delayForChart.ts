const delaysForChart = (journeys: any) => {
  return journeys.map((journey: any) => {
    if (journey.isCanceled)
      return {
        date: new Date(journey.date).toLocaleDateString(),
        value: 120, // IN CASO DI TRENO CANCELLATO SETTO 2 ORE (120 minuti)
      };
    return {
      date: new Date(journey.date).toLocaleDateString(),
      value: journey.delay / 60000,
    };
  });
};

export default delaysForChart;
