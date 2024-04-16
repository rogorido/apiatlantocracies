// We use CJS and not ESM
const fastify = require("fastify")({ logger: { level: "info" } });
const helmet = require("@fastify/helmet");

require("dotenv").config();

// no sé por qué las jodidas peticiiones piden un favicon. Con esto
// evitamos en el log q ponga que no existe.
fastify.addHook("onRequest", (request, reply, done) => {
  if (request.url === "/favicon.ico") {
    reply.code(204).send();
  } else {
    done();
  }
});

// We load the dbConnector
fastify.register(require("./src/plugins/db"));

// We declare a route
fastify.register(require("./src/routes/general"), { prefix: "/general" });
fastify.register(require("./src/routes/static"), { prefix: "/static" });
fastify.register(require("./src/routes/persons"), { prefix: "/persons" });

// we use helmet
fastify.register(helmet);

fastify.listen({ port: process.env.PORT }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
