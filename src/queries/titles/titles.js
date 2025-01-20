// We have two queries:
// 1. aggregate for concrete relation:
// 2. aggregate of positions.

const { titlescontinents } = require("../general");
const { titleYearsBucket } = require("./yearstitles");

const personsAll = (titletype) => {
  const filterCreated = {
    "titles.nomTit": titletype,
  };

  return filterCreated;
};

const continentsAll = (titletype) => {
  const filterCreated = [
    {
      $match: {
        "titles.nomTit": titletype,
      },
    },
    ...titlescontinents,
  ];

  return filterCreated;
};

const countriesAll = (titletype) => {
  const filterCreated = [
    {
      $match: {
        "titles.nomTit": titletype,
      },
    },
    {
      $unwind: { path: "$titles" },
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
  const filterCreated = [
    {
      $match: {
        "titles.nomTit": titletype,
      },
    },
    {
      $unwind: { path: "$titles" },
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
      $match: {
        "titles.nomTit": titletype,
      },
    },
    {
      $unwind: { path: "$titles" },
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
