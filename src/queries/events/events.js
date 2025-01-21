// We have two queries:
// 1. aggregate for concrete relation:
// 2. aggregate of positions.

const { eventYearsBucket } = require("./yearsevents");

const personsAll = (eventtype) => {
  const filterCreated = {
    "events.typeEv": eventtype,
  };

  return filterCreated;
};

const placesAll = (eventtype) => {
  const filterCreated = [
    {
      $match: {
        "events.typeEv": eventtype,
      },
    },
    {
      $unwind: { path: "$events" },
    },
    {
      $sortByCount: "$events.placeEv",
    },
    {
      $match: { _id: { $ne: null } },
    },
  ];

  return filterCreated;
};

const eventDecades = (eventtype) => {
  const filterCreated = [
    {
      $match: {
        "events.typeEv": eventtype,
      },
    },
    {
      $unwind: { path: "$events" },
    },
    ...eventYearsBucket,
  ];

  return filterCreated;
};

module.exports = {
  personsAll,
  placesAll,
  eventDecades,
};
