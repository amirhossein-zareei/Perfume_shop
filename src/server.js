const dotenv = require("dotenv");

const { connectMongoDB, connectRedis, env } = require("./config/index");

const isProductionMode = env.app.mode === "production";
if (!isProductionMode) {
  dotenv.config();
}

const app = require("./app");

async function connectToDB() {
  await connectMongoDB();

  await connectRedis();
}

const startServer = () => {
  const port = env.app.port;

  app.listen(port, () => {
    console.log(
      `🚀 Server running in ${
        isProductionMode ? "production" : "development"
      } mode on port ${port}`
    );
  });
};

async function run() {
  await connectToDB();
  startServer();
}

run();
