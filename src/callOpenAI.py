import os
from openai import OpenAI
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

#openai.Model.list()

# client = OpenAI(
#     # defaults to os.environ.get("OPENAI_API_KEY")
#     api_key=OPENAI_API_KEY
# )


client = OpenAI()


def getSummary(inputFile, candidate):
    logger.info("#############################")
    # print(response.choices[0].message.content)
    print(inputFile)
    print(candidate)
    
    with open(inputFile, 'r') as file:
        inputContent = file.read()
        
    print(inputContent)
    
    logger.info("#############################")
    logger.info("calling Open AI server.")
    response = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You will be given a Interview Screening chat between an AI agent & human candidate. Please summarize the chat in 3-4 sentences of the candidate. Please stick to the chat context and don't add your own points.",
            },
            {
                "role": "user",
                "content": f"{inputContent}",
            }
        ],
        model="gpt-4o",
        response_format={"type": "text"},
    )
    
    
    logger.info("#############################")
    logger.info("Done calling Open AI server.")
    
    
    new_folder = f"../public/data/Security Detection Engineer - Meta/{candidate}/summary.txt"
    
    with open(f"{new_folder}", 'w') as f:
            f.write(response.choices[0].message.content)
            # f.write(inputContent)
    
    f.close()        
            
    # return response.choices[0].message.content
            
if __name__ == '__main__':
    # test1.py executed as script
    # do something
    # inputQuestion1 = '[{"agent": " Hey, welcome to our page. My name is Jonathan. How can I help you today?"}, {"user": "My name is Amit. Goodbye."}, {"agent": " Thank you, Amit. Goodbye!"}]'
    inputQuestion1 = '../public/data/Security Detection Engineer - Meta/Amit Mathapati/transcription.json'
    result1 = getSummary(inputQuestion1, "Amit Mathapati")
    print(result1)