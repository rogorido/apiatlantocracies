// Types of events with frequency
const eventtypes = [
  { $unwind: { path: "$events" } },
  {
    $group: {
      _id: "$events.typeEv",
      total: { $sum: 1 },
    },
  },
  {
    $sort: { total: -1 },
  },
];

const positionstypes = [
  {
    $unwind: {
      path: "$positions",
    },
  },
  {
    $group: {
      _id: "$positions.namePos",
      total: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      total: -1,
    },
  },
];

const relationstypes = [
  {
    $unwind: {
      path: "$relations",
    },
  },
  {
    $group: {
      _id: "$relations.typeRel",
      total: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      total: -1,
    },
  },
];

const titlestypes = [
  {
    $unwind: {
      path: "$titles",
    },
  },
  {
    $group: {
      _id: "$titles.nomTit",
      total: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      total: -1,
    },
  },
];

module.exports = { eventtypes, positionstypes, relationstypes, titlestypes };
