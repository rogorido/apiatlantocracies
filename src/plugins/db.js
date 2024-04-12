const fastifyPlugin = require("fastify-plugin");

/**
 * Connects to a MongoDB database
 * @param {FastifyInstance} fastify Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */

async function dbConnector(fastify, options) {
  fastify.register(require("@fastify/mongodb"), {
    forceClose: true,
    url: "mongodb://127.0.0.1:27017/atlanto",
    name: "atlanto",
  });
}

module.exports = fastifyPlugin(dbConnector);
