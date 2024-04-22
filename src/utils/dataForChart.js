/**
 * Generates data for a chart based on the input data.
 *
 * @param {Array} datos - The input data array
 * @return {Object} The chart data object
 */
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
  createCoordinates,
};
