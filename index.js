import express from 'express';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import path from 'path'; 
import route from './src/router/index.router.js';
import cookieParser from 'cookie-parser'; // import cookie-parser to use req.cookies
import dotenv from 'dotenv';  // Import dotenv


const app = express();

const setShowHeader = (req, res, next) => {
    if (req.url === '/user' || req.url === '/user/sign') {
        res.locals.showHeader = false; 
    } else {
        res.locals.showHeader = true;
    }
    next();
};

dotenv.config();

// Sử dụng middleware

app.use(setShowHeader);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine('hbs', engine());
app.set('view engine', 'hbs');
app.set('views', './src/resources/views');

app.use(express.static(path.join(__dirname, './src/public')));

route(app);

app.listen(2000);
