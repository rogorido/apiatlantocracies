/**
 * Generates data for a chart based on the input data.
 *
 * @param {Array} datos - The input data array
 * @return {Object} The chart data object
 */

// TODO: hay que cambiar el nombre de esta función pq así no es buen nombre
const createDataChart = (datos) => {
  const etiquetas = datos.map((valor) => valor._id);

  // Converts avgTemp property to a number
  const v_total = datos.map((valor) => +valor.countNacimientos);

  const totales = {
    label: "Totales",
    backgroundColor: "#f87979",
    data: v_total,
  };

  const chartData = {
    labels: etiquetas,
    datasets: [totales],
  };

  return chartData;
};

// TODO: this is repeated code!!
const createDataChartGenders = (data) => {
  const etiquetas = data.map((item) => item.gender);
  const v_total = data.map((item) => +item.count);

  const totales = {
    label: "Totals",
    data: v_total,
  };

  const chartData = {
    labels: etiquetas,
    datasets: [totales],
  };

  return chartData;
};

// TODO: this is repeated code!! Y sto lo estoy usando par otras cosas
const createDataChartHistBirths = (data) => {
  const etiquetas = data.map((item) => item._id);
  const v_total = data.map((item) => +item.count);

  const totales = {
    label: "Totals",
    data: v_total,
  };

  const chartData = {
    labels: etiquetas,
    datasets: [totales],
  };

  return chartData;
};

// TODO: repetido! de gender almenos...
const createDataChartHasTitles = (data) => {
  const etiquetas = data.map((item) => item.hasTitles);
  const v_total = data.map((item) => +item.count);

  const totales = {
    label: "Totals",
    data: v_total,
  };

  const chartData = {
    labels: etiquetas,
    datasets: [totales],
  };

  return chartData;
};

/**
 * Creates coordinates from the given data.
 *
 * @param {Array} data - The input data for creating coordinates
 * @return {Array} The array of coordinates
 */
const createCoordinates = (data) => {
  const general = data.map((valor) => [valor.londec, valor.latdec]);

  return general;
};

module.exports = {
  createDataChart,
  createDataChartGenders,
  createDataChartHistBirths,
  createDataChartHasTitles,
  createCoordinates,
};
