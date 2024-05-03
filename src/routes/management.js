const qm = require("../queries/management/general");

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
  const persons = fastify.mongo.atlanto.db.collection("persons");

  fastify.get("/", async (request, reply) => {
    try {
      const relfields = await persons.aggregate(qm.relationsFields).toArray();
      const evfields = await persons.aggregate(qm.eventsFields).toArray();
      const posfields = await persons.aggregate(qm.positionsFields).toArray();
      const titfields = await persons.aggregate(qm.titlesFields).toArray();
      reply
        .status(200)
        .send({
          relations: relfields,
          events: evfields,
          positions: posfields,
          titles: titfields,
        });
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });
}

module.exports = routes;
