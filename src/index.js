const line = require('@line/bot-sdk');
const express = require('express');

const replyRules = require('../replyRules.json');
const config = require('../config.json');


const client = new line.Client(config);

const getReplyMessage = (aText) => {
  return replyRules.find((aRule) => {
    const ret = aRule.inputs.find((aInput) => {
      return aText === aInput;
    });
    return ret ? true : false;
  }).message;
};

const handleEvent = (aEvent) => {
  console.log('handleEvent called');

  if (aEvent.type !== 'message' || aEvent.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const message = getReplyMessage(aEvent.message.text);
  if (!message) {
    return Promise.resolve(null);
  }

  return client.replyMessage(aEvent.replyToken, message);
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
