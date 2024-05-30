const { macrofilterConverter } = require("../queries/macrofilter/filter");

const { birthYearsBucket } = require("../queries/persons/births");

const { postSchema, postUserSchema } = require("../schemas/schemas");

const {
  createDataChart,
  createDataChartGenders,
  createDataChartHistBirths,
  createDataChartHasTitles,
  createDataChartHasPositions,
} = require("../utils/dataForChart");

// TODO: mejorar este sistema
const q = require("../queries/general");
const qq = require("../queries/persons/births");

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
  // const persons = fastify.mongo.atlanto.db.collection("persons");
  const vpersons = fastify.mongo.atlanto.db.collection("vistapersonascontodo");

  //fastify.post("/", { schema: postUserSchema }, async (request, reply) => {
  fastify.post("/", async (request, reply) => {
    try {
      console.log(request.body);
      const filter = macrofilterConverter(request.body);

      console.log(filter);

      const result = await vpersons.find(filter).toArray();
      const gendersData = await vpersons
        .aggregate([{ $match: filter }, ...q.genders])
        .toArray();

      const histBirthsData = await vpersons
        .aggregate([{ $match: filter }, ...qq.histBirth])
        .toArray();

      const hasTitlesData = await vpersons
        .aggregate([{ $match: filter }, ...q.hasTitles])
        .toArray();

      const hasPositionsData = await vpersons
        .aggregate([{ $match: filter }, ...q.hasPositions])
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

      console.log(hasTitlesData);
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
        decadesBirthsChartData,
      });
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });
}

module.exports = routes;
