import React, { useState } from 'react';
import {
  LiveKitRoom,
  useVoiceAssistant,
  VoiceAssistantControlBar,
  RoomAudioRenderer,
  BarVisualizer,
} from '@livekit/components-react';

const VoiceChat = ({ token, serverUrl }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);

  // Call useVoiceAssistant unconditionally
  const { state, audioTrack, startVoiceInteraction, stopVoiceInteraction } = useVoiceAssistant();

  const handleStartChat = () => {
    if (isConnected) {
      startVoiceInteraction();
      setIsChatActive(true);
    }
  };

  const handleStopChat = () => {
    if (isConnected) {
      stopVoiceInteraction();
      setIsChatActive(false);
    }
  };

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      onConnected={() => setIsConnected(true)}
    >
      <div>
        <h3>AI Voice Chat</h3>
        {isConnected ? (
          <>
            <BarVisualizer state={state} trackRef={audioTrack} />
            {isChatActive ? (
              <button onClick={handleStopChat}>Stop Chat</button>
            ) : (
              <button onClick={handleStartChat}>Start Chat</button>
            )}
            <VoiceAssistantControlBar />
            <RoomAudioRenderer />
          </>
        ) : (
          <p>Connecting...</p>
        )}
      </div>
    </LiveKitRoom>
  );
};

export default VoiceChat;
