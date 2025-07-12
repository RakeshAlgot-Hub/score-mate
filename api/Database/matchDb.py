from Database.mongoData import matchesCollection,ballsCollection
def insertMatchToDb(matchData: dict):
    return matchesCollection.insert_one(matchData)

def getMatchFromDb(query: dict):
    return matchesCollection.find_one(query, {"_id": 0})

def getAllMatchesFromDb(query: dict = {}):
    return matchesCollection.find(query, {"_id": 0})

def updateMatchInDb(query: dict, updateData: dict):
    return matchesCollection.update_one(query, {"$set": updateData})

def deleteMatchFromDb(query: dict):
    return matchesCollection.delete_one(query)


def insertBallEventToDb(event: dict):
    return ballsCollection.insert_one(event)
def getBallEventsByMatch(matchId: str):
    return list(ballsCollection.find({"matchId": matchId}, {"_id": 0}))