from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli, llm
from livekit.plugins.openai.realtime import RealtimeModel
from livekit.agents.multimodal import MultimodalAgent
from livekit.agents.pipeline import VoicePipelineAgent, AgentTranscriptionOptions
from livekit.plugins import deepgram
from livekit.plugins import openai
from livekit.plugins import silero
from llama_index.core import (
    SimpleDirectoryReader,
    StorageContext,
    VectorStoreIndex,
    load_index_from_storage,
)
from livekit import rtc
from llama_index.core.chat_engine.types import ChatMode
import wave
import json

import logging
import os
# from dotenv import load_dotenv
import asyncio

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")

logger.info("#############################")
logger.info(f"OPENAI_API_KEY {OPENAI_API_KEY}")
logger.info("#############################")
logger.info(f"DEEPGRAM_API_KEY {DEEPGRAM_API_KEY}")

# logger.info(f"Received message: {job_description[0]}")
# check if storage already exists
PERSIST_DIR = "./jobDetails"
if not os.path.exists(PERSIST_DIR):
    # load the documents and create the index
    documents = SimpleDirectoryReader("data").load_data()
    index = VectorStoreIndex.from_documents(documents)
    # store it for later
    index.storage_context.persist(persist_dir=PERSIST_DIR)
else:
    # load the existing index
    storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
    index = load_index_from_storage(storage_context)


