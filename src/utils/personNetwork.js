// TODO: faltarían añadir padres, madres, etc.
// Cogemos por ahora solo las personas de las relaciones
const createDataPersonsNetwork = (data, originalperson) => {
  let nodes = [];
  let edges = [];
  nodes.push({
    id: 0,
    label: originalperson,
    shape: "diamond",
  });

  // We have to check if data is an array and is not empty
  if (Array.isArray(data) && data.length > 0) {
    data.map((item, idx) => {
      nodes.push({
        id: idx + 1,
        label: item.namePerson,
        shape: "circle",
      });
      // NOTE: why do I need this?
      return {};
    });

    data.map((item) => {
      edges.push({
        from: nodes.findIndex((node) => node.label === item.namePerson),
        to: 0,
      });
      // NOTE: why do I need this? Again...
      return {};
    });
  }

  return { nodes: nodes, edges: edges };
};

module.exports = { createDataPersonsNetwork };
