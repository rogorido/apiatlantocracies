const eventsbyplace = require("../queries/events/byplace");

const { createDataChartHistBirths } = require("../utils/dataForChart");

const { placeSchema } = require("../schemas/schemas");

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
      reply.status(500).send("Error in the server or in the query");
    }
  });

  // Cambiar
  // fastify.get("/eventsbyplace/:place", placeSchema, async (request, reply) => {
  fastify.get("/eventsbyplace/:place", async (request, reply) => {
    const { place } = request.params;
    try {
      const result = await persons
        .aggregate(eventsbyplace.pipeline(place))
        .toArray();
      // TODO qué hace esto aquí?
      const dataChart = createDataChartHistBirths(result);
      reply.status(200).send({ result, dataChart });
    } catch (error) {
      console.error(error);
      reply.status(500).send("Error in the server or in the query");
    }
  });
}

module.exports = routes;
