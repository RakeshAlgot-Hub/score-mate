from Database.mongoData import playersCollection
from typing import Dict, Any

def insertPlayerToDb(playerData):
    return playersCollection.insert_one(playerData)

def getPlayerFromDb(query):
    return playersCollection.find_one(query)

def getAllPlayersFromDb(query):
    return playersCollection.find(query)

def updatePlayerInDb(query: Dict[str, Any], updateData: Dict[str, Any]):
    return playersCollection.update_one(query, {"$set": updateData})

def deletePlayerFromDb(query: Dict[str, Any]):
    return playersCollection.delete_one(query)
