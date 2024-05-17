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

module.exports = {
  eventstypes,
  positionstypes,
  relationstypes,
  titlestypes,
  genders,
  hasTitles,
};
