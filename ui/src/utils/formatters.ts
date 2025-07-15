/**
 * Formats balls into overs display (e.g., 125 balls -> "20.5")
 */
export const formatOvers = (balls: number): string => {
  const overs = Math.floor(balls / 6);
  const remainingBalls = balls % 6;
  return remainingBalls === 0 ? `${overs}` : `${overs}.${remainingBalls}`;
};

/**
 * Calculates strike rate
 */
export const calculateStrikeRate = (runs: number, balls: number): number => {
  return balls > 0 ? (runs / balls) * 100 : 0;
};

/**
 * Calculates economy rate
 */
export const calculateEconomyRate = (runs: number, overs: number): number => {
  return overs > 0 ? runs / overs : 0;
};

/**
 * Formats date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Gets ball display text for over display
 */
export const getBallDisplayText = (ball: any): string => {
  if (ball.isWicket) return 'W';
  if (ball.ballType === 'wide') return 'Wd';
  if (ball.ballType === 'noBall') return 'Nb';
  if (ball.ballType === 'bye') return 'B';
  if (ball.ballType === 'legBye') return 'Lb';
  return ball.runs.toString();
};

/**
 * Gets ball color for over display
 */
export const getBallColor = (ball: any): string => {
  if (ball.isWicket) return 'bg-red-500 text-white';
  if (ball.runs === 6) return 'bg-green-500 text-white';
  if (ball.runs === 4) return 'bg-blue-500 text-white';
  if (['wide', 'noBall', 'bye', 'legBye'].includes(ball.ballType)) return 'bg-yellow-500 text-black';
  return 'bg-gray-200 text-gray-800';
};