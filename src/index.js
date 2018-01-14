const line = require('@line/bot-sdk');
const express = require('express');
const config = require('../config.json');

const client = new line.Client(config);

const handleEvent = (aEvent) => {
  console.log('handleEvent called');

  if (aEvent.type !== 'message' || aEvent.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(aEvent.replyToken, {
    type: 'text',
    text: aEvent.message.text
  });
};

const app = express();

app.post('/callback', line.middleware(config), (aReq, aRes) => {
  console.log('callback called');

  Promise
    .all(aReq.body.events.map(handleEvent))
    .then(result => aRes.json(result));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
