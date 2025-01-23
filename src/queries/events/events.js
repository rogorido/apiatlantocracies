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
  // NOTE: important. we have to do the unwind first, otherwise I get all places
  // of the person, even if they do not have anything to do with the position.
  const filterCreated = [
    {
      $unwind: { path: "$events" },
    },
    {
      $match: {
        "events.typeEv": eventtype,
      },
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
