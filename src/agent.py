from livekit.agents import JobContext, WorkerOptions, cli, llm
# from livekit.plugins.openai.realtime import RealtimeModel
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
# import wave
import json
# import callOpenAI

import logging
import os
# from dotenv import load_dotenv
import asyncio

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")
LIVEKIT_SERVER_URL = os.getenv("LIVEKIT_SERVER_URL")

logger.info("############################# START")
# logger.info(f"OPENAI_API_KEY {OPENAI_API_KEY}")
# logger.info("#############################")
# logger.info(f"DEEPGRAM_API_KEY {DEEPGRAM_API_KEY}")

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
            # "Just ask two questions: What is the name and where are you from? And end the conversation."
            # "You are a HR recruiter Voice assistant at Career fair representing your company in a booth. Your interface with users will be voice. "
            "You are a HR recruiter at Career fair. You will be asked details about Job description by the candidate but be brief. "
            "Perform a initial screening requirement based on the job posting but be brief. "
            "All of these will be transcripted and recorded and ask for permission before that."
            "Ask for the name to save the transcript."
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
        
        #https://docs.livekit.io/python/livekit/rtc/room.html#livekit.rtc.room.Room
        # room = ctx.room
        
        # Function to save audio
        # wf = wave.open("local_audio.wav", 'wb')
        # wf.setnchannels(1)
        # wf.setsampwidth(2)
        # wf.setframerate(16000)
                
        # Function to save transcription
        with open("../public/data/Security Detection Engineer - Meta/transcription.json", 'w') as f:
            json.dump([], f)
            
            
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
        #https://docs.livekit.io/python/livekit/agents/pipeline/index.html#livekit.agents.pipeline.VoicePipelineAgent
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
        logger.info("VoicePipelineAgent initialized.")
        
        @agent.on("user_speech_committed")
        def on_user_speech_committed(msg: llm.ChatMessage):
            logger.info("#############################")
            logger.info("user_speech_committed")
            # Save the audio data to the wave file
            # Assuming audio data is available in the message
            # audio_data = msg.audio_data  
            # wf.writeframes(audio_data)

            # Save the transcription to the JSON file
            with open("../public/data/Security Detection Engineer - Meta/transcription.json", 'r+') as f:
                data = json.load(f)
                data.append({"user": msg.content})
                logger.info("#############################")
                logger.info(f"user: {msg.content}")
                # if "name is" in msg.content:
                #     candidate_name[0] = msg.content.split("name is")[1].strip()
                #     logger.info("#############################")
                #     logger.info(f"Candidate's name: {candidate_name[0]}")
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
            with open("../public/data/Security Detection Engineer - Meta/transcription.json", 'r+') as f:
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
        
        

        agent.start(ctx.room, participant)
        # agent.start(room, participant)
        # agent.start(ctx.room)
        logger.info("Agent started in the room.")
        await agent.say("Hey, welcome to our page. My name is Jonathan. How can I help you today?", allow_interruptions=True)
        
        ctx.room.on('disconnected', lambda reason: logger.info(f"############### Disconnected: {reason}"))
        ctx.room.on('error', lambda error: logger.error(f"############### Room error: {error}"))

        # async def my_shutdown_hook():
        #     logger.info("#############################")
        #     logger.info("Shutting down the agent...")
        #     logger.info(f"Candidate's name: {candidate_name[0]}")
        #     agent.aclose()
        #     f.close()
        #     #../public/data/Security Detection Engineer - Meta/
        #     new_folder = f"../public/data/Security Detection Engineer - Meta/{candidate_name[0]}"
        #     os.makedirs(new_folder, exist_ok=True)
        #     new_file_path = os.path.join(new_folder, "transcription.json")
        #     os.rename("transcription.json", new_file_path)
        #     logger.info(f"File moved to {new_file_path}")
            
        #     with open("../public/data/Security Detection Engineer - Meta/applicants.json", 'r+') as fl:
        #         data = json.load(fl)
        #         data.append({"name": {candidate_name[0]}})
        #         fl.seek(0)
        #         json.dump(data, fl)
            
        #     fl.close()
            
        #     callOpenAI.getSummary(new_file_path, candidate_name[0])
        #     logger.info("#############################")
        #     logger.info("Agent stopped.")
            
            
        # ctx.add_shutdown_callback(my_shutdown_hook)
        
    except Exception as e:
        logger.error(f"Error in entrypoint: {e}")
        return

if __name__ == "__main__":
    try:
        logger.info("Starting the application...")
        #https://docs.livekit.io/python/livekit/agents/index.html
        #amitmathapati
        cli.run_app(
            WorkerOptions(
                entrypoint_fnc=entrypoint,
                ws_url="f{LIVEKIT_SERVER_URL}",
                api_key="f{LIVEKIT_API_KEY}",
                api_secret="f{LIVEKIT_API_SECRET} "
            )
        )
        # cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
        logger.info("Application started.")
    except Exception as e:
        logger.error(f"Error in main: {e}")