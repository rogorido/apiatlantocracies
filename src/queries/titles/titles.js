// We have two queries:
// 1. aggregate for concrete relation:
// 2. aggregate of positions.

const { titleYearsBucket } = require("./yearstitles");

const personsAll = (titletype) => {
  const filterCreated = {
    "titles.nomTit": titletype,
  };

  return filterCreated;
};

const continentsAll = (titletype) => {
  // NOTE: important. we have to do the unwind first, otherwise I get all places
  // of the person, even if they do not have anything to do with the position.
  const filterCreated = [
    {
      $unwind: { path: "$titles" },
    },
    {
      $match: {
        "titles.nomTit": titletype,
      },
    },
    {
      $sortByCount: "$titles.continental",
    },
    {
      $match: { _id: { $ne: null } },
    },
  ];

  return filterCreated;
};

const countriesAll = (titletype) => {
  // NOTE: important. we have to do the unwind first, otherwise I get all places
  // of the person, even if they do not have anything to do with the position.
  const filterCreated = [
    {
      $unwind: { path: "$titles" },
    },
    {
      $match: {
        "titles.nomTit": titletype,
      },
    },
    {
      $sortByCount: "$titles.countryTit",
    },
    {
      $match: { _id: { $ne: null } },
    },
  ];

  return filterCreated;
};

const benefactorsAll = (titletype) => {
  // NOTE: important. we have to do the unwind first, otherwise I get all places
  // of the person, even if they do not have anything to do with the position.
  const filterCreated = [
    {
      $unwind: { path: "$titles" },
    },
    {
      $match: {
        "titles.nomTit": titletype,
      },
    },
    {
      $sortByCount: "$titles.benefactor",
    },
    {
      $match: { _id: { $ne: null } },
    },
  ];

  return filterCreated;
};

const titleDecades = (titletype) => {
  const filterCreated = [
    {
      $unwind: { path: "$titles" },
    },
    {
      $match: {
        "titles.nomTit": titletype,
      },
    },
    ...titleYearsBucket,
  ];

  return filterCreated;
};

module.exports = {
  personsAll,
  continentsAll,
  countriesAll,
  benefactorsAll,
  titleDecades,
};
