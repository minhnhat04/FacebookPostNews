import siteRouter from './site.router.js';
import userRouter from './user.router.js';
import postRouter from './post.router.js';
import apiRouter from './apiRoute.route.js';

const route = (app) => {
    app.use('/user', userRouter);
    app.use('/posts', postRouter);
    app.use('/api', apiRouter);
    app.use('/', siteRouter);
}

export default route;