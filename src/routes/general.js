/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */

const q = require("../queries/general");

const { versionSchema, eventstypesSchema } = require("../schemas/schemas");

const { createDataChartGenders } = require("../utils/dataForChart");
const { pl_places_global } = require("../queries/places/places");

async function routes(fastify, options) {
  const persons = fastify.mongo.atlanto.db.collection("persons");

  fastify.get("/version", versionSchema, async (request, reply) => {
    return { version: process.env.npm_package_version };
  });

  fastify.get("/generalstats", async (request, reply) => {
    try {
      const [
        events,
        positions,
        titles,
        relations,
        genders,
        places,
        individuals,
      ] = await Promise.all([
        persons.aggregate(q.eventstypes).toArray(),
        persons.aggregate(q.positionstypes).toArray(),
        persons.aggregate(q.titlestypes).toArray(),
        persons.aggregate(q.relationstypes).toArray(),
        persons.aggregate(q.genders).toArray(),
        persons.aggregate(pl_places_global).toArray(),
        persons.countDocuments(),
      ]);

      const gendersChartData = createDataChartGenders(genders);

      reply.status(200).send({
        totalEvents: events.length,
        totalPositions: positions.length,
        totalTitles: titles.length,
        totalRelations: relations.length,
        totalGenders: genders,
        totalPersons: individuals,
        totalPlaces: places.length,
        version: process.env.npm_package_version,
        gendersChartData,
      });
    } catch (error) {
      console.error(error);
      reply.status(500).send("error in the server or in the query");
    }
  });

  fastify.get("/eventstypes", eventstypesSchema, async (request, reply) => {
    try {
      const result = await persons.aggregate(q.eventstypes).toArray();
      reply.status(200).send(result);
    } catch (error) {
      console.error(error);
      reply.status(500).send("error in the server or in the query");
    }
  });

  fastify.get("/positionstypes", async (request, reply) => {
    try {
      const result = await persons.aggregate(q.positionstypes).toArray();
      reply.status(200).send(result);
    } catch (error) {
      console.error(error);
      reply.status(500).send("error in the server or in the query");
    }
  });

  fastify.get("/relationstypes", async (request, reply) => {
    try {
      const result = await persons.aggregate(q.relationstypes).toArray();
      reply.status(200).send(result);
    } catch (error) {
      console.error(error);
      reply.status(500).send("error in the server or in the query");
    }
  });

  fastify.get("/sources", async (request, reply) => {
    try {
      const result = await persons.aggregate(q.sources).toArray();
      reply.status(200).send(result);
    } catch (error) {
      console.error(error);
      reply.status(500).send("error in the server or in the query");
    }
  });

  fastify.get("/titlestypes", async (request, reply) => {
    try {
      const titlestypes = await persons.aggregate(q.titlestypes).toArray();
      const titlescontinents = await persons
        .aggregate(q.titlescontinents)
        .toArray();
      reply.status(200).send({ titlestypes, titlescontinents });
    } catch (error) {
      console.error(error);
      reply.status(500).send("error in the server or in the query");
    }
  });
}

module.exports = routes;
