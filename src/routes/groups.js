const { personDetails } = require("../utils/personDetalis");

const { macrofilterConverter } = require("../queries/macrofilter/filter");
const { cytorelationsfilter } = require("../queries/groups/relations");
const { pl_places_global } = require("../queries/places/places");
const { flipCoords } = require("../utils/coordsFlipped");

const {
  createPersonsNetworkCyto,
  createPersonsNetworkTable,
  extractIds,
} = require("../utils/personNetwork");

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
  const persons = fastify.mongo.atlanto.db.collection("persons");
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
      const personsrelations = await vpersons
        .aggregate([{ $match: filter }, ...cytorelationsfilter])
        .toArray();
      const personsrelationsDetails = personsrelations.map((person) => {
        return personDetails(person);
      });
      const personsrelationscyto = createPersonsNetworkCyto(
        personsrelationsDetails,
      );

      // transform the data into a table format for use in the frontend.
      const personsrelationstable = createPersonsNetworkTable(
        personsrelationsDetails,
      );
      console.log(personsrelationstable);

      // NOTE: this is not a good solution. The problem is that we need the collection persons since
      // there are all relations, etc. And not in the view personascontodo. But we can not use
      // the filter with persons since it lacks some of the fiedls in the view.
      // Two solutions:
      // 1. make personascontodo more comprehensive but then I send too much data
      // 2. extract the ids of all persons in these group and filter accordingly.
      //

      const ids = extractIds(personsDetails);
      // TODO: do we need to check if ids is []? Theoretically this is not possible...
      const placesrelatedraw = await persons
        .aggregate([{ $match: { _id: { $in: ids } } }, ...pl_places_global])
        .toArray();
      const placesrelated = flipCoords(placesrelatedraw);
      // console.log(placesrelated);

      reply.status(200).send({
        personsDetails,
        personsrelations,
        personsrelationstable,
        personsrelationscyto,
        placesrelated,
      });
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });
}

module.exports = routes;
