const eventsbyplace = require("../queries/events/byplace");

// TODO: esto realmente hay que cambiarle el nombre
const { createDataChartHistBirths } = require("../utils/dataForChart");

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
  const persons = fastify.mongo.atlanto.db.collection("persons");
  const vpersons = fastify.mongo.atlanto.db.collection("vistapersonas");

  fastify.get("/", async (request, reply) => {
    try {
      const result = await vpersons.find().toArray();
      reply.status(200).send(result);
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });

  fastify.get("/eventsbyplace/:place", async (request, reply) => {
    const { place } = request.params;
    try {
      const result = await persons
        .aggregate(eventsbyplace.pipeline(place))
        .toArray();
      const dataChart = createDataChartHistBirths(result);
      reply.status(200).send({ result, dataChart });
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });
}

module.exports = routes;