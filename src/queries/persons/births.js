/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const histBirth = [
  {
    $sortByCount: "$histBirth",
  },
  {
    $match: { _id: { $ne: null } },
  },
];

// NOTE: not used now. Integrated in the view vistapersonas as birthyear
function extraerAnio(fecha) {
  return {
    $toInt: {
      $cond: [
        { $eq: [{ $toLower: { $substr: [fecha, 0, 1] } }, "c"] },
        { $substr: [fecha, 1, -1] }, // Eliminar el primer carácter "c"
        {
          $cond: [
            { $eq: [{ $substr: [fecha, 4, 1] }, "-"] },
            { $substr: [fecha, 0, 4] }, // Formato YYYY-MM o YYYY-MM-DD
            fecha, // Formato YYYY
          ],
        },
      ],
    },
  };
}

// Calcular el número de intervalos
const startYear = 1500;
const endYear = 1800;
const interval = 10;
const numberOfIntervals = Math.ceil((endYear - startYear) / interval);

// Generar el array de boundaries
const boundaries = Array.from(
  { length: numberOfIntervals },
  (_, index) => startYear + interval * index,
);

// Añadir el último valor al array de boundaries para incluir todos los documentos mayores al último boundary
boundaries.push(endYear + 1);

const bucketBirthYears = {
  $bucket: {
    groupBy: "$birthYear", // Field to group by
    // boundaries: [ 1540, 1550, 1560, 1570, 1580, 1590, 1600, 1610 ], // Boundaries for the buckets
    boundaries: boundaries,
    default: "Other", // Bucket ID for documents which do not fall into a bucket
    output: {
      // Output for each bucket
      countNacimientos: { $sum: 1 },
    },
  },
};

const birthYearsBucket = [
  {
    $match: {
      datebirth: {
        $exists: true,
      },
    },
  },
  bucketBirthYears,
  {
    $set: {
      decada: "$_id",
    },
  },
];

module.exports = { histBirth, birthYearsBucket };
