import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useMatchStore, handleApiError } from '../store/matchStore';
import { getScoreboard } from '../services/scoreService';
import { ROUTES } from '../constants/appConstants';
import { formatOvers, calculateStrikeRate } from '../utils/formatters';

const ScoreboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentMatch, updateScoreboard, setLoading, setError, isLoading } = useMatchStore();

  useEffect(() => {
    if (currentMatch) {
      loadScoreboard();
    }
  }, [currentMatch]);

  const loadScoreboard = async () => {
    if (!currentMatch?.id) return;
    
    setLoading(true);
    try {
      const response = await getScoreboard(currentMatch.id);
      updateScoreboard(response.result);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const scoreboard = currentMatch?.scoreboard;

  if (!scoreboard) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <Card>
          <p className="text-center text-gray-600">Loading scoreboard...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      {/* Match Summary */}
      <Card>
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {scoreboard.hostTeam} vs {scoreboard.visitorTeam}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {scoreboard.battingTeam} batting
          </p>

          <div className="bg-primary-50 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-primary-600 mb-2">
              {scoreboard.battingTeam}
            </h3>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {scoreboard.score}-{scoreboard.wickets} ({formatOvers(scoreboard.balls)})
            </div>
            {scoreboard.target && (
              <p className="text-sm text-gray-600">
                Target: {scoreboard.target} | Need {scoreboard.target - scoreboard.score} runs
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Batting Statistics */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Batsmen</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium text-gray-700">Name</th>
                <th className="text-center py-2 font-medium text-gray-700">R</th>
                <th className="text-center py-2 font-medium text-gray-700">B</th>
                <th className="text-center py-2 font-medium text-gray-700">4s</th>
                <th className="text-center py-2 font-medium text-gray-700">6s</th>
                <th className="text-center py-2 font-medium text-gray-700">SR</th>
              </tr>
            </thead>
            <tbody>
              {scoreboard.allBatsmen.map((batsman, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2">
                    <div>
                      <span className="font-medium">
                        {batsman.name}
                        {scoreboard.currentBatsmen.some(cb => cb.name === batsman.name) && (
                          <span className="text-primary-600 ml-1">*</span>
                        )}
                      </span>
                      {batsman.isOut && (
                        <div className="text-xs text-gray-500">{batsman.dismissal}</div>
                      )}
                      {!batsman.isOut && !scoreboard.currentBatsmen.some(cb => cb.name === batsman.name) && (
                        <div className="text-xs text-gray-500">not out</div>
                      )}
                    </div>
                  </td>
                  <td className="text-center py-2">{batsman.runs}</td>
                  <td className="text-center py-2">{batsman.balls}</td>
                  <td className="text-center py-2">{batsman.fours}</td>
                  <td className="text-center py-2">{batsman.sixes}</td>
                  <td className="text-center py-2">
                    {calculateStrikeRate(batsman.runs, batsman.balls).toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Extras */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Extras</span>
            <span className="text-sm text-gray-600">
              {scoreboard.extras.total} (b {scoreboard.extras.byes}, lb {scoreboard.extras.legByes},
              w {scoreboard.extras.wides}, nb {scoreboard.extras.noBalls}, p {scoreboard.extras.penalties})
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-gray-900">
              {scoreboard.score}-{scoreboard.wickets} ({formatOvers(scoreboard.balls)})
            </span>
          </div>
        </div>
      </Card>

      {/* Bowling Statistics */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bowlers</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium text-gray-700">Name</th>
                <th className="text-center py-2 font-medium text-gray-700">O</th>
                <th className="text-center py-2 font-medium text-gray-700">M</th>
                <th className="text-center py-2 font-medium text-gray-700">R</th>
                <th className="text-center py-2 font-medium text-gray-700">W</th>
                <th className="text-center py-2 font-medium text-gray-700">ER</th>
              </tr>
            </thead>
            <tbody>
              {scoreboard.allBowlers.map((bowler, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 font-medium">
                    {bowler.name}
                    {bowler.name === scoreboard.currentBowler.name && (
                      <span className="text-primary-600 ml-1">*</span>
                    )}
                  </td>
                  <td className="text-center py-2">{formatOvers(bowler.overs * 6)}</td>
                  <td className="text-center py-2">{bowler.maidens}</td>
                  <td className="text-center py-2">{bowler.runs}</td>
                  <td className="text-center py-2">{bowler.wickets}</td>
                  <td className="text-center py-2">{bowler.economyRate.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Fall of Wickets */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fall of Wickets</h3>

        <div className="space-y-2">
          {scoreboard.fallOfWickets.length > 0 ? (
            scoreboard.fallOfWickets.map((wicket, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700">{wicket.batsman}</span>
                <span className="text-gray-600">
                  {wicket.runs}/{wicket.wicket} ({formatOvers(wicket.over * 6)})
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No wickets fallen yet</p>
          )}
        </div>
      </Card>

      {/* Ball History */}
      {scoreboard.ballHistory && scoreboard.ballHistory.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Balls</h3>
          <div className="space-y-1 text-sm text-gray-700 max-h-40 overflow-y-auto">
            {scoreboard.ballHistory.slice(-10).map((ball, index) => (
              <div key={index} className="flex justify-between">
                <span>
                  {ball.ballType.toUpperCase()}
                  {ball.isWicket && ` - Wicket (${ball.wicketType})`}
                  {ball.commentary && ` - ${ball.commentary}`}
                </span>
                <span className="text-gray-500">Runs: {ball.runs}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          variant="outline"
          icon={ArrowLeft}
          className="flex-1"
          onClick={() => navigate(ROUTES.SCORING)}
        >
          Back to Scoring
        </Button>
        <Button
          variant="secondary"
          icon={Share}
          className="flex-1"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${scoreboard.hostTeam} vs ${scoreboard.visitorTeam}`,
                text: `Current Score: ${scoreboard.score}/${scoreboard.wickets} (${formatOvers(scoreboard.balls)})`,
              });
            } else {
              // Fallback for browsers that don't support Web Share API
              console.log('Share functionality not available');
            }
          }}
        >
          Share
        </Button>
      </div>
    </div>
  );
};

export default ScoreboardPage;