from bson import ObjectId
from Models.scoreboardModel import BatsmanStats, BowlerStats, Extras, Scoreboard
from Database.scoreboardDb import insertScoreboardToDb
from yensiAuthentication import logger
from Models.ballModel import BallEvent
from yensiDatetime.yensiDatetime import formatDateTime

def initializeScoreboardFromMatch(match: dict) -> dict:
    try:
        # Extract opening players
        opening = match.get("openingPlayers", {})
        striker = opening.get("striker")
        non_striker = opening.get("nonStriker")
        bowler = opening.get("bowler")

        # Prepare batsmen and bowler stats
        strikerStats = BatsmanStats(name=striker, runs=0, balls=0, fours=0, sixes=0, strikeRate=0.0, isOut=False)
        nonStrikerStats = BatsmanStats(name=non_striker, runs=0, balls=0, fours=0, sixes=0, strikeRate=0.0, isOut=False)
        bowlerStats = BowlerStats(name=bowler, overs=0.0, maidens=0, runs=0, wickets=0, economyRate=0.0)

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
            target=match.get("target", 0),
            currentBatsmen=[strikerStats, nonStrikerStats],
            currentBowler=bowlerStats,
            allBatsmen=[strikerStats, nonStrikerStats],
            allBowlers=[bowlerStats],
            ballHistory=[],
            extras=Extras(),
            fallOfWickets=[],
            isComplete=False,
            result=None,
        ).model_dump()

        scoreboard["id"] = str(ObjectId())
        scoreboard["lastUpdated"] = formatDateTime()
        insertScoreboardToDb(scoreboard)
        scoreboard.pop("_id", None)

        logger.info(f"Scoreboard initialized for match: {match['id']}")
        return scoreboard

    except Exception as e:
        logger.error(f"Failed to initialize scoreboard: {e}", exc_info=True)
        return None


def updateScoreboardWithBall(scoreboard: dict, ball: BallEvent) -> dict:
    score = scoreboard.get("score", 0)
    wickets = scoreboard.get("wickets", 0)
    overs = scoreboard.get("overs", 0)
    balls = scoreboard.get("balls", 0)
    extras = scoreboard.get("extras", {
        "byes": 0, "legByes": 0, "wides": 0, "noBalls": 0, "penalties": 0, "total": 0
    })
    batsmen = scoreboard.get("currentBatsmen", [])
    bowler = scoreboard.get("currentBowler", {
        "name": ball.bowler, "overs": 0.0, "maidens": 0, "runs": 0, "wickets": 0, "economyRate": 0.0
    })

    def swap_strikers():
        if len(batsmen) >= 2:
            batsmen[0], batsmen[1] = batsmen[1], batsmen[0]

    legal_delivery = ball.ballType in ["normal", "bye", "legBye", "wicket"]

    if ball.ballType == "normal":
        score += ball.runs
        updateBatsmanStats(batsmen, ball.batsman, ball.runs)
        bowler["runs"] += ball.runs
        if ball.runs % 2 == 1:
            swap_strikers()

    elif ball.ballType == "wide":
        extras["wides"] += 1
        extras["total"] += 1
        score += 1
        bowler["runs"] += 1

    elif ball.ballType == "noBall":
        extras["noBalls"] += 1
        extras["total"] += 1
        score += 1
        bowler["runs"] += 1
        if ball.runs > 0:
            score += ball.runs
            updateBatsmanStats(batsmen, ball.batsman, ball.runs)
            bowler["runs"] += ball.runs
            if ball.runs % 2 == 1:
                swap_strikers()

    elif ball.ballType == "bye":
        extras["byes"] += ball.runs
        extras["total"] += ball.runs
        score += ball.runs
        if ball.runs % 2 == 1:
            swap_strikers()

    elif ball.ballType == "legBye":
        extras["legByes"] += ball.runs
        extras["total"] += ball.runs
        score += ball.runs
        if ball.runs % 2 == 1:
            swap_strikers()

    if ball.isWicket:
        wickets += 1
        markBatsmanOut(batsmen, ball.batsman, ball.wicketType)
        scoreboard.setdefault("fallOfWickets", []).append({
            "wicket": wickets,
            "runs": score,
            "over": overs + (balls / 6),
            "batsman": ball.batsman
        })
        if ball.newBatsman:
            batsmen[0] = {
                "name": ball.newBatsman,
                "runs": 0,
                "balls": 0,
                "fours": 0,
                "sixes": 0,
                "strikeRate": 0.0,
                "isOut": False
            }
        bowler["wickets"] += 1

    if legal_delivery:
        balls += 1
        bowler["overs"] = round(bowler.get("overs", 0) + (1 / 6), 1)
        if balls == 6:
            balls = 0
            overs += 1
            swap_strikers()

    # Update economy rate
    total_balls_bowled = int(bowler["overs"] * 10)  # overs like 1.2 means 1 over and 2 balls = 8 balls
    overs_float = (total_balls_bowled // 10) + (total_balls_bowled % 10) / 6
    bowler["economyRate"] = round(bowler["runs"] / overs_float, 2) if overs_float > 0 else 0.0

    scoreboard["score"] = score
    scoreboard["wickets"] = wickets
    scoreboard["overs"] = overs
    scoreboard["balls"] = balls
    scoreboard["extras"] = extras
    scoreboard["currentBatsmen"] = batsmen
    scoreboard["currentBowler"] = bowler
    return scoreboard

def updateBatsmanStats(batsmen: list, name: str, runs: int):
    for b in batsmen:
        if b.get("name") == name:
            b["runs"] = b.get("runs", 0) + runs
            b["balls"] = b.get("balls", 0) + 1
            if runs == 4:
                b["fours"] = b.get("fours", 0) + 1
            elif runs == 6:
                b["sixes"] = b.get("sixes", 0) + 1
            b["strikeRate"] = round((b["runs"] / b["balls"]) * 100, 2)
            break

def markBatsmanOut(batsmen: list, name: str, dismissal: str):
    for b in batsmen:
        if b.get("name") == name:
            b["isOut"] = True
            b["dismissal"] = dismissal
            break
