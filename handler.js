const serverless = require("serverless-http");
const next = require("next");

const app = next({ dev: false });
const handle = app.getRequestHandler();

module.exports.handler = serverless(async (req, res) => {
  await app.prepare();
  return handle(req, res);
});
