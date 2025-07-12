from pymongo import MongoClient
from constants import mongoUrl,mongoDatabase,mongoMatchesCollection,mongoPlayersCollection,mongoscoreboardsCollection,mongoballsCollection
client = MongoClient(mongoUrl)
db = client[mongoDatabase]
matchesCollection = db[mongoMatchesCollection]
playersCollection = db[mongoPlayersCollection]
scoreboardsCollection = db[mongoscoreboardsCollection]
ballsCollection = db[mongoballsCollection]
