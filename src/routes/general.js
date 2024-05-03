/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */

const {
  eventtypes,
  positionstypes,
  relationstypes,
  titlestypes,
} = require("../queries/general");

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
      const result = await persons.aggregate(eventtypes).toArray();
      reply.status(200).send(result);
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });

  fastify.get("/positionstypes", async (request, reply) => {
    try {
      const result = await persons.aggregate(positionstypes).toArray();
      reply.status(200).send(result);
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });

  fastify.get("/relationstypes", async (request, reply) => {
    try {
      const result = await persons.aggregate(relationstypes).toArray();
      reply.status(200).send(result);
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });

  fastify.get("/titlestypes", async (request, reply) => {
    try {
      const result = await persons.aggregate(titlestypes).toArray();
      reply.status(200).send(result);
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });

  fastify.get("/profundidadotro", async (request, reply) => {
    // const prof = parseInt(request.params.prof);
    const { operador } = request.query;
    const prof = parseInt(request.query.prof);
    // console.info(operador, prof);

    try {
      let filtro = {};

      if (operador === "mayor") {
        filtro = { depth: { $gt: prof } };
      }

      if (operador === "menor") {
        filtro = { depth: { $lt: prof } };
      }

      // console.log(filtro);
      const result = await colships.countDocuments(filtro);
      reply.status(200).send({ total: result });
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });

  fastify.get("/profundidadcontar", async (request, reply) => {
    const result = await colships
      .find({ depth: { $exists: true, $ne: "" } })
      .count();
    return { total: result };
  });

  fastify.get("/mediames", async (request, reply) => {
    const result = await colweather
      .aggregate([
        {
          $match: { "airTemperature.value": { $ne: 999.9 } },
        },
        {
          $group: {
            _id: { $hour: "$ts" },
            avgTemp: { $avg: "$airTemperature.value" },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();
    // return result;
    reply.status(200).send(result);
  });

  fastify.get("/estaciones", async (request, reply) => {
    const result = await colweather
      .aggregate([
        {
          $match: {
            callLetters: {
              $ne: "99999",
            },
          },
        },
        {
          $group: {
            _id: "$callLetters",
            total: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            total: -1,
          },
        },
      ])
      .toArray();
    reply.status(200).send(result);
  });

  fastify.get("/profundidadmedia", async (request, reply) => {
    const result = await colships
      .aggregate([
        { $match: { depth: { $exists: true, $ne: "" } } },
        { $group: { _id: null, avgProf: { $avg: "$depth" } } },
      ])
      .toArray();
    return result;
  });
}

module.exports = routes;
