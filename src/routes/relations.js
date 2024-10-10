const qreltypes = require("../queries/relations/relations");

async function routes(fastify, options) {
  const persons = fastify.mongo.atlanto.db.collection("persons");
  // const vpersons = fastify.mongo.atlanto.db.collection("vistapersonascontodo");

  // NOTE: hacerlo así o con un post. Lo digo porque tienen espacios, símbolos, etc.
  fastify.get("/:reltype", async (request, reply) => {
    const { reltype } = request.params;

    try {
      // general data about the concrete relation
      const relationid = await persons
        .aggregate(qreltypes.aggrelation(reltype))
        .toArray();

      // general data about the concrete relation
      const positions = await persons
        .aggregate(qreltypes.aggpositions(reltype))
        .toArray();

      reply.status(200).send({ relationid, positions });
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });
}

module.exports = routes;
