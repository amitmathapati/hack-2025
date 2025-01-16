import React, { useState, useEffect } from 'react';
import {
  LiveKitRoom,
  useVoiceAssistant,
  VoiceAssistantControlBar,
  RoomAudioRenderer,
  BarVisualizer,
  useLiveKitRoom
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Chat } from "@livekit/components-react";

const VoiceChat = ({ token, serverUrl, roomName, jobDescription }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  //Not working
  //https://docs.livekit.io/reference/components/react/hook/uselivekitroom/
  const { room } = useLiveKitRoom();

  //does not work
  //https://docs.livekit.io/home/client/data/messages/
  useEffect(() => {
    if (isConnected && room) {
      room.localParticipant.publishData(
        new TextEncoder().encode(jobDescription),
        { reliable: true }
      ).catch(error => console.error('Failed to send message:', error));
    }
  }, [isConnected, room, jobDescription]);

  const handleStartChat = () => {
    setIsConnected(true);
    setIsChatActive(true);

    // Send job description as a custom message
    // fetch(`${serverUrl}/send-custom-message`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     roomName,
    //     message: { jobDescription },
    //   }),
    // }).then((response) => {
    //   if (!response.ok) {
    //     console.error('Failed to send job description to LiveKit server');
    //   }
    // });

    // if (room) {
    //   room.localParticipant.publishData(
    //     new TextEncoder().encode(jobDescription),
    //     { reliable: true }
    //   ).catch(error => console.error('Failed to send message:', error));
    // }

  };

  const handleConnected = () => {
    console.log("Room connected");
    setIsConnected(true);
  };

  const handleStopChat = () => {
    setIsChatActive(false);
    setTimeout(() => setIsConnected(false), 500); // Disconnect after a delay to allow cleanup
  };

  // return (
  //   <LiveKitRoom
  //     token={token}
  //     serverUrl={serverUrl}
  //     connect={true}
  //     audio={true}
  //     video={false}
  //     onConnected={handleConnected}
  //     data-lk-theme="default"
  //   >
      
  //     {isConnected ? <VoiceAssistantUI /> : <p>Connecting to the room...</p>}
  //     {/* <Chat /> */}
  //   </LiveKitRoom>
  // );
  return (
    <div>
      <h3>AI Voice Chat : Talk with the Recruiter</h3>
      {isConnected ? (
        <LiveKitRoom
          token={token}
          serverUrl={serverUrl}
          connect={true}
          audio={true}
          video={false}
          // onConnected={() => console.log("Room connected")}
          // onDisconnected={() => console.log("Room disconnected")}
          onConnected={handleConnected}
          onDisconnected={() => {
            console.log("Room disconnected");
            setIsConnected(false);
          }}
          data-lk-theme="default"
        >
          <VoiceAssistantUI
            isChatActive={isChatActive}
            onStopChat={handleStopChat}
          />
        </LiveKitRoom>
      ) : (
        <div>
          {!isChatActive && (
            <button onClick={handleStartChat}>Start Chat</button>
          )}
        </div>
      )}
    </div>
  );
};

const VoiceAssistantUI = ({ isChatActive, onStopChat }) => {
// const VoiceAssistantUI = () => {
  const { state, audioTrack } = useVoiceAssistant();

  return (
    <div>
      <h3>AI Voice Chat : Talk with the Recruiter</h3>
      <BarVisualizer state={state} trackRef={audioTrack} style={{ width: '50vw', height: '10px' }} />
      {isChatActive && <button onClick={onStopChat}>Stop Chat</button>}
      <VoiceAssistantControlBar />
      <RoomAudioRenderer />
    </div>
  );
};


export default VoiceChat;
