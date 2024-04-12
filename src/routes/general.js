/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */

async function routes(fastify, options) {
  const colweather = fastify.mongo.weather.db.collection("wdata");
  const colships = fastify.mongo.ships.db.collection("shipwrecks");

  fastify.get("/", async (request, reply) => {
    return { hostias: "leches" };
  });

  fastify.get("/version", async (request, reply) => {
    return { version: process.env.npm_package_version };
  });

  fastify.get("/leches", async (request, reply) => {
    const result = await colweather.find().toArray();
    return result;
  });

  fastify.get("/peligrosos", async (request, reply) => {
    const result = await colships
      .find({ feature_type: { $regex: "dangerous" } })
      .toArray();
    return result;
  });

  fastify.get("/peligrososcontar", async (request, reply) => {
    const result = await colships.countDocuments({
      feature_type: { $regex: "dangerous" },
    });

    return { total: result };
  });

  fastify.get("/profundidad", async (request, reply) => {
    const result = await colships
      .find({ depth: { $exists: true, $ne: "" } })
      .toArray();
    return result;
  });

  fastify.get("/profundidad/:prof", async (request, reply) => {
    // const prof = parseInt(request.params.prof);
    const prof = parseFloat(request.params.prof);
    console.info(prof);
    try {
      const result = await colships.find({ depth: { $gt: prof } }).count();
      return { total: result };
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
