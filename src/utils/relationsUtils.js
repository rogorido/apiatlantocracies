// we need to format the data for using them in DataTree in primevue.
// The main node needs id, and data
// Then we have children and every children needs id and data.
const { v4: uuidv4 } = require("uuid");

// NOTE:
// Actually we should combine aggOriginsPlaces and aggOriginsCountries
// since the code is repeated. But it is clearer for now so...

const aggOriginsPlaces = async (data) => {
  const result = data.reduce((acc, entry) => {
    const { infOrigin, personsWithRelation } = entry;

    if (!acc[infOrigin]) {
      acc[infOrigin] = {
        placeCounts: {},
        totalPlaces: 0,
      };
    }

    personsWithRelation.forEach((person) => {
      const { placeBirth } = person;

      // Contabilizar placeBirth
      if (placeBirth) {
        acc[infOrigin].placeCounts[placeBirth] =
          (acc[infOrigin].placeCounts[placeBirth] || 0) + 1;

        acc[infOrigin].totalPlaces += 1;
      }
    });

    return acc;
  }, {});

  // console.log(result);
  // Convertir a un array usando Object.entries
  const formattedResult = Object.entries(result).map(([infOrigin, counts]) => ({
    id: uuidv4(),
    data: {
      place: infOrigin === "undefined" ? "No data" : infOrigin,
      count: null,
      percentage: null,
    },
    children: Object.entries(counts.placeCounts).map(([place, count]) => ({
      id: uuidv4(),
      data: {
        place: place,
        count,
        percentage: ((count / counts.totalPlaces) * 100).toFixed(2) + "%",
      },
    })),
  }));
  return formattedResult;
};

const aggOriginsCountries = async (data) => {
  const result = data.reduce((acc, entry) => {
    const { infOrigin, personsWithRelation } = entry;

    if (!acc[infOrigin]) {
      acc[infOrigin] = {
        countryCounts: {},
        totalCountries: 0,
      };
    }

    personsWithRelation.forEach((person) => {
      const { countryBirth } = person;

      // Contabilizar countrieBirth
      if (countryBirth) {
        acc[infOrigin].countryCounts[countryBirth] =
          (acc[infOrigin].countryCounts[countryBirth] || 0) + 1;

        acc[infOrigin].totalCountries += 1;
      }
    });

    return acc;
  }, {});

  // console.log(result);
  // Convertir a un array usando Object.entries
  const formattedResult = Object.entries(result).map(([infOrigin, counts]) => ({
    id: uuidv4(),
    data: {
      place: infOrigin === "undefined" ? "No Data" : infOrigin,
      count: null,
      percentage: null,
    },
    children: Object.entries(counts.countryCounts).map(([country, count]) => ({
      id: uuidv4(),
      data: {
        place: country,
        count,
        percentage: ((count / counts.totalCountries) * 100).toFixed(2) + "%",
      },
    })),
  }));
  return formattedResult;
};

// the same but with histBirth
const aggOriginsHistBirth = async (data) => {
  const result = data.reduce((acc, entry) => {
    const { infOrigin, personsWithRelation } = entry;

    if (!acc[infOrigin]) {
      acc[infOrigin] = {
        countryCounts: {},
        totalCountries: 0,
      };
    }

    personsWithRelation.forEach((person) => {
      // we rename histBirth to countryBirth to use the same code
      const { histBirth: countryBirth } = person;

      // Contabilizar countrieBirth
      if (countryBirth) {
        acc[infOrigin].countryCounts[countryBirth] =
          (acc[infOrigin].countryCounts[countryBirth] || 0) + 1;

        acc[infOrigin].totalCountries += 1;
      }
    });

    return acc;
  }, {});

  // console.log(result);
  // Convertir a un array usando Object.entries
  const formattedResult = Object.entries(result).map(([infOrigin, counts]) => ({
    id: uuidv4(),
    data: {
      place: infOrigin === "undefined" ? "No Data" : infOrigin,
      count: null,
      percentage: null,
    },
    children: Object.entries(counts.countryCounts).map(([country, count]) => ({
      id: uuidv4(),
      data: {
        place: country,
        count,
        percentage: ((count / counts.totalCountries) * 100).toFixed(2) + "%",
      },
    })),
  }));
  // console.log(formattedResult);
  return formattedResult;
};

module.exports = {
  aggOriginsPlaces,
  aggOriginsCountries,
  aggOriginsHistBirth,
};
