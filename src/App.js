import express from 'express';
import cors from 'cors';
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import productRouters from './Routers/productsRouter.js';
import cartRouters from './Routers/cartsRouter.js';
import chatRouters from './Routers/chatRouter.js';
import authRouters from './Routers/authRouter.js';
import userRouters from './Routers/usersRouter.js';
import { connectMongo } from './utils/utils.js';
import { engine } from 'express-handlebars';
import session from 'express-session';
import ticketRouter from './Routers/tiketRouter.js';
import sessionsRouter from './Routers/sessionsRouter.js';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import { setupSocketServer } from "./utils/socket-io.js";
import { iniPassport } from './config/passportConfig.js';
import passport from 'passport';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import errorHandler from "./middlewares/error.js";

const app = express();
const port = 8080;

const httpServer = http.createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

httpServer.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/auth/login`);
});

setupSocketServer(httpServer);

connectMongo();

import { connectToDatabase } from "./utils/dbConfig.js";

async function startApp() {
  try {
    await connectToDatabase();
    // Resto de tu lógica de la aplicación
  } catch (error) {
    console.error(error);
    // Manejar errores de conexión a la base de datos
  }
}

startApp();

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

iniPassport()
app.use(passport.initialize())
app.use(passport.session())

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion Pizzas",
      description: "Este proyecto no es de pizzas, es de usuarios",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join('./public')));

// Using handlebars engine for templates
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join('./views'));

// Routes
app.use('/', userRouters);
app.use('/', productRouters);
app.use('/', cartRouters);
app.use('/', chatRouters);
app.use('/', authRouters);
app.use('/', sessionsRouter);
app.use('/', ticketRouter);
app.use(errorHandler);

app.get("*", (req, res) => {
  return res.redirect("/auth/login");
});
