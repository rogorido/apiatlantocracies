const { personDetails } = require("../utils/personDetalis");

const { macrofilterConverter } = require("../queries/macrofilter/filter");
const { cytorelationsfilter } = require("../queries/groups/relations");

const { createPersonsNetworkCyto, createPersonsNetworkTable } = require("../utils/personNetwork");

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
  // const persons = fastify.mongo.atlanto.db.collection("persons");
  const vpersons = fastify.mongo.atlanto.db.collection("vistapersonascontodo");

  // TODO: aquí hay mucho dato muy similar que estoy pasando...
  fastify.post("/", async (request, reply) => {
    try {
      const filter = macrofilterConverter(request.body);

      console.log(filter);

      const result = await vpersons.find(filter).toArray();

      // a forEach is not possible!
      const personsDetails = result.map((person) => {
        return personDetails(person);
      });

      // const personsrelations = await vpersons.aggregate(cytorelationsfilter).toArray();
      const personsrelations = await vpersons.aggregate([{ '$match': filter }, ...cytorelationsfilter]).toArray();
      const personsrelationsDetails = personsrelations.map((person) => {
        return personDetails(person);
      });
      const personsrelationscyto = createPersonsNetworkCyto(personsrelationsDetails);

      // transform the data into a table format for use in the frontend.
      const personsrelationstable = createPersonsNetworkTable(personsrelationsDetails);

      reply.status(200).send({
        personsDetails, personsrelations, personsrelationstable, personsrelationscyto
      });
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });


}

module.exports = routes;
