const crypto = require("crypto");

// Idea from chapgpt.
// We have to generate a ID (have we?) for the persons which do not have ID
// for the cyto graph.
function generateRandomId(length) {
  // Generate a random buffer and convert it to a hexadecimal string
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

// NOTE: creo q esto ahora no lo estoy usando, sino la siguiente función.
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

// Network for using in cytoscape graph.
// TODO: add more fields to the nodes?
const createPersonsNetworkCyto = async (data, db) => {
  let nodes = [];
  let edges = [];

  const persons = db.collection("persons");

  // first the main persons
  data.map((item) => {
    nodes.push({
      data: {
        id: item._id,
        label: item.name,
        type: "mainperson",
      },
      classes: [item.gender, "mainperson"],
    });

    // primero añadimos las relations que están en el subdocument relations.
    if (Array.isArray(item.relations) && item.relations.length > 0) {
      item.relations.map((relation) => {
        // the problem is that there are errors in the DB: some people
        // in the relations have a personId field but there are not really in the DB
        // Therefore we need to check if the relation has the ID field
        if (relation.hasId && relation._id) {
          relation.ownid = generateRandomId(18);
          nodes.push({
            data: relation,
            classes: [relation.gender, "relatedPerson"],
          });
        } else {
          relation.id = generateRandomId(18);

          nodes.push({
            data: relation,
            classes: [relation.gender, "relatedPerson"],
          });
        }
        // we add finally the edge...
        // relation.typeRelation = relation.typeRel.replace(/\s+/g, "");
        relation.typeRelation =
          relation.typeRel?.replace(/\s+/g, "") ?? "Not defined";

        edges.push({
          data: {
            source: item._id,
            target: relation.id,
            type: relation.typeRel,
          },
          classes: [relation.typeRelation],
        });
      });
    }

    // NOTE: why do I need this?
    return {};
  });

  return { nodes: nodes, edges: edges };
};

const createPersonsNetworkTable = async (data) => {
  const network = [];

  // We generate an ID which is useful for the datatable in the backend.
  data.map((item) => {
    if (Array.isArray(item.relations) && item.relations.length > 0) {
      item.relations.map((relation) => {
        let newnetworkitem = {
          idItem: generateRandomId(8),
          idMainPerson: item._id,
          nameMainPerson: item.name,
          genderMainPerson: item.gender,
          histBirthMainPerson: item.histBirth,
          typeRelation: relation.typeRel,
          namePersonRelated: relation.namePerson,
          placeRelation: relation.placeRel,
          positionRelation: relation.position,
          histBirthRelated: relation.histBirth,
        };

        network.push(newnetworkitem);
      });
      return {};
    }
  });
  return network;
};

function extractIds(data) {
  let ids = [];
  data.map((item) => {
    ids.push(item._id);
    if (Array.isArray(item.relations) && item.relations.length > 0) {
      item.relations.map((relation) => {
        ids.push(relation._id);
      });
      return {};
    }
    return {};
  });
  return ids;
}

module.exports = {
  createDataPersonsNetwork,
  createPersonsNetworkCyto,
  createPersonsNetworkTable,
  extractIds,
};
