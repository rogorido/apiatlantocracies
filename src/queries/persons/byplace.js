const { generalview } = require("./generalview");

function obtenerPipelinePorCiudad(ciudad) {
  return {
    $or: [
      { placebirth: ciudad },
      { placedeath: ciudad },
      { "events.placeEv": ciudad },
      { "positions.placePos": ciudad },
      { "relations.placeRel": ciudad },
    ],
  };
}

//
// TODO: esto no es del todo eficaz pues coge todos los campos, etc.
// quiza se pueda meter otro campo con todos los lugares de evnetos, etc.
// pero eso parece repetir mucho...
const pipeline = (place) => {
  const hostias = [
    ...generalview,
    {
      $match: obtenerPipelinePorCiudad(place),
    },
    {
      $project: {
        events: 0,
        relations: 0,
        positions: 0,
        titles: 0,
      },
    },
  ];
  // console.log(JSON.stringify(hostias, null, 2));
  return hostias;
};

module.exports = { pipeline };
