const qevents = require("../queries/events/events");
const eventsbyplace = require("../queries/events/byplace");

const { createDataChartHistBirths } = require("../utils/dataForChart");
const { calculatePercentages } = require("../utils/percentages");
// const { placeSchema } = require("../schemas/schemas");

async function routes(fastify, options) {
  // TODO: es necesario los dos?
  const persons = fastify.mongo.atlanto.db.collection("persons");
  const vpersons = fastify.mongo.atlanto.db.collection("vistapersonascontodo");

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

  fastify.get("/:eventtype", async (request, reply) => {
    const { eventtype } = request.params;

    try {
      const personsAll = await vpersons
        .find(qevents.personsAll(eventtype))
        .toArray();

      const placesAllRaw = await vpersons
        .aggregate(qevents.placesAll(eventtype))
        .toArray();

      const eventDecades = await vpersons
        .aggregate(qevents.eventDecades(eventtype))
        .toArray();

      const placesAll = calculatePercentages(placesAllRaw);

      reply.status(200).send({
        personsAll,
        placesAll,
        eventDecades,
      });
    } catch (error) {
      console.error(error);
      reply.status(500).send("Error in the server or in the query");
    }
  });
}

module.exports = routes;
