const computeAverageDelay = (journeys: any): number => {
  return Number(
    (
      journeys.reduce((sum: number, journey: any) => {
        return sum + journey.delay;
      }, 0) /
      journeys.length /
      (1000 * 60)
    ).toFixed(2)
  );
};

export default computeAverageDelay;
