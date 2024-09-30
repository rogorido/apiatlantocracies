const cytorelationsfilter = [
  {
    $lookup: {
      from: "vistapersonascontodo", // Nombre de la colección con la que se quiere hacer el join (en este caso, la misma colección)
      localField: "relations.idPerson", // Campo en la colección original que contiene el ID de referencia
      foreignField: "personId", // Campo en la colección "from" que coincide con el ID de referencia
      as: "relationsDetails", // Nombre del nuevo campo que contendrá los documentos unidos
    },
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
                          input: "$relationsDetails",
                          as: "detail",
                          cond: {
                            $eq: ["$$detail.personId", "$$relation.idPerson"],
                          },
                        },
                      },
                      as: "filteredDetail",
                      in: {
                        _id: "$$filteredDetail._id", // Para mantener la referencia, si es necesario
                        id: "$$filteredDetail._id", // Para mantener la referencia, si es necesario
                        datebirth: "$$filteredDetail.datebirth",
                        gender: "$$filteredDetail.gender",
                        histBirth: "$$filteredDetail.histBirth",
                        placebirth: "$$filteredDetail.placebirth",
                        hasId: "$$filteredDetail.hasId",
                      },
                    },
                  },
                  0,
                ],
              },
            ],
          },
        },
      },
    },
  },
  {
    // Segundo lookup para la relación padre (basado en idFather)
    $lookup: {
      from: "persons", // Colección de personas (misma colección)
      localField: "idFather", // Campo que apunta al padre
      foreignField: "personId", // ID del documento del padre
      as: "fatherDetails", // Nombre del array donde se agrega la información del padre
    },
  },
  {
    // Añadir la relación padre al array relations
    $addFields: {
      relations: {
        $concatArrays: [
          "$relations", // Mantener las relaciones actuales
          {
            $map: {
              input: "$fatherDetails",
              as: "father",
              in: {
                _id: "$$father._id", // Para mantener la referencia, si es necesario
                id: "$$father._id", // Para mantener la referencia, si es necesario
                typeRel: "father", // Tipo de relación como "father"
                relatedPerson: "$$father.personId", // ID del padre
                namePerson: "$$father.namePerson",
                gender: "$$father.gender",
                datebirth: "$$father.datebirth",
                gender: "$$father.gender",
                histBirth: "$$father.histBirth",
                placebirth: "$$father.placebirth",
              },
            },
          },
        ],
      },
    },
  },
  {
    // Tercer lookup para la relación madre (basado en idMother)
    $lookup: {
      from: "persons", // Colección de personas (misma colección)
      localField: "idMother", // Campo que apunta al padre
      foreignField: "personId", // ID del documento del padre
      as: "motherDetails", // Nombre del array donde se agrega la información del padre
    },
  },
  {
    // Añadir la relación padre al array relations
    $addFields: {
      relations: {
        $concatArrays: [
          "$relations", // Mantener las relaciones actuales
          {
            $map: {
              input: "$motherDetails",
              as: "mother",
              in: {
                _id: "$$mother._id", // Para mantener la referencia, si es necesario
                id: "$$mother._id", // Para mantener la referencia, si es necesario
                typeRel: "mother", // Tipo de relación como "mother"
                relatedPerson: "$$mother.personId", // ID del padre
                gender: "$$mother.gender",
                datebirth: "$$mother.datebirth",
                gender: "$$mother.gender",
                histBirth: "$$mother.histBirth",
                placebirth: "$$mother.placebirth",
              },
            },
          },
        ],
      },
    },
  },
  {
    $project: {
      relationsDetails: 0, // Opcional: si no deseas conservar el campo de detalles unido
      fatherDetails: 0, // Opcional: si no deseas conservar el campo de detalles unido
      motherDetails: 0, // Opcional: si no deseas conservar el campo de detalles unido
    },
  },
];

module.exports = { cytorelationsfilter };
