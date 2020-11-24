import Router from 'koa-router';

const controllers = require('./controllers');

const router = new Router();

// get
router.get('/test', controllers.getTest);

// post
router.post('/test', controllers.addTest);

// put
// delete

module.exports = router;
