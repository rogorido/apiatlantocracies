// const { generalview } = require("./generalview");

// TODO: esto realmente supone que coge solo los eventos que acontecen en la ciudad
// ie, no coge

// TODO: esto no es del todo eficaz pues coge todos los campos, etc.
// quiza se pueda meter otro campo con todos los lugares de evnetos, etc.
// pero eso parece repetir mucho...

const pipeline = (place) => {
  const hostias = [
    {
      $match: { "events.placeEv": place },
    },
    { $unwind: "$events" },
    { $sortByCount: "$events.typeEv" },
  ];
  // console.log(JSON.stringify(hostias, null, 2));
  return hostias;
};

module.exports = { pipeline };
