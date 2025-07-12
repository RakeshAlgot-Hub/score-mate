from bson import ObjectId
from Models.scoreboardModel import BatsmanStats, BowlerStats, Extras, Scoreboard
from Database.scoreboardDb import insertScoreboardToDb
from yensiAuthentication import logger


def initializeScoreboardFromMatch(match: dict) -> dict:
    try:
        # Extract opening players
        opening = match.get("openingPlayers", {})
        striker = opening.get("striker")
        non_striker = opening.get("nonStriker")
        bowler = opening.get("bowler")

        scoreboard = Scoreboard(
            matchId=match["id"],
            hostTeam=match["hostTeam"]["name"],
            visitorTeam=match["visitorTeam"]["name"],
            currentInnings=match.get("currentInnings", 1),
            battingTeam=match.get("battingTeam"),
            bowlingTeam=match.get("bowlingTeam"),
            score=0,
            wickets=0,
            overs=0,
            balls=0,
            target=0,
            currentBatsmen=[
                BatsmanStats(name=striker, runs=0, balls=0, fours=0, sixes=0, strikeRate=0.0, isOut=False),
                BatsmanStats(name=non_striker, runs=0, balls=0, fours=0, sixes=0, strikeRate=0.0, isOut=False),
            ],
            currentBowler=BowlerStats(name=bowler, overs=0.0, maidens=0, runs=0, wickets=0, economyRate=0.0),
            allBatsmen=[],
            allBowlers=[],
            extras=Extras(),
            fallOfWickets=[],
            isComplete=False,
            result=None
        ).model_dump()

        scoreboard["id"] = str(ObjectId())
        insertScoreboardToDb(scoreboard)
        scoreboard.pop("_id", None)

        logger.info(f"Scoreboard initialized for match: {match['id']}")
        return scoreboard

    except Exception as e:
        logger.error(f"Failed to initialize scoreboard: {e}", exc_info=True)
        return None
