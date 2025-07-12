from fastapi import FastAPI
from yensiAuthentication import logger
from Router import generalRouter, matchRouter, playerCreateRouter, scoreboardRouter, ballRouter
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

# Start the FastAPI application
logger.info("FastAPI application starting...")


# Create FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include authentication router
app.include_router(generalRouter.router)
app.include_router(matchRouter.router)
app.include_router(playerCreateRouter.router)
app.include_router(scoreboardRouter.router)
app.include_router(ballRouter.router)

# run the FastAPI application
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
