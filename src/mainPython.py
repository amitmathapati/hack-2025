from fastapi import FastAPI, Query, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# from livekit.agents import JobContext, WorkerOptions, cli
from livekit.agents import (
    AutoSubscribe,
    JobContext,
    WorkerOptions,
    WorkerType,
    cli,
    llm,
)
from livekit.plugins.openai.realtime import RealtimeModel
from livekit.plugins import openai
from livekit.agents.multimodal import MultimodalAgent

import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/voiceChat")
async def entrypoint(ctx: JobContext):
    await ctx.connect()
    agent = MultimodalAgent(
        model=RealtimeModel(
            instructions="You are a helpful assistant.",
            voice="alloy",
            temperature=0.7,
            modalities=["text", "audio"],
            api_key="YOUR_OPENAI_API_KEY"  # Replace with your OpenAI API key
        )
    )
    agent.start(ctx.room)