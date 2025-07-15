/**
 * Backend stores overs as decimal (1.2), so we can use it directly
 */
export const formatOvers = (overs: number): string => {
  return overs.toString();
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
  // Handle backend timestamp format (20250715141135969)
  if (dateString.length === 17) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    const hour = dateString.substring(8, 10);
    const minute = dateString.substring(10, 12);
    const second = dateString.substring(12, 14);
    
    const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  // Fallback for ISO format
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