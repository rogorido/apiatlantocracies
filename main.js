// We use CJS and not ESM
const fastify = require("fastify")({ logger: true });

require("dotenv").config();

// Declare a route
fastify.register(require("./src/routes/routes"));

fastify.listen({port: process.env.PORT}, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
