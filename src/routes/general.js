/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */

const q = require("../queries/general");

const { createDataChartGenders } = require("../utils/dataForChart");

async function routes(fastify, options) {
  const persons = fastify.mongo.atlanto.db.collection("persons");

  fastify.get("/version", async (request, reply) => {
    return { version: process.env.npm_package_version };
  });

  fastify.get("/generalstats", async (request, reply) => {
    try {
      const [events, positions, titles, relations, genders, individuals] =
        await Promise.all([
          persons.aggregate(q.eventtypes).toArray(),
          persons.aggregate(q.positionstypes).toArray(),
          persons.aggregate(q.titlestypes).toArray(),
          persons.aggregate(q.relationstypes).toArray(),
          persons.aggregate(q.genders).toArray(),
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
        gendersChartData,
      });
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });

  fastify.get("/eventtypes", async (request, reply) => {
    try {
      const result = await persons.aggregate(q.eventtypes).toArray();
      reply.status(200).send(result);
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });

  fastify.get("/positionstypes", async (request, reply) => {
    try {
      const result = await persons.aggregate(q.positionstypes).toArray();
      reply.status(200).send(result);
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });

  fastify.get("/relationstypes", async (request, reply) => {
    try {
      const result = await persons.aggregate(q.relationstypes).toArray();
      reply.status(200).send(result);
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });

  fastify.get("/titlestypes", async (request, reply) => {
    try {
      const result = await persons.aggregate(q.titlestypes).toArray();
      reply.status(200).send(result);
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });
}

module.exports = routes;
