const { personDetails } = require("../utils/personDetalis");

const {
  macrofilterConverter,
  macroTableFields,
} = require("../queries/macrofilter/filter");
const { cytorelationsfilter } = require("../queries/groups/relations");
const { pl_places_global } = require("../queries/places/places");
const { flipCoords } = require("../utils/coordsFlipped");

const {
  createPersonsNetworkCyto,
  createPersonsNetworkTable,
  extractIds,
} = require("../utils/personNetwork");

async function routes(fastify, options) {
  const persons = fastify.mongo.atlanto.db.collection("persons");
  const vpersons = fastify.mongo.atlanto.db.collection("vistapersonascontodo");

  fastify.post("/", async (request, reply) => {
    try {
      const filter = macrofilterConverter(request.body);

      // TODO: we are making this query 2x which is not a good idea
      // 1. in the search page
      // 2. in the groups page (that is, here)
      //
      // The problem: I have to do a loop with map for adding
      // the details...
      //
      // What could be the best solution?

      const result = await vpersons
        .find(filter)
        .project(macroTableFields)
        .toArray();

      // we calculate the cytoscape graph
      const personsRelations = await vpersons
        .aggregate([{ $match: filter }, ...cytorelationsfilter])
        .toArray();
      const personsRelationsDetails = personsRelations.map((person) => {
        return personDetails(person);
      });
      const personsRelationsCyto = await createPersonsNetworkCyto(
        personsRelationsDetails,
        fastify.mongo.atlanto.db,
      );

      // transform the data into a table format for use in the frontend.
      const personsRelationsTable = await createPersonsNetworkTable(
        personsRelationsDetails,
      );

      // NOTE: this is not a good solution. The problem is that we need the collection persons since
      // there are all relations, etc. And not in the view personascontodo. But we can not use
      // the filter with persons since it lacks some of the fiedls in the view.
      // Two solutions:
      // 1. make personascontodo more comprehensive but then I send too much data
      // 2. extract the ids of all persons in these group and filter accordingly.
      //

      const ids = extractIds(result);
      // TODO: do we need to check if ids is []? Theoretically this is not possible...
      const placesRelatedRaw = await persons
        .aggregate([{ $match: { _id: { $in: ids } } }, ...pl_places_global])
        .toArray();
      const placesRelated = flipCoords(placesRelatedRaw);
      // console.log(placesrelated);

      reply.status(200).send({
        personsDetails: result,
        personsRelationsTable,
        personsRelationsCyto,
        placesRelated,
        filter,
      });
    } catch (error) {
      console.error(error);
      reply.status(500).send("Error in the server or in the query");
    }
  });
}

module.exports = routes;
