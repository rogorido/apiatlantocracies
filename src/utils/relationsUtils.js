const aggOrigins = async (data) => {
  const result = data.reduce((acc, entry) => {
    const { infOrigin, personsWithRelation } = entry;

    if (!acc[infOrigin]) {
      acc[infOrigin] = {
        placeCounts: {},
        countryCounts: {},
        totalPlaces: 0,
        totalCountries: 0,
      };
    }

    personsWithRelation.forEach((person) => {
      const { placeBirth, countryBirth } = person;

      // Contabilizar placeBirth
      if (placeBirth) {
        acc[infOrigin].placeCounts[placeBirth] =
          (acc[infOrigin].placeCounts[placeBirth] || 0) + 1;

        acc[infOrigin].totalPlaces += 1;
      }

      // Contabilizar countryBirth
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
    infOrigin,
    placeCounts: Object.entries(counts.placeCounts).map(([place, count]) => ({
      placeBirth: place,
      count,
      percentage: ((count / counts.totalPlaces) * 100).toFixed(2) + "%",
    })),
    countryCounts: Object.entries(counts.countryCounts).map(
      ([country, count]) => ({
        countryBirth: country,
        count,
        percentage: ((count / counts.totalCountries) * 100).toFixed(2) + "%",
      }),
    ),
  }));
  return formattedResult;
};

module.exports = {
  aggOrigins,
};
