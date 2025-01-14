// server.js
import express from 'express';
import { AccessToken } from 'livekit-server-sdk';
import cors from 'cors';

const apiKey = 'API4cdcBLemXMvZ';
const apiSecret = 'f9ipJ7cG9xeQTRGhD4Cw2JYcfMKwzyyUlYGZmtu9QIbA';

const createToken = async () => {
  const roomName = 'quickstart-room';
  const participantName = 'quickstart-username';

  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
    // Token to expire after 10 minutes
    ttl: '10m',
  });
  at.addGrant({ roomJoin: true, roomCreate: true, room: roomName });

  return await at.toJwt();
};

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));

const port = 3001;

app.get('/generate-token', async (req, res) => {
  res.send(await createToken());
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
