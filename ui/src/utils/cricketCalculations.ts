export const calculateStrikeRate = (runs: number, balls: number): number => {
  if (balls === 0) return 0;
  return (runs / balls) * 100;
};

export const calculateEconomyRate = (runs: number, overs: number): number => {
  if (overs === 0) return 0;
  return runs / overs;
};

export const formatOvers = (totalBalls: number): string => {
  const completeOvers = Math.floor(totalBalls / 6);
  const remainingBalls = totalBalls % 6;
  return remainingBalls === 0 ? `${completeOvers}` : `${completeOvers}.${remainingBalls}`;
};

export const getOversFromBalls = (balls: number): number => {
  const completeOvers = Math.floor(balls / 6);
  const remainingBalls = balls % 6;
  return completeOvers + (remainingBalls / 10);
};

export const getRequiredRunRate = (
  target: number,
  currentScore: number,
  remainingBalls: number
): number => {
  const runsNeeded = target - currentScore;
  const remainingOvers = remainingBalls / 6;
  return remainingOvers > 0 ? runsNeeded / remainingOvers : 0;
};

export const getCurrentRunRate = (runs: number, balls: number): number => {
  const overs = getOversFromBalls(balls);
  return overs > 0 ? runs / overs : 0;
};