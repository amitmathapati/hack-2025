from livekit.agents import JobContext, WorkerOptions, cli
from livekit.plugins.openai.realtime import RealtimeModel
from livekit.agents.multimodal import MultimodalAgent
import logging
import os

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def entrypoint(ctx: JobContext):
    try:
        logger.info("Connecting to LiveKit server...")
        await ctx.connect()
        logger.info("Connected to LiveKit server.")

        agent = MultimodalAgent(
            model=RealtimeModel(
                instructions="You are a helpful assistant.",
                voice="alloy",
                temperature=0.7,
                modalities=["text", "audio"],
                api_key="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"
            )
        )
        logger.info("MultimodalAgent initialized.")

        agent.start(ctx.room)
        logger.info("Agent started in the room.")
    except Exception as e:
        logger.error(f"Error in entrypoint: {e}")
        return

if __name__ == "__main__":
    try:
        logger.info("Starting the application...")
        cli.run_app(
            WorkerOptions(
                entrypoint_fnc=entrypoint,
                ws_url="wss://foobar-1-5i619deo.livekit.cloud",
                api_key="API4cdcBLemXMvZ",
                api_secret="f9ipJ7cG9xeQTRGhD4Cw2JYcfMKwzyyUlYGZmtu9QIbA"
            )
        )
        # cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
        logger.info("Application started.")
    except Exception as e:
        logger.error(f"Error in main: {e}")