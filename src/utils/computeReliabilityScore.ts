const computeReliabilityScore = (
  journeys: any,
  toleratedDelayMinutes: number
) => {
  const NumOfGoodJourneys = journeys.filter((journey: any) => {
    if (journey.isCanceled === true) {
      return false;
    }
    return journey.delay <= toleratedDelayMinutes * 60 * 1000;
  }).length;
  return NumOfGoodJourneys / journeys.length;
};

export default computeReliabilityScore;
