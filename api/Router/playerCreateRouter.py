from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from bson import ObjectId
from yensiDatetime.yensiDatetime import formatDateTime
from Models.playerCreateModel import PlayerCreate, PlayerUpdate, PlayerResponse
from Database.playerCreateDb import insertPlayerToDb, getPlayerFromDb, getAllPlayersFromDb, updatePlayerInDb, deletePlayerFromDb
from Utils.utils import returnResponse
from yensiAuthentication import logger

router = APIRouter(tags=["Players"])


@router.post("/players")
async def createPlayer(player: PlayerCreate):
    try:
        playerData = player.model_dump()
        playerData["id"] = str(ObjectId)
        playerData["createdAt"] = formatDateTime()
        result = insertPlayerToDb(playerData)
        result.pop("_id", None)
        logger.info("player created successfully")
        return returnResponse(23, result=result)
    except Exception as e:
        logger.error(f"error occured while creating player , error:{str(e)}")
        return returnResponse(24)


@router.get("/players")
async def getAllPlayers():
    try:
        players = List(getAllPlayersFromDb({}))
        logger.info("players fetched successfully")
        return returnResponse(25, result=players)
    except Exception as e:
        logger.error(f"error occured while fetching players:error:{e}")
        return returnResponse(26)


@router.get("/player/{playerId}")
async def getSinglePlayer(playerId: str):
    try:
        player = getPlayerFromDb({"id": playerId})
        if not player:
            logger.warning(f"Player not found with ID: {playerId}")
            return returnResponse(27)
        player.pop("_id", None)
        logger.info(f"Player fetched successfully: {playerId}")
        return returnResponse(28, result=player)
    except Exception as e:
        logger.error(f"Error occurred while fetching player with ID {playerId}: {e}")
        return returnResponse(29)


@router.put("/players/{playerId}")
async def updatePlayer(playerId: str, updates: PlayerUpdate):
    try:
        logger.info("update player function called")
        updateData = updates.model_dump()
        updateData["updatedAt"] = formatDateTime()
        if not updateData:
            return returnResponse(31)
        result = updatePlayerInDb({"id": playerId}, updateData)
        if result.modified_count == 0:
            logger.warning(f"player not updated or not found:Id:{playerId}")
            return returnResponse(32)
        logger.info(f"player updated successfully")
        return returnResponse(30)
    except Exception as e:
        logger.error(f"Error updating player {playerId}: {str(e)}", exc_info=True)
        return returnResponse(34)


@router.delete("/players/{playerId}")
async def deletePlayer(playerId: str):
    try:
        logger.info(f"Attempting to delete player with ID: {playerId}")

        result = deletePlayerFromDb({"id": playerId})
        if result.deleted_count == 0:
            logger.warning(f"Player not found or already deleted: {playerId}")
            return returnResponse(36)  # Player not deleted

        logger.info(f"Player deleted successfully: {playerId}")
        return returnResponse(35)  # Player deleted

    except Exception as e:
        logger.error(f"Error deleting player {playerId}: {str(e)}", exc_info=True)
        return returnResponse(37)  # Error occurred
