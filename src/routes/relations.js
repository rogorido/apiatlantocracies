const qreltypes = require("../queries/relations/relations");

async function routes(fastify, options) {
  const persons = fastify.mongo.atlanto.db.collection("persons");
  // const vpersons = fastify.mongo.atlanto.db.collection("vistapersonascontodo");

  // NOTE: hacerlo así o con un post. Lo digo porque tienen espacios, símbolos, etc.
  fastify.get("/:reltype", async (request, reply) => {
    const { reltype } = request.params;

    try {
      const result = await persons
        .aggregate(qreltypes.pipeline(reltype))
        .toArray();

      reply.status(200).send(result);
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });
}

module.exports = routes;
