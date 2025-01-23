const {
  macrofilterConverter,
  macroTableFields,
} = require("../queries/macrofilter/filter");

const { birthYearsBucket } = require("../queries/persons/births");

const { searchSchema } = require("../schemas/schemas");

const {
  createdecadesBirthsChart,
  createDataChartSources,
  createDataChartGenders,
  createDataChartHistBirths,
  createDataChartHasTitles,
  createDataChartHasPositions,
} = require("../utils/dataForChart");

const { calculatePercentages } = require("../utils/percentages");

const querygen = require("../queries/general");
const querybirths = require("../queries/persons/births");

async function routes(fastify, options) {
  // const persons = fastify.mongo.atlanto.db.collection("persons");
  const vpersons = fastify.mongo.atlanto.db.collection("vistapersonascontodo");

  // fastify.post("/", searchSchema, async (request, reply) => {
  fastify.post("/", async (request, reply) => {
    try {
      const filter = macrofilterConverter(request.body);

      const result = await vpersons
        .find(filter)
        .project(macroTableFields)
        .toArray();
      const gendersData = await vpersons
        .aggregate([{ $match: filter }, ...querygen.genders])
        .toArray();

      const histBirthsData = await vpersons
        .aggregate([{ $match: filter }, ...querybirths.histBirth])
        .toArray();

      const hasTitlesData = await vpersons
        .aggregate([{ $match: filter }, ...querygen.hasTitles])
        .toArray();

      const sourcesData = await vpersons
        .aggregate([{ $match: filter }, ...querygen.sources])
        .toArray();

      const hasPositionsData = await vpersons
        .aggregate([{ $match: filter }, ...querygen.hasPositions])
        .toArray();

      const decadesBirths = await vpersons
        .aggregate([{ $match: filter }, ...birthYearsBucket])
        .toArray();

      //console.log(histBirthsData);

      const sourcesChartData = createDataChartSources(sourcesData);
      const gendersChartData = createDataChartGenders(gendersData);
      const histBirthsChartData = createDataChartHistBirths(histBirthsData);
      const hasTitlesChartData = createDataChartHasTitles(hasTitlesData);
      const hasPositionsChartData =
        createDataChartHasPositions(hasPositionsData);

      const decadesBirthsChartData = createdecadesBirthsChart(decadesBirths);
      // console.log(decadesBirthsChartData);
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

      // NOTE: there is for sure a better way to do this!
      const insightsData = calculatePercentages({
        gendersData,
        sourcesData,
        histBirthsData,
        hasTitlesData,
        hasPositionsData,
      });

      insightsData.sourcesChartData = sourcesChartData;
      insightsData.gendersChartData = gendersChartData;
      insightsData.histBirthsChartData = histBirthsChartData;
      insightsData.hasTitlesChartData = hasTitlesChartData;
      insightsData.hasPositionsChartData = hasPositionsChartData;
      insightsData.positionsTable = positionsTable;
      insightsData.positionsTableTree = positionsTableTree;
      insightsData.decadesBirthsChartData = decadesBirthsChartData;

      reply.status(200).send({
        result,
        insightsData,
        filter,
      });
    } catch (error) {
      console.error(error);
      reply.status(500).send("Error in the server or in the query");
    }
  });
}

module.exports = routes;