async def entrypoint(ctx: JobContext):
    #https://github.com/livekit/agents/blob/ab90fd242f9336c31986955ac51ca2bca8a6771d/examples/voice-pipeline-agent/llamaindex-rag/query_engine.py#L58
    initial_ctx = llm.ChatContext().append(
        role="system",
        text=(
            "Just ask two questions: What is the name and where are you from? And end the conversation."
            # "You are a HR recruiter Voice assistant at Career fair representing your company in a booth. Your interface with users will be voice. "
            # "You are a HR recruiter at Career fair representing your company in a booth. You will be asked details about Job description by the candidate but be brief. "
            # "You have to help answer questions about the job details and then perform a screening requirement based on the job posting but be brief. "
            # "Maintain the details and ask follow up questions. All of these will be transcripted and recorded and ask for permission before that."
            # "Ask for the name to save the transcript."
            # "You can search LinkedIn profile of the candidate to get more information using function context."
            # "You should use short and concise responses, and avoiding usage of unpronouncable punctuation."
        ),
    )
    chat_engine = index.as_chat_engine(chat_mode=ChatMode.CONTEXT)
    
    try:
        logger.info("Connecting to LiveKit server...")
        await ctx.connect()
        logger.info("#############################")
        logger.info("Connected to LiveKit server.")
        
        fnc_ctx = llm.FunctionContext()

        @fnc_ctx.ai_callable(description="Get more information about a Job Description")
        async def query_info(query: str) -> str:
            query_engine = index.as_query_engine(use_async=True)
            res = await query_engine.aquery(query)
            print("Query result:", res)
            return str(res)
        
        # Placeholder for candidate's name
        candidate_name = [None]
        
        room = ctx.room
        
        # Function to save audio
        # def save_audio(audio_data, filename):
        #     with wave.open(filename, 'wb') as wf:
        #         wf.setnchannels(1)  # Mono
        #         wf.setsampwidth(2)  # Sample width in bytes
        #         wf.setframerate(16000)  # Frame rate
        #         wf.writeframes(audio_data)
        wf = wave.open("local_audio.wav", 'wb')
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(16000)
                
        # Function to save transcription
        # def save_transcription(text, filename):
        #     with open(filename, 'w') as f:
        #         f.write(text)
        with open("local_transcription.json", 'w') as f:
            json.dump([], f)
            
        
        
        # Wait for the custom message with the job description
        # job_description = [None]
        
        # @ctx.room.on("data_received")
        # def on_data_received(data_packet):
        #     job_description[0] = data_packet.payload.decode('utf-8')
        #     logger.info(f"Received message: {job_description[0]}")
            
            # Process the message, e.g., send it to OpenAI
        # async for message in ctx.room.message_events():
        #     if "jobDescription" in message.data:
        #         job_description = message.data["jobDescription"]
        #         logger.info("Job Description received.", job_description)
        #         break
            
        # if not job_description[0]:
        #     logger.warning("No job description received. Using default instructions.")
        #     job_description = "Default job description."
            
        # logger.info("Waiting for participant to join.")
        participant = await ctx.wait_for_participant()
        
        # Wait until job_description is received
        # while job_description[0] is None:
        #     await asyncio.sleep(0.1)


        #https://docs.livekit.io/agents-js/classes/agents.multimodal.MultimodalAgent.html
        #https://docs.livekit.io/agents-js/classes/agents.llm.ChatContext.html
        # agent = MultimodalAgent(
        #     model=RealtimeModel(
        #         instructions=f"You are a HR recruiter at Career fair representing your company in a booth. Introduce yourself. You will be asked details about Job description by the candidate. You have to help answer questions about the job details and then perform a screening requirement based on the job posting but be brief. Maintain the details and ask follow up questions. All of these will be transcripted and recorded and ask for permission before that.",
        #         voice="alloy",
        #         temperature=0.7,
        #         modalities=["text", "audio"],
        #         # maxResponseOutputTokens=100,
        #         api_key="API_KEY"
        #     )
        # )
        agent = VoicePipelineAgent(
            vad=silero.VAD.load(),
            stt=deepgram.STT(),
            llm=openai.LLM(),
            tts=openai.TTS(),
            chat_ctx=initial_ctx,
            fnc_ctx=fnc_ctx,
            transcription=AgentTranscriptionOptions(user_transcription=True, agent_transcription=True)
        )
        logger.info("#############################")
        logger.info("MultimodalAgent initialized.")
        
        @agent.on("user_speech_committed")
        def on_user_speech_committed(msg: llm.ChatMessage):
            logger.info("#############################")
            logger.info("user_speech_committed")
            # Save the audio data to the wave file
            # Assuming audio data is available in the message
            # audio_data = msg.audio_data  
            # wf.writeframes(audio_data)

            # Save the transcription to the JSON file
            with open("local_transcription.json", 'r+') as f:
                data = json.load(f)
                data.append({"user": msg.content})
                logger.info("#############################")
                logger.info(f"user: {msg.content}")
                f.seek(0)
                json.dump(data, f)

        @agent.on("agent_speech_committed")
        def on_agent_speech_committed(msg: llm.ChatMessage):
            logger.info("#############################")
            logger.info("agent_speech_committed")
            # Save the agent's audio data to the wave file
            # audio_data = msg.audio_data
            # wf.writeframes(audio_data)

            # Save the agent's transcription to the JSON file
            with open("local_transcription.json", 'r+') as f:
                data = json.load(f)
                data.append({"agent": msg.content})
                logger.info("#############################")
                logger.info(f"agent: {msg.content}")
                f.seek(0)
                json.dump(data, f)
        
        # @agent.on("user_speech_committed")
        # @agent.on("agent_speech_committed")
        # def on_transcription_received(transcription):
        #     # Example: Extract candidate's name from transcription
        #     logger.info("#############################")
        #     logger.info("transcription_received")
        #     if "My name is" in transcription:
        #         candidate_name[0] = transcription.split("My name is")[-1].strip().split()[0]
        #         # print(f"Candidate's name: {candidate_name[0]}")
        #         logger.info("#############################")
        #         logger.info(f"Candidate's name: {candidate_name[0]}")

        #     # Save transcription with candidate's name
        #     if candidate_name[0]:
        #         logger.info("#############################")
        #         logger.info(f"Candidate's name: {candidate_name[0]}")
        #         save_transcription(transcription, f"{candidate_name[0]}_transcription.txt")

        # @agent.on("audio_received")
        # def on_audio_received(audio_data):
        #     # Save audio with candidate's name
        #     logger.info("#############################")
        #     logger.info("audio_received")
        #     if candidate_name[0]:
        #         save_audio(audio_data, f"{candidate_name[0]}_audio.wav")
        
        

        # agent.start(ctx.room, participant)
        agent.start(room, participant)
        # agent.start(ctx.room)
        logger.info("Agent started in the room.")
        await agent.say("Hey, welcome to our page. My name is Jonathan. How can I help you today?", allow_interruptions=True)
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