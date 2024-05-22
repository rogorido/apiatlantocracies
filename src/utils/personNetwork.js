const crypto = require('crypto');

// Idea from chapgpt. 
// We have to generate a ID (have we?) for the persons which do not have ID 
// for the cyto graph.
function generateRandomId(length) {
  // Generate a random buffer and convert it to a hexadecimal string
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

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

const createPersonsNetworkCyto = (data) => {
  let nodes = [];
  let edges = [];

  // first the main persons
  data.map((item) => {
    nodes.push({
      data: {
        id: item._id,
        label: item.name,
      },
      classes: [item.gender, "mainperson"],
    });

    if (Array.isArray(item.relations) && item.relations.length > 0) {
      item.relations.map((relation) => {
        // the problem is that there are errors in the DB: some people 
        // in the relations have a personId field but there are not really in the DB 
        // Therefore we need to check if the relation has the ID field
        if (relation.hasId && relation._id) {
          relation.ownid = generateRandomId(18);
          nodes.push({
            data: relation,
            classes: [relation.gender, "relatedPerson"]
          });

        } else {
          relation.id = generateRandomId(18);

          nodes.push({
            data: relation, classes: [relation.gender, "relatedPerson"],
          });
        }
        // we add finally the edge...
        relation.typeRelation = relation.typeRel.replace(/\s+/g, '')
        edges.push({
          data: { source: item._id, target: relation.id, type: relation.typeRel }, classes: [relation.typeRelation]
        })
      });
    }

    // NOTE: why do I need this?
    return {};
  });

  return { nodes: nodes, edges: edges };
};

module.exports = { createDataPersonsNetwork, createPersonsNetworkCyto };
