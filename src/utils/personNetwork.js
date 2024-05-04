// TODO: faltarían añadir padres, madres, etc.
// Cogemos por ahora solo las personas de las relaciones
const createDataPersonsNetwork = (data, originalperson) => {
  let nodes = [];
  nodes.push({
    id: 0,
    label: originalperson,
    shape: "diamond",
  });

  data.map((item, idx) => {
    nodes.push({
      id: idx + 1,
      label: item.namePerson,
      shape: "circle",
    });
    return {};
  });

  const edges = data.map((item) => {
    return {
      from: nodes.findIndex((node) => node.label === item.namePerson),
      to: 0,
    };
  });

  return { nodes: nodes, edges: edges };
};

module.exports = { createDataPersonsNetwork };
