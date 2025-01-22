const qpos = require("../queries/positions/positions");
const { calculatePercentages } = require("../utils/percentages");
const { macroTableFields } = require("../queries/macrofilter/filter");

async function routes(fastify, options) {
  const vpersons = fastify.mongo.atlanto.db.collection("vistapersonascontodo");

  fastify.get("/:positiontype", async (request, reply) => {
    const { positiontype } = request.params;

    try {
      const personsAll = await vpersons
        .find(qpos.personsAll(positiontype))
        .project(macroTableFields)
        .toArray();

      const placesAllRaw = await vpersons
        .aggregate(qpos.placesAll(positiontype))
        .toArray();

      const countriesAllRaw = await vpersons
        .aggregate(qpos.countriesAll(positiontype))
        .toArray();

      const placesAll = calculatePercentages(placesAllRaw);
      const countriesAll = calculatePercentages(countriesAllRaw);

      reply.status(200).send({
        personsAll,
        placesAll,
        countriesAll,
      });
    } catch (error) {
      console.error(error);
      reply.status(500).send("Error in the server or in the query");
    }
  });
}

module.exports = routes;
