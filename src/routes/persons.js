/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */

const {
  pipeline
} = require("../queries/persons");

const {createDataChart} = require('../utils/dataForChart');

async function routes(fastify, options) {
  const persons = fastify.mongo.atlanto.db.collection("persons");

  fastify.get("/birthyears", async (request, reply) => {
    try {
      const result = await persons.aggregate(pipeline).toArray();
      const data = createDataChart(result);
      reply.status(200).send(data);
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });

}

module.exports = routes;
