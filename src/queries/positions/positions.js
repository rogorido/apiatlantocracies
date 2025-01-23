const personsAll = (positiontype) => {
  const filterCreated = {
    "positions.namePos": positiontype,
  };

  return filterCreated;
};

const countriesAll = (positiontype) => {
  // NOTE: important. we have to do the unwind first, otherwise I get all countries
  // of the person, even if they do not have anything to do with the position.
  const filterCreated = [
    {
      $unwind: { path: "$positions" },
    },
    {
      $match: {
        "positions.namePos": positiontype,
      },
    },
    {
      $sortByCount: "$positions.countryPos",
    },
    {
      $match: { _id: { $ne: null } },
    },
  ];

  return filterCreated;
};

const placesAll = (positiontype) => {
  // NOTE: important. we have to do the unwind first, otherwise I get all places
  // of the person, even if they do not have anything to do with the position.
  const filterCreated = [
    {
      $unwind: { path: "$positions" },
    },
    {
      $match: {
        "positions.namePos": positiontype,
      },
    },
    {
      $sortByCount: "$positions.placePos",
    },
    {
      $match: { _id: { $ne: null } },
    },
  ];

  return filterCreated;
};

module.exports = {
  personsAll,
  placesAll,
  countriesAll,
};
