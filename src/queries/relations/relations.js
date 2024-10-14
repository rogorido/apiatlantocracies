// We have two queries:
// 1. aggregate for concrete relation:
// 2. aggregate of positions.

const aggrelation = (reltype) => {
  const hostias = [
    {
      $unwind: "$relations",
    },
    {
      $match: {
        "relations.typeRel": reltype,
      },
    },
    {
      $group: {
        _id: {
          nameRelationPerson: "$relations.namePerson",
          infOrigin: "$relations.infOrigin",
        },
        totalInformations: {
          $sum: 1,
        },
        positions: {
          $push: "$relations.position",
        },
        titlesInf: {
          $push: "$relations.infTitle",
        },
        placesInf: {
          $push: "$relations.placeRel",
        },
        personsWithRelation: {
          $addToSet: {
            _id: "$_id",
            name: "$name",
            birthdate: "$birthdate",
            birthyear: "$birthyear",
            deathyear: "$deathyear",
            hasFather: "$hasFather",
            hasMother: "$hasMother",
            continentBirth: "$continentBirth",
            countryBirth: "$countryBirth",
            histBirth: "$histBirth",
            placeBirth: "$placeBirth",
            placeDeath: "$placeDeath",
            tiposTitles: "$tiposTitles",
            tiposPositions: "$tiposPositions",
            gender: "$gender",
            wasMarried: "$wasMarried",
            numberofRelations: "$numberofRelations",
            numberofEvents: "$numberofEvents",
            numberofPositions: "$numberofPositions",
            numberofTitles: "$numberofTitles",
            hizoTestamento: "$hizoTestamento",
          },
        },
      },
    },
    {
      $project: {
        _id: "$_id.nameRelationPerson",
        infOrigin: "$_id.infOrigin",
        totalInformations: 1,
        personsWithRelation: 1,
        positions: 1,
        titlesInf: 1,
        placesInf: 1,
        numberOfPersons: {
          $size: "$personsWithRelation",
        },
      },
    },
    {
      $sort: {
        numberOfPersons: -1,
      },
    },
  ];

  // console.log(JSON.stringify(hostias, null, 2));
  return hostias;
};

const aggpositions = (reltype) => {
  const hostias = [
    {
      $unwind: "$relations",
    },
    {
      $match: {
        "relations.typeRel": reltype,
      },
    },
    {
      $group: {
        _id: "$relations.position",
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ];

  // console.log(JSON.stringify(hostias, null, 2));
  return hostias;
};

module.exports = { aggrelation, aggpositions };