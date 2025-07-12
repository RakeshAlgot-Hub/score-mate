# Database/scoreboardDb.py

from Database.mongoData import scoreboardsCollection

def getScoreboardFromDb(query: dict):
    return scoreboardsCollection.find_one(query, {"_id": 0})

def updateScoreboardInDb(query: dict, updateData: dict):
    return scoreboardsCollection.update_one(query, {"$set": updateData})

def insertScoreboardToDb(scoreboard: dict):
    return scoreboardsCollection.insert_one(scoreboard)
