import React, { useState } from 'react';
import {
  LiveKitRoom,
  useVoiceAssistant,
  VoiceAssistantControlBar,
  RoomAudioRenderer,
  BarVisualizer,
} from '@livekit/components-react';
import '@livekit/components-styles';

const VoiceChat = ({ token, serverUrl, roomName, jobDescription }) => {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnected = () => {
    setIsConnected(true);
  };

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      audio={true}
      video={false}
      onConnected={handleConnected}
      data-lk-theme="default"
    >
      
      {isConnected ? <VoiceAssistantUI /> : <p>Connecting to the room...</p>}
    </LiveKitRoom>
  );
};

const VoiceAssistantUI = () => {
  const { state, audioTrack } = useVoiceAssistant();
  const [isChatActive, setIsChatActive] = useState(false);

  const handleStartChat = () => {
    setIsChatActive(true);
  };

  const handleStopChat = () => {
    setIsChatActive(false);
  };

  return (
    <div>
      <h3>AI Voice Chat</h3>
      <BarVisualizer state={state} trackRef={audioTrack} style={{ width: '50vw', height: '10px' }} />
      {isChatActive ? (
          <button onClick={handleStopChat}>Stop Chat</button>
        ) : (
          <button onClick={handleStartChat}>Start Chat</button>
        )
      }
      <VoiceAssistantControlBar />
      <RoomAudioRenderer />
    </div>
  );
};


export default VoiceChat;
