const pipeline = (reltype) => {
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
        _id: "$relations.namePerson",
        totalInformants: {
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
            birthdate: "$birthdate",
            gender: "$gender",
          },
        },
      },
    },
    {
      $project: {
        totalInformants: 1,
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

  console.log(JSON.stringify(hostias, null, 2));
  return hostias;
};

module.exports = { pipeline };
