const { personDetails } = require("../utils/personDetalis");

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
  // const persons = fastify.mongo.atlanto.db.collection("persons");
  const vpersons = fastify.mongo.atlanto.db.collection("vistapersonascontodo");

  fastify.post("/", async (request, reply) => {
    try {
      const filter = pipeline(request.body);

      console.log(filter);

      const result = await vpersons.find(filter).toArray();

      // a forEach is not possible!
      const personsDetails = result.map((person) => {
        return personDetails(person);
      });

      const personsrelations = createPersonsNetworkCyto(result);

      reply.status(200).send({
        personsDetails, personsrelations
      });
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });


}

module.exports = routes;
