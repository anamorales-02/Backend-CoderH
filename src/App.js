import express from 'express';
import http from 'http';
import { productsRouter } from './Routers/productsRouter.js';
import { cartRouter } from './Routers/cartsRouter.js';
import { clientRouter } from './Routers/clientRouter.js';
import { connectMongo, connectSocket } from './config/utils.js';
import { ProductManager } from './dao/ProductManager.js';
import { engine } from 'express-handlebars';
import { authRouter } from './Routers/authRouter.js'; 
import { chatRouter } from './Routers/chatRouter.js';
import { sessionsRouter } from './Routers/sessionsRouter.js';
import { viewsRouter } from './Routers/viewsRouter.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import { initPassport } from './config/passportConfig.js';
import passport from 'passport';
import path from 'path';
import config from "./config/config.js";

const app = express();
const PORT = config.port;

const server = httpServer.listen(PORT, () =>
  console.log(`📢 Server listening on port: ${PORT}`)
);

const httpServer = http.createServer(app);
connectMongo(); // Conecta a la base de datos MongoDB
connectSocket(httpServer); // Conecta el servidor de sockets

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(cookieParser());


app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

app.use(cookieParser())
app.use(

session({
  store: MongoStore.create({ mongoUrl: 'mongodb+srv://nicorosadonr:vVvmPSAf6gJmXL4z@backendcoder.l1bqk8c.mongodb.net/ecommerce?retryWrites=true&w=majority', ttl: 7200 }),
  secret: 'mysecretkey',
  resave: true,
  saveUninitialized: true
})
)

initPassport()
app.use(passport.initialize())
app.use(passport.session())

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join('./public')));

// Using handlebars engine for templates
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join('./views'));

// Routes
app.use('/api', productsRouter);
app.use('/api', cartRouter);
app.use('/', clientRouter);
app.use('/api/sessions', sessionsRouter)
app.use('/', viewsRouter)
app.use('/chat', chatRouter)
app.use('/auth', authRouter)

