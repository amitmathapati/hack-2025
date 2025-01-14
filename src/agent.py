from livekit.agents import JobContext, WorkerOptions, cli
from livekit.plugins.openai.realtime import RealtimeModel
from livekit.agents.multimodal import MultimodalAgent
import logging

import os

# LIVEKIT_API_KEY = os.getenv('LIVEKIT_API_KEY')
# LIVEKIT_API_SECRET = os.getenv('LIVEKIT_API_SECRET')
# LIVEKIT_SERVER_URL = os.getenv('LIVEKIT_SERVER_URL')
OPENAI_API_KEY=os.getenv('OPENAI_API_KEY')



# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def entrypoint(ctx: JobContext):
    logger.info("Connecting to LiveKit server")
    logger.info(f"Server URL: {LIVEKIT_SERVER_URL}")
    # await ctx.connect()
    await ctx.connect(
        server_url="ws://localhost:7880",
        api_key="devkey",
        api_secret="secret"
    )
    # await ctx.connect(server_url=LIVEKIT_SERVER_URL, api_key=LIVEKIT_API_KEY, api_secret=LIVEKIT_API_SECRET)
    agent = MultimodalAgent(
        model=RealtimeModel(
            instructions="You are a helpful assistant.",
            voice="alloy",
            temperature=0.7,
            modalities=["text", "audio"],
            # Replace with your OpenAI API key
            api_key="OPENAI_API_KEY"  
        )
    )
    agent.start(ctx.room)

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
