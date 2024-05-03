// TODO: actually we cound make this more general and a function
// since there is a lot of repeated code...

const relationsFields = [
  {
    $unwind: "$relations",
  },
  {
    $project: {
      eventFields: {
        $objectToArray: "$relations",
      },
    },
  },
  {
    $unwind: "$eventFields",
  },
  {
    $sortByCount: "$eventFields.k",
  },
];

const eventsFields = [
  {
    $unwind: "$events",
  },
  {
    $project: {
      eventFields: {
        $objectToArray: "$events",
      },
    },
  },
  {
    $unwind: "$eventFields",
  },
  {
    $sortByCount: "$eventFields.k",
  },
];

const titlesFields = [
  {
    $unwind: "$titles",
  },
  {
    $project: {
      eventFields: {
        $objectToArray: "$titles",
      },
    },
  },
  {
    $unwind: "$eventFields",
  },
  {
    $sortByCount: "$eventFields.k",
  },
];

const positionsFields = [
  {
    $unwind: "$positions",
  },
  {
    $project: {
      eventFields: {
        $objectToArray: "$positions",
      },
    },
  },
  {
    $unwind: "$eventFields",
  },
  {
    $sortByCount: "$eventFields.k",
  },
];

module.exports = {
  relationsFields,
  eventsFields,
  positionsFields,
  titlesFields,
};
