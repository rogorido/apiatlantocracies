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

// el asunto es este: https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request
// cuando hace un POST realmente pregunta antes al servidor con el método OPTIONS...
fastify.register(require("@fastify/cors"), {
  origin: [
    "http://localhost:3000",
    "https://atlanto.digitalhumanities.digital",
    "https://atlantocracies.digitalhumanities.digital",
  ],
  methods: ["GET", "POST", "OPTIONS"],
});

fastify.register(require("@fastify/rate-limit"), {
  max: 180,
  timeWindow: "1 minute",
});

// We load the dbConnector
fastify.register(require("./src/plugins/db"));

// We declare a route
fastify.register(require("./src/routes/general"), { prefix: "/general" });
fastify.register(require("./src/routes/static"), { prefix: "/static" });
fastify.register(require("./src/routes/persons"), { prefix: "/persons" });
fastify.register(require("./src/routes/groups"), { prefix: "/groups" });
fastify.register(require("./src/routes/places"), { prefix: "/places" });
fastify.register(require("./src/routes/relations"), { prefix: "/relations" });
fastify.register(require("./src/routes/events"), { prefix: "/events" });
fastify.register(require("./src/routes/search"), { prefix: "/search" });
fastify.register(require("./src/routes/management"), { prefix: "/management" });

// we use helmet
fastify.register(helmet);

fastify.listen({ port: process.env.PORT }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
