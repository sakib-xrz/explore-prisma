import app from "./src/app.js";
import config from "./src/config/index.js";

const startServer = async () => {
  const port = config.port || 8000;

  app.listen(port, () => {
    console.log(`🎯 Server listening on port: ${port}`);
  });
};

startServer();
