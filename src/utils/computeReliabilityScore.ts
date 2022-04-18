export const maxDelayForAGoodJourney = 1000 * 60 * 5; //in milliseconds

const computeReliabilityScore = (journeys: any) => {
  const NumOfGoodJourneys = journeys.filter((journey: any) => {
    if (journey.isCanceled === true) {
      return false;
    }
    return journey.delay <= maxDelayForAGoodJourney;
  }).length;
  return NumOfGoodJourneys / journeys.length;
};

export default computeReliabilityScore;
