const { macrofilterConverter } = require("../queries/macrofilter/filter");

const { birthYearsBucket } = require("../queries/persons/births");

const { searchSchema } = require("../schemas/schemas");

const {
  createDataChart,
  createDataChartGenders,
  createDataChartHistBirths,
  createDataChartHasTitles,
  createDataChartHasPositions,
} = require("../utils/dataForChart");

const querygen = require("../queries/general");
const querybirths = require("../queries/persons/births");

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
  // const persons = fastify.mongo.atlanto.db.collection("persons");
  const vpersons = fastify.mongo.atlanto.db.collection("vistapersonascontodo");

  // fastify.post("/", searchSchema, async (request, reply) => {
  fastify.post("/", async (request, reply) => {
    try {
      // console.log(request.body);
      const filter = macrofilterConverter(request.body);

      // console.log(filter);

      const result = await vpersons.find(filter).toArray();
      const gendersData = await vpersons
        .aggregate([{ $match: filter }, ...querygen.genders])
        .toArray();

      const histBirthsData = await vpersons
        .aggregate([{ $match: filter }, ...querybirths.histBirth])
        .toArray();

      const hasTitlesData = await vpersons
        .aggregate([{ $match: filter }, ...querygen.hasTitles])
        .toArray();

      const hasPositionsData = await vpersons
        .aggregate([{ $match: filter }, ...querygen.hasPositions])
        .toArray();

      const decadesBirths = await vpersons
        .aggregate([{ $match: filter }, ...birthYearsBucket])
        .toArray();

      //console.log(histBirthsData);

      const gendersChartData = createDataChartGenders(gendersData);
      const histBirthsChartData = createDataChartHistBirths(histBirthsData);
      const hasTitlesChartData = createDataChartHasTitles(hasTitlesData);
      const hasPositionsChartData =
        createDataChartHasPositions(hasPositionsData);
      const decadesBirthsChartData = createDataChart(decadesBirths);
      console.log(decadesBirthsChartData);
      //
      // we extract all positions to create a table of positions
      const positionsTable = await vpersons
        .aggregate([{ $match: filter }, ...querygen.positionsTable])
        .toArray();

      // we extract all positions to create a table of positions
      const positionsTableTree = await vpersons
        .aggregate([{ $match: filter }, ...querygen.positionsTableDesagregated])
        .toArray();

      // console.log(positionsTableTree);

      reply.status(200).send({
        result,
        gendersData,
        gendersChartData,
        histBirthsData,
        histBirthsChartData,
        hasTitlesChartData,
        hasTitlesData,
        hasPositionsChartData,
        hasPositionsData,
        positionsTable,
        positionsTableTree,
        decadesBirthsChartData,
      });
    } catch (error) {
      console.error(error);
      reply.status(500).send("error in the server or in the query");
    }
  });
}

module.exports = routes;
