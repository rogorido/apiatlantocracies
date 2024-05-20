const { personDetails, cojones, probar1 } = require("../utils/personDetalis");
const { createDataTimeline } = require("../utils/dataTimelne");
const { createDataPersonsNetwork } = require("../utils/personNetwork");
const { ObjectId } = require("mongodb");

const { pipeline } = require("../queries/macrofilter/filter");

// const { placeSchema } = require("../schemas/schemas");

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
  const persons = fastify.mongo.atlanto.db.collection("persons");
  const vpersons = fastify.mongo.atlanto.db.collection("vistapersonascontodo");

  fastify.post("/", async (request, reply) => {
    try {
      console.log(request.body);
      const filter = pipeline(request.body);

      console.log(filter);

      const result = await vpersons.find(filter).toArray();

      // result.forEach((person) => {
      //   // personDetails(person);
      //   cojones(person);
      //   console.log(JSON.stringify(person, null, 2));
      // });

      // result.forEach(cojones);
      // result.forEach((person) => {
      //   person = probar1(
      //     person
      //   );
      // });

      const personsDetails = result.map((person) => {
        return personDetails(person);
      });

      // console.log(result);

      reply.status(200).send({
        personsDetails,
      });
    } catch (error) {
      console.error(error);
      reply.status(500).send("error en el servidor o en la consulta");
    }
  });

  fastify.get("/personsbyid/:id", async (request, reply) => {
    const { id } = request.params;

    if (!id) {
      return reply.status(500).send("error en el servidor o en la consulta");
    }

    try {
      const result = await vpersons.findOne({ _id: new ObjectId(id) });

      // we add details about years in relations, etc.
      const persondetails = personDetails(result);

      // we create a timeline
      const personeventstimeline = createDataTimeline(persondetails);

      // we create network
      const personnetwork = createDataPersonsNetwork(
        persondetails.relations,
        persondetails.name
      );

      return reply
        .status(200)
        .send({ persondetails, personeventstimeline, personnetwork });
    } catch (error) {
      console.error(error);
      return reply.status(500).send("error en el servidor o en la consulta");
    }
  });

}

module.exports = routes;
