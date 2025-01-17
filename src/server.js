// server.js
import express from 'express';
import { AccessToken } from 'livekit-server-sdk';
import cors from 'cors';

const apiKey = 'API4cdcBLemXMvZ';
const apiSecret = 'f9ipJ7cG9xeQTRGhD4Cw2JYcfMKwzyyUlYGZmtu9QIbA';


const getFormattedDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
};

const createToken = async () => {
  // const roomName = 'quickstart-room';
  const roomName = `quickstart-room-${getFormattedDateTime()}`;
  const participantName = 'quickstart-username';

  //https://docs.livekit.io/home/server/generating-tokens/ 
  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
    // Token to expire after 10 minutes
    ttl: '10m',
  });
  //More details
  //https://github.com/livekit-examples/realtime-playground/blob/9c091a4e220c4d4410bcb62b9f9ee3fe15e7c152/web/src/app/api/token/route.ts#L66
  at.addGrant({ roomJoin: true, roomCreate: true, room: roomName, canPublish: true, canPublishData: true });

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
