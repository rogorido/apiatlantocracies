/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */

const { pl_places_global } = require("../queries/places/places");

const { createDataChart } = require("../utils/dataForChart");

async function routes(fastify, options) {
  const persons = fastify.mongo.atlanto.db.collection("persons");

  fastify.get("/", async (request, reply) => {
    try {
      const result = await persons.aggregate(pl_places_global).toArray();
      reply.status(200).send(result);
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });

  fastify.get("/related/:place", async (request, reply) => {
    const { place } = request.params;

    try {
      const places = await persons.aggregate(related.pipeline(place)).toArray();
      const placesnetwork = createDataPlacesNetwork(places, place);

      reply.status(200).send({ places, placesnetwork });
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });
}

module.exports = routes;
