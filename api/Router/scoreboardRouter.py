# Routers/scoreboardRouter.py
from bson import ObjectId
from fastapi import APIRouter
from Models.scoreboardModel import Scoreboard
from Database.scoreboardDb import insertScoreboardToDb, getScoreboardFromDb, updateScoreboardInDb
from Utils.utils import returnResponse
from yensiAuthentication import logger
from yensiDatetime.yensiDatetime import formatDateTime

router = APIRouter(tags=["Scoreboard"])


@router.post("/scoreboards")
async def createScoreboard(scoreboard: Scoreboard):
    try:
        data = scoreboard.model_dump()
        data["id"] = str(ObjectId())
        data["lastUpdated"] = formatDateTime()
        insertScoreboardToDb(data)
        data.pop("_id", None)
        logger.info(f"Scoreboard created for match: {data['matchId']}")
        return returnResponse(41, result=data)
    except Exception as e:
        logger.error(f"Error while Creating scoreboard: {e}", exc_info=True)
        return returnResponse(42)


@router.get("/matches/{matchId}/scoreboard")
async def getScoreboard(matchId: str):
    try:
        scoreboard = getScoreboardFromDb({"matchId": matchId})
        if not scoreboard:
            logger.warning(f"Scoreboard not found for match: {matchId}")
            return returnResponse(43)
        scoreboard.pop("_id", None)
        return returnResponse(44, result=scoreboard)
    except Exception as e:
        logger.error(f"Error fetching scoreboard for match {matchId}: {e}", exc_info=True)
        return returnResponse(45)


@router.put("/scoreboard/{matchId}")
async def updateScoreboard(matchId: str, updatedData: Scoreboard):
    try:
        updateDict = updatedData.model_dump()
        updateDict["lastUpdated"] = formatDateTime()

        existing = getScoreboardFromDb({"matchId": matchId})
        if not existing:
            logger.warning(f"⚠️ Scoreboard not found for update: {matchId}")
            return returnResponse(46)

        # Merge ballHistory if present
        existingHistory = existing.get("ballHistory", [])
        newHistory = updateDict.get("ballHistory", [])

        if newHistory:
            updateDict["ballHistory"] = existingHistory + newHistory
        else:
            updateDict["ballHistory"] = existingHistory  # retain existing if no new data

        result = updateScoreboardInDb({"matchId": matchId}, updateDict)

        if result.modified_count == 0:
            logger.warning(f"⚠️ No scoreboard updated for match: {matchId}")
            return returnResponse(46)

        logger.info(f"✅ Scoreboard updated for match: {matchId}")
        return returnResponse(47)

    except Exception as e:
        logger.error(f"❌ Error occurred while updating scoreboard: {e}", exc_info=True)
        return returnResponse(48)
