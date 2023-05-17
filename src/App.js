const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: SocketServer } = require("socket.io");

const productRoutes = require("./Routers/productsRouter");
const cartRoutes = require("./Routers/cartsRouter");
const hbsRoutes = require("./Routers/handlebarsRouter");
const realTimeProdRoutes = require("./Routers/realtimeprodsRouter");

const ProductManager = require("./ProductManager");
const data = new ProductManager("productsDB");

const exphbs = require("express-handlebars");
const path = require("path");

const PORT = 8080;
const app = express();
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);

const server = httpServer.listen(PORT, () =>
  console.log(`📢 Server listening on port: ${PORT}`)
);

server.on("error", (error) => console.log(`Server error: ${error}`));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "/public")));

// Using handlebars engine for templates
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts")
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/", hbsRoutes);
app.use("/realtimeproducts", realTimeProdRoutes);

io.on("connection", (socket) => {
  console.log(`New Client Connection with ID: ${socket.id}`);

  socket.on("new-product", async (newProd) => {
    try {
      await data.addProduct({ ...newProd });
      const productsList = await data.getProducts();
      io.emit("products", productsList);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("delete-product", async (delProd) => {
    try {
      const id = parseInt(delProd);
      await data.deleteProduct(id);
      const productsList = await data.getProducts();
      io.emit("products", productsList);
    } catch (error) {
      console.log(error);
    }
  });
});

app.get("*", (req, res) =>
  res.status(404).send("<h3>We cannot access the requested route</h3>")
);
