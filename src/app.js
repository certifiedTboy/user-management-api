const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const sanitizer = require("perfect-express-sanitizer");
const path = require("path");
const apiV1 = require("./routes/apiV1");
const GlobalErrorHandler = require("../lib/errorInstances/GlobalErrorHandler");
const app = express();

const allowedOrigins = ["http://localhost:3000"];
const expressOptions = {
  urlencodExtended: true,
  requestSizeLimit: "20mb",
};
const corsOption = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
    "X-Auth-Token",
    "Authorization",
    "Accept-Encoding",
    "Connection",
    "Content-Length",
  ],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: allowedOrigins,
  preflightContinue: false,
};

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(cookieParser());
app.use(morgan("combined"));
app.use(cors(corsOption));
app.use(express.json({ limit: expressOptions.requestSizeLimit }));

app.use(
  express.urlencoded({
    limit: expressOptions.requestSizeLimit,
    extended: expressOptions.urlencodExtended,
  })
);

app.use(
  sanitizer.clean({
    xss: true,
    noSql: true,
    sql: true,
  })
);

app.use(express.static(path.join(process.cwd(), "public")));
app.use("/api/v1", apiV1);
app.use(GlobalErrorHandler);

app.get("/", (req, res) => {
  res.send("server is live");
});

module.exports = app;
