from fastapi import APIRouter
from Models.ballModel import BallEvent
from yensiAuthentication import logger
from yensiDatetime.yensiDatetime import formatDateTime
from Utils.utils import returnResponse
from Database.matchDb import *

router = APIRouter(tags=["ball"])


@router.post("/matches/{matchId}/ball")
async def recordBall(matchId: str, ballData: BallEvent):
    try:
        logger.info(f"Recording ball event for match: {matchId}")
        match = getMatchFromDb({"id": matchId})
        if not match:
            logger.warning(f"Match not found: {matchId}")
            return returnResponse(55)

        innings = match.get("currentInnings", 1)
        over = match.get("currentOvers", 0)
        ball = match.get("currentBalls", 0)

        eventDict = ballData.model_dump()
        eventDict.update({"matchId": matchId, "innings": innings, "over": over, "ball": ball, "timestamp": formatDateTime()})

        insertBallEventToDb(eventDict)
        eventDict.pop("_id", None)

        logger.info(f"Ball event recorded for match {matchId}: {eventDict}")
        return returnResponse(56, result=eventDict)

    except Exception as e:
        logger.error(f"Error recording ball event for match {matchId}: {e}", exc_info=True)
        return returnResponse(57)


@router.get("/matches/{matchId}/ball")
async def getBalls(matchId: str):
    try:
        logger.info(f"Fetching all balls for match: {matchId}")
        balls = getBallEventsByMatch(matchId)
        return returnResponse(58, result=balls)
    except Exception as e:
        logger.error(f"Error fetching balls for match {matchId}: {e}", exc_info=True)
        return returnResponse(59)
