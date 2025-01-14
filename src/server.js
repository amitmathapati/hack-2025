const express = require('express');
const { AccessToken } = require('livekit-server-sdk');
const app = express();

const apiKey = 'devkey'; // Replace with your LiveKit API key
const apiSecret = 'secret'; // Replace with your LiveKit API secret

// app.get('/generate-token', (req, res) => {
//   const identity = req.query.identity || 'user-' + Math.floor(Math.random() * 1000);
//   const token = new AccessToken(apiKey, apiSecret, { identity });
//   token.addGrant({ roomJoin: true, room: 'default-room' });
//   res.json({ token: token.toJwt() });
// });

app.get('/generate-token', (req, res) => {
  const identity = req.query.identity || 'user-' + Math.floor(Math.random() * 1000);
  const roomName = 'voice-chat-room'; // Use a specific room name
  const token = new AccessToken(apiKey, apiSecret, { identity });
  token.addGrant({ roomJoin: true, room: roomName }); // Specify the room name here
  res.json({ token: token.toJwt(), room: roomName });
});

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
