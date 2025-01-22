const personsAll = (positiontype) => {
  const filterCreated = {
    "positions.namePos": positiontype,
  };

  return filterCreated;
};

const countriesAll = (positiontype) => {
  const filterCreated = [
    {
      $match: {
        "positions.namePos": positiontype,
      },
    },
    {
      $unwind: { path: "$positions" },
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
  const filterCreated = [
    {
      $match: {
        "positions.namePos": positiontype,
      },
    },
    {
      $unwind: { path: "$positions" },
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
