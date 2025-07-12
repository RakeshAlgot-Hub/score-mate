from fastapi import APIRouter
from pymongo import MongoClient
import requests
from constants import mongoUrl
from yensiAuthentication.yensiConfig import logger

router = APIRouter()

mongoClient = MongoClient(mongoUrl)

@router.get("/health")
async def healthCheck():
    """
    Health check endpoint to verify MongoDB and Keycloak connectivity.
    """
    health_status = {"status": "OK", "mongodb": "Unknown"}

    try:
        logger.debug("Starting health check process.")

        # MongoDB Health Check
        try:
            mongoClient = MongoClient(mongoUrl, serverSelectionTimeoutMS=3000)
            mongoClient.admin.command("ping")
            health_status["mongodb"] = "Connected"
            logger.info("MongoDB is reachable.")
        except Exception as e:
            health_status["mongodb"] = "Not Connected"
            logger.error(f"MongoDB connection failed: {str(e)}")

        # Overall Status
        if "Not Connected" in health_status.values() or "Not Authenticated" in health_status.values():
            health_status["status"] = "Degraded"

        logger.info(f"Health check result: {health_status}")
        return health_status

    except Exception as e:
        logger.critical(f"Unexpected health check failure: {str(e)}", exc_info=True)
        return {"status": "Critical", "mongodb": "Unknown", "keycloak": "Unknown"}