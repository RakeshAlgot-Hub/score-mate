import os

mongoUrl = os.getenv("MONGO_DB_URL", "mongodb://localhost:27017/")
mongoDatabase = os.getenv("MONGO_DATABASE_NAME", "ScoreMate")
mongoUserCollection = os.getenv("MONGO_USER_COLLECTION_NAME", "users")
mongoResetPasswordCollection = os.getenv("MONGO_RESET_PASSWORD_COLLECTION_NAME", "passwordReset")
mongoMatchesCollection = os.getenv("MONGO_MATCHES_COLLECTION_NAME", "matchesCollection")
mongoPlayersCollection = os.getenv("MONGO_PLAYERS_COLLECTION_NAME", "playersCollection")
mongoscoreboardsCollection = os.getenv("MONGO_SCOREBOARD_COLLECTION_NAME", "scoreCollection")
mongoballsCollection = os.getenv("MONGO_BALLS_COLLECTION_NAME", "ballsCollection")


