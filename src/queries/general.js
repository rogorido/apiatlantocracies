// Types of events with frequency
const eventstypes = [
  {
    $unwind: { path: "$events" },
  },
  {
    $sortByCount: "$events.typeEv",
  },
  {
    $match: { _id: { $ne: null } },
  },
];

const positionstypes = [
  {
    $unwind: { path: "$positions" },
  },
  {
    $sortByCount: "$positions.namePos",
  },
  {
    $match: { _id: { $ne: null } },
  },
];

const relationstypes = [
  {
    $unwind: { path: "$relations" },
  },
  {
    $sortByCount: "$relations.typeRel",
  },
  {
    $match: { _id: { $ne: null } },
  },
];

const titlestypes = [
  {
    $unwind: { path: "$titles" },
  },
  {
    $sortByCount: "$titles.nomTit",
  },
  {
    $match: { _id: { $ne: null } },
  },
];

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const genders = [
  {
    $sortByCount: "$gender",
  },
  {
    $project: {
      count: 1,
      gender: "$_id",
      _id: 0,
    },
  },
];

const hasTitles = [
  {
    $sortByCount: "$hasTitles",
  },
  {
    $project: {
      count: 1,
      hasTitles: "$_id",
      _id: 0,
    },
  },
];

const hasPositions = [
  {
    $sortByCount: "$hasPositions",
  },
  {
    $project: {
      count: 1,
      hasPositions: "$_id",
      _id: 0,
    },
  },
];

// we extract all positions to create a table of positions
// this is raw data
const positionsTable = [
  { $unwind: { path: "$positions" } },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: ["$positions"],
      },
    },
  },
];

// positionsTable with data desagregados
const positionsTableDesagregated = [
  { $unwind: { path: "$positions" } },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: ["$positions"],
      },
    },
  },
  {
    $group: {
      _id: {
        namePos: "$namePos",
        countryPos: "$countryPos",
      },
      count: { $sum: 1 },
    },
  },
  {
    $group: {
      _id: "$_id.namePos",
      total: { $sum: "$count" },
      children: {
        $push: {
          key: { $toString: "$_id.countryPos" },
          data: {
            name: "$_id.countryPos",
            count: "$count",
          },
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      key: { $toString: "$_id" },
      data: {
        name: "$_id",
        count: "$total",
      },
      children: 1,
    },
  },
  {
    $project: {
      key: 1,
      data: 1,
      children: {
        $map: {
          input: "$children",
          as: "child",
          in: {
            key: "$$child.key",
            data: "$$child.data",
          },
        },
      },
    },
  },
];

module.exports = {
  eventstypes,
  positionstypes,
  relationstypes,
  titlestypes,
  genders,
  hasTitles,
  hasPositions,
  positionsTable,
  positionsTableDesagregated,
};
