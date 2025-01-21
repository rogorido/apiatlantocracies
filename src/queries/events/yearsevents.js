// Most of this code is repeated in persons/birthyears.js!
//
// Calcular el número de intervalos
const startYear = 1400;
const endYear = 1900;
const interval = 10;
const numberOfIntervals = Math.ceil((endYear - startYear) / interval);

// Generar el array de boundaries
const boundaries = Array.from(
  { length: numberOfIntervals },
  (_, index) => startYear + interval * index,
);

// Añadir el último valor al array de boundaries para incluir todos los documentos mayores al último boundary
boundaries.push(endYear + 1);

const bucketEventYears = {
  $bucket: {
    groupBy: "$events.dateEvYear", // Field to group by
    // boundaries: [ 1540, 1550, 1560, 1570, 1580, 1590, 1600, 1610 ], // Boundaries for the buckets
    boundaries: boundaries,
    default: "Other", // Bucket ID for documents which do not fall into a bucket
    output: {
      // Output for each bucket
      countNacimientos: { $sum: 1 },
    },
  },
};

const eventYearsBucket = [
  {
    $match: {
      "events.dateEvYear": {
        $exists: true,
      },
    },
  },
  bucketEventYears,
  {
    $set: {
      decada: "$_id",
    },
  },
];

module.exports = { eventYearsBucket };
