from fastapi import APIRouter
from Models.matchModel import *
from Models.ballModel import BallEvent
from yensiAuthentication import logger
from yensiDatetime.yensiDatetime import formatDateTime
from Utils.utils import returnResponse
from Database.matchDb import *
from bson import ObjectId
from Utils.scoreboardUtils import initializeScoreboardFromMatch

router = APIRouter(tags=["Matches"])


@router.post("/matches")
async def createMatch(match: Match):
    try:
        logger.debug("Creating a new match")
        matchDict = match.model_dump(exclude_unset=True)

        tossWinner = matchDict.get("tossWonBy")  # "host" or "visitor"
        decision = matchDict.get("optedTo")  # "bat" or "bowl"

        hostTeamName = matchDict.get("hostTeam", {}).get("name")
        visitorTeamName = matchDict.get("visitorTeam", {}).get("name")

        # Determine who bats first
        if tossWinner == "host":
            battingTeam = hostTeamName if decision == "bat" else visitorTeamName
            bowlingTeam = visitorTeamName if decision == "bat" else hostTeamName
        else:
            battingTeam = visitorTeamName if decision == "bat" else hostTeamName
            bowlingTeam = hostTeamName if decision == "bat" else visitorTeamName

        # Update matchDict with computed team names
        matchDict.update({"id": str(ObjectId()), "createdAt": formatDateTime(), "lastUpdated": formatDateTime(), "battingTeam": battingTeam, "bowlingTeam": bowlingTeam})

        insertMatchToDb(matchDict)
        matchDict.pop("_id", None)
        logger.info(f"New match created: {matchDict['id']}")
        return returnResponse(10, result=matchDict)

    except Exception as e:
        logger.error(f"Error creating match: {str(e)}", exc_info=True)
        return returnResponse(11)


@router.get("/matches")
async def listMatches():
    try:
        matches = list(getAllMatchesFromDb({}))
        logger.info("Matches fetched successfully")
        return returnResponse(12, result=matches)
    except Exception as e:
        logger.error(f"Error fetching matches: {str(e)}", exc_info=True)
        return returnResponse(13)


@router.get("/matches/{matchId}")
async def getMatch(matchId: str):
    try:
        match = getMatchFromDb({"id": matchId})
        if not match:
            logger.warning(f" Match not found: {matchId}")
            return returnResponse(14)
        logger.info(f" Match fetched: {matchId}")
        return returnResponse(15, result=match)
    except Exception as e:
        logger.error(f"Error fetching match {matchId}: {str(e)}", exc_info=True)
        return returnResponse(16)


@router.put("/matches/{matchId}")
async def updateMatch(matchId: str, match: Match):
    try:
        updateData = match.model_dump()
        updateData["lastUpdated"] = formatDateTime()

        result = updateMatchInDb({"id": matchId}, updateData)
        if result.modified_count == 0:
            logger.warning(f"Match not updated: {matchId}")
            return returnResponse(17)
        logger.info(f"Match updated: {matchId}")
        return returnResponse(18)
    except Exception as e:
        logger.error(f" Error updating match {matchId}: {str(e)}", exc_info=True)
        return returnResponse(19)


@router.delete("/matches/{matchId}")
async def deleteMatch(matchId: str):
    try:
        result = deleteMatchFromDb({"id": matchId})
        if result.deleted_count == 0:
            logger.warning(f"Match not found/deleted: {matchId}")
            return returnResponse(20)
        logger.info(f"Match deleted: {matchId}")
        return returnResponse(21)
    except Exception as e:
        logger.error(f"Error deleting match {matchId}: {str(e)}", exc_info=True)
        return returnResponse(22)


# ==========================================


@router.put("/matches/{matchId}/settings")
async def updateMatchSettings(matchId: str, settings: MatchSettings):
    try:
        logger.info(f"Updating settings for match: {matchId}")
        result = updateMatchInDb({"id": matchId}, {"settings": settings.model_dump(), "lastUpdated": formatDateTime()})
        if result.modified_count == 0:
            logger.warning(f"No settings updated. Match may not exist: {matchId}")
            return returnResponse(50)

        logger.info(f"Match settings updated for match: {matchId}")
        return returnResponse(49)

    except Exception as e:
        logger.error(f"Error updating match settings for match {matchId}: {e}", exc_info=True)
        return returnResponse(51)


@router.put("/matches/{matchId}/opening-players")
async def setOpeningPlayers(matchId: str, opening: OpeningPlayers):
    try:
        logger.info(f"Setting opening players for match: {matchId}")
        result = updateMatchInDb({"id": matchId}, {"openingPlayers": opening.model_dump(), "lastUpdated": formatDateTime()})
        if result.modified_count == 0:
            logger.warning(f"No opening players updated. Match may not exist: {matchId}")
            return returnResponse(52)

        match = getMatchFromDb({"id": matchId})
        if not match:
            logger.error(f"Match not found after updating opening players: {matchId}")
            return returnResponse(14)

        scoreboard = initializeScoreboardFromMatch(match)
        if not scoreboard:
            logger.error(f"Failed to create scoreboard for match {matchId}")
            return returnResponse(42)

        logger.info(f"Opening players set successfully for match: {matchId}")
        return returnResponse(53)

    except Exception as e:
        logger.error(f"Error setting opening players for match {matchId}: {e}", exc_info=True)
        return returnResponse(54)
