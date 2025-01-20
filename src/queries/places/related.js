const { pl_places_global } = require("./places");

// TODO: esta función está repetida. Se tiene que poder sacar.
// TODO: realmente falta eso de Infresidence
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
  const filterCreated = [
    {
      $match: obtenerPipelinePorCiudad(place),
    },
    ...pl_places_global,
  ];
  return filterCreated;
};

module.exports = { pipeline };
