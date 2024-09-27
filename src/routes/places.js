const { pl_places_global } = require("../queries/places/places");
const related = require("../queries/places/related");
const { createDataPlacesNetwork } = require("../utils/dataNetwork");
const { flipCoords } = require("../utils/coordsFlipped");
const { ObjectId } = require("mongodb");

const eventsbyplace = require("../queries/events/byplace");

// TODO: esto realmente hay que cambiarle el nombre
const { createDataChartHistBirths } = require("../utils/dataForChart");

const personsbyplace = require("../queries/persons/byplace");

const { placeSchema } = require("../schemas/schemas");

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */

async function routes(fastify, options) {
  const persons = fastify.mongo.atlanto.db.collection("persons");
  const vpersons = fastify.mongo.atlanto.db.collection("vistapersonascontodo");

  fastify.get("/", async (request, reply) => {
    try {
      const result = await persons.aggregate(pl_places_global).toArray();
      // we have to flip the coordinates
      const coordsflipped = flipCoords(result);

      return reply.status(200).send(coordsflipped);
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });

  //fastify.get("/:place", placeSchema, async (request, reply) => {
  fastify.get("/:place", async (request, reply) => {
    const { place } = request.params;

    try {
      const result = await persons.find({ placebirth: place }).toArray();

      reply.status(200).send(result);
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });

  // NOTE: we use this route which summarises various routes
  //fastify.get("/placeid/:place", placeSchema, async (request, reply) => {
  fastify.get("/placeid/:place", async (request, reply) => {
    const { place } = request.params;

    try {
      const personsbirths = await persons.find({ placebirth: place }).toArray();

      // pero esto es lo mismo,no?
      const personsall = await vpersons
        .aggregate(personsbyplace.pipeline(place))
        .toArray();

      // esto es lo mismo q /related/:place
      const places = await persons.aggregate(related.pipeline(place)).toArray();
      const placesnetwork = createDataPlacesNetwork(places, place);

      const placesrelated = { places, placesnetwork };

      // esto es lo mismo q /eventsbyplace/:place
      const eventsplace = await persons
        .aggregate(eventsbyplace.pipeline(place))
        .toArray();
      // TODO qué hace esto aquí?
      const dataChart = createDataChartHistBirths(eventsplace);

      const eventsrelated = { eventsplace, dataChart };

      reply.status(200).send({
        personsbirths,
        personsall,
        placesrelated,
        eventsrelated,
      });
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });

  // Cambiar
  // fastify.get("/related/:place", placeSchema, async (request, reply) => {
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

  fastify.get("/placesbyperson/:id", async (request, reply) => {
    const { id } = request.params;

    if (!id) {
      return reply.status(500).send("error en el servidor o en la consulta");
    }

    try {
      const result = await persons
        .aggregate([{ $match: { _id: new ObjectId(id) } }, ...pl_places_global])
        .toArray();
      // console.log(result);
      return reply.status(200).send(result);
    } catch (error) {
      console.error(error);
      return reply.status(500).send("error en el servidor o en la consulta");
    }
  });
}

module.exports = routes;
