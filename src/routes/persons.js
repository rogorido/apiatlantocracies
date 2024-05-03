const personsbyplace = require("../queries/persons/byplace");
const { histBirth, birthYearsBucket } = require("../queries/persons/births");

const { personDetails } = require("../utils/personDetalis");

const { createDataTimeline } = require("../utils/dataTimelne");

const { ObjectId } = require("mongodb");

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
