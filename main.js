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

fastify.register(require("@fastify/cors"), {
  //origin: true, // Permitir solicitudes desde cualquier origen
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://192.168.1.105:5173",
    "http://127.0.0.1:4173",
    "http://192.168.1.105:4173",
  ], // Permitir solicitudes desde cualquier origen
  methods: ["GET", "POST", "PUT", "DELETE"],
});
// We load the dbConnector
fastify.register(require("./src/plugins/db"));

// We declare a route
fastify.register(require("./src/routes/general"), { prefix: "/general" });
fastify.register(require("./src/routes/static"), { prefix: "/static" });
fastify.register(require("./src/routes/persons"), { prefix: "/persons" });
fastify.register(require("./src/routes/places"), { prefix: "/places" });

// we use helmet
fastify.register(helmet);

fastify.listen({ port: process.env.PORT }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
