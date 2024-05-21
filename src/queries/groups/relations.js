
const cytorelationsfilter = [
  {
    $lookup: {
      from: "vistapersonascontodo", // Nombre de la colección con la que se quiere hacer el join (en este caso, la misma colección)
      localField: "relations.idPerson", // Campo en la colección original que contiene el ID de referencia
      foreignField: "personId", // Campo en la colección "from" que coincide con el ID de referencia
      as: "relationsDetails" // Nombre del nuevo campo que contendrá los documentos unidos
    }
  },
  {
    $addFields: {
      relations: {
        $map: {
          input: "$relations",
          as: "relation",
          in: {
            $mergeObjects: [
              "$$relation",
              {
                $arrayElemAt: [
                  {
                    $map: {
                      input: {
                        $filter: {
                          input:
                            "$relationsDetails",
                          as: "detail",
                          cond: {
                            $eq: [
                              "$$detail.personId",
                              "$$relation.idPerson"
                            ]
                          }
                        }
                      },
                      as: "filteredDetail",
                      in: {
                        _id: "$$filteredDetail._id", // Para mantener la referencia, si es necesario
                        id: "$$filteredDetail._id", // Para mantener la referencia, si es necesario
                        datebirth:
                          "$$filteredDetail.datebirth",
                        gender:
                          "$$filteredDetail.gender",
                        histBirth:
                          "$$filteredDetail.histBirth",
                        placebirth:
                          "$$filteredDetail.placebirth",
                        hasId: "$$filteredDetail.hasId"
                      }
                    }
                  },
                  0
                ]
              }
            ]
          }
        }
      }
    }
  },
  {
    $project: {
      relationsDetails: 0 // Opcional: si no deseas conservar el campo de detalles unido
    }
  }
]

module.exports = { cytorelationsfilter, };

