const qtitles = require("../queries/titles/titles");
const { calculatePercentages } = require("../utils/percentages");
const { macroTableFields } = require("../queries/macrofilter/filter");

async function routes(fastify, options) {
  const vpersons = fastify.mongo.atlanto.db.collection("vistapersonascontodo");

  fastify.get("/:titletype", async (request, reply) => {
    const { titletype } = request.params;

    try {
      const personsAll = await vpersons
        .find(qtitles.personsAll(titletype))
        .project(macroTableFields)
        .toArray();

      const continentsAllRaw = await vpersons
        .aggregate(qtitles.continentsAll(titletype))
        .toArray();

      const countriesAllRaw = await vpersons
        .aggregate(qtitles.countriesAll(titletype))
        .toArray();

      // TODO: we get an _id: we should search for the person!
      const benefactorsAllRaw = await vpersons
        .aggregate(qtitles.benefactorsAll(titletype))
        .toArray();

      const titleDecades = await vpersons
        .aggregate(qtitles.titleDecades(titletype))
        .toArray();

      const continentsAll = calculatePercentages(continentsAllRaw);
      const countriesAll = calculatePercentages(countriesAllRaw);
      const benefactorsAll = calculatePercentages(benefactorsAllRaw);

      reply.status(200).send({
        personsAll,
        continentsAll,
        countriesAll,
        benefactorsAll,
        titleDecades,
      });
    } catch (error) {
      console.error(error);
      reply.status(500).send("Error in the server or in the query");
    }
  });
}

module.exports = routes;
