// TODO: aquí hay mucho código repetido...

const calculatePercentages = (data) => {
  if (Array.isArray(data.gendersData)) {
    const total = data.gendersData.reduce((total, obj) => total + obj.count, 0);
    data.gendersData.forEach((obj) => {
      let porcentaje = (obj.count / total) * 100;
      obj.percent = porcentaje.toFixed(2);
    });
  }

  // sources data
  if (Array.isArray(data.sourcesData)) {
    const total = data.sourcesData.reduce((total, obj) => total + obj.count, 0);
    data.sourcesData.forEach((obj) => {
      let porcentaje = (obj.count / total) * 100;
      obj.percent = porcentaje.toFixed(2);
    });
  }

  // histBirthsData
  if (Array.isArray(data.histBirthsData)) {
    const sumaTotal = data.histBirthsData.reduce(
      (total, obj) => total + obj.count,
      0,
    );

    // Calcular el porcentaje para cada objeto en el array
    data.histBirthsData.forEach((obj) => {
      let porcentaje = (obj.count / sumaTotal) * 100;
      obj.percent = porcentaje.toFixed(2);
    });
  }

  if (Array.isArray(data.hasTitlesData)) {
    const sumaTotal = data.hasTitlesData.reduce(
      (total, obj) => total + obj.count,
      0,
    );

    // Calcular el porcentaje para cada objeto en el array
    data.hasTitlesData.forEach((obj) => {
      let porcentaje = (obj.count / sumaTotal) * 100;
      obj.percent = porcentaje.toFixed(2);
    });
  }

  // positions
  if (Array.isArray(data.hasPositionsData)) {
    const sumaTotal = data.hasPositionsData.reduce(
      (total, obj) => total + obj.count,
      0,
    );

    // Calcular el porcentaje para cada objeto en el array
    data.hasPositionsData.forEach((obj) => {
      let porcentaje = (obj.count / sumaTotal) * 100;
      obj.percent = porcentaje.toFixed(2);
    });
  }

  return data;
};

module.exports = { calculatePercentages };
