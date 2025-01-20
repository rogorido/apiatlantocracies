const personsbyplace = require("../queries/persons/byplace");
const { histBirth, birthYearsBucket } = require("../queries/persons/births");
const { personDetails } = require("../utils/personDetalis");
const { createDataTimeline } = require("../utils/dataTimelne");
const { createPersonsNetworkCyto } = require("../utils/personNetwork");
const { ObjectId } = require("mongodb");

const { placeSchema } = require("../schemas/schemas");

const {
  createDataChart,
  createDataChartHistBirths,
} = require("../utils/dataForChart");

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
  const persons = fastify.mongo.atlanto.db.collection("persons");
  // const vpersons = fastify.mongo.atlanto.db.collection("vistapersonas");
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

  fastify.get("/birthyears", async (request, reply) => {
    try {
      const result = await vpersons.aggregate(birthYearsBucket).toArray();
      const data = createDataChart(result);
      reply.status(200).send(data);
    } catch (error) {
      console.error(error);
      reply.status(500).send("Error in the server or in the query");
    }
  });

  // TODO: cambiar
  //fastify.get("/personsbyplace/:place", placeSchema, async (request, reply) => {
  fastify.get("/personsbyplace/:place", async (request, reply) => {
    const { place } = request.params;
    try {
      const result = await persons
        .aggregate(personsbyplace.pipeline(place))
        .toArray();
      reply.status(200).send(result);
    } catch (error) {
      console.error(error);
      reply.status(500).send("Error in the server or in the query");
    }
  });

  fastify.get("/personsbyid/:id", async (request, reply) => {
    const { id } = request.params;

    if (!id) {
      return reply.status(500).send("Error in the server or in the query");
    }

    try {
      const result = await vpersons.findOne({ _id: new ObjectId(id) });

      // we add details about years in relations, etc.
      const persondetails = personDetails(result);

      // we create a timeline
      const personeventstimeline = createDataTimeline(persondetails);

      // Old code: we create network
      // const personnetwork = createDataPersonsNetwork(
      //   persondetails.relations,
      //   persondetails.name,
      // );

      const personnetwork = await createPersonsNetworkCyto(
        [persondetails], // we need an array!
        fastify.mongo.atlanto.db,
      );

      console.log(personnetwork);
      return reply
        .status(200)
        .send({ persondetails, personeventstimeline, personnetwork });
    } catch (error) {
      console.error(error);
      return reply.status(500).send("Error in the server or in the query");
    }
  });

  fastify.get("/histbirths", async (request, reply) => {
    try {
      const result = await persons.aggregate(histBirth).toArray();
      const data = createDataChartHistBirths(result);
      reply.status(200).send({ result, chartData: data });
    } catch (error) {
      console.error(error);
      reply.status(500).send("Error in the server or in the query");
    }
  });
}

module.exports = routes;
