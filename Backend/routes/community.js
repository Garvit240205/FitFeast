const { Router } = require('express');
const communityRouter = Router();

communityRouter.post('/post', (req, res) => {
  res.json({ message: 'post endpoint' });
});

communityRouter.delete('/post', (req, res) => {
  res.json({ message: 'delete endpoint' });
});

communityRouter.get('/preview', (req, res) => {
  res.json({ message: 'view all community posts endpoint' });
});

module.exports = communityRouter;
