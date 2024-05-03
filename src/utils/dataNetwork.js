const createDataPlacesNetwork = (data, originalplace) => {
  const nodes = data.map((item, idx) => {
    return {
      id: idx,
      label: item.place,
      shape: item.place === originalplace ? "diamond" : "circle",
    };
  });

  const edges = data.map((item) => {
    return {
      from: nodes.findIndex((node) => node.label === item.place),
      to: nodes.findIndex((node) => node.label === originalplace),
      value: item.totalplaces,
    };
  });

  return { nodes: nodes, edges: edges };
};

module.exports = { createDataPlacesNetwork };
