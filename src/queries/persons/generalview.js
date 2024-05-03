const generalview = [
  {
    $addFields: {
      tiposEventos: {
        $setUnion: "$events.typeEv",
      },
      tiposRelations: {
        $setUnion: "$relations.typeRel",
      },
    },
  },
  {
    $addFields: {
      wasMarried: {
        $cond: {
          if: {
            $and: [
              {
                $ifNull: ["$tiposEventos", false],
              },
              {
                $in: ["Boda", "$tiposEventos"],
              },
            ],
          },
          then: true,
          else: false,
        },
      },
      hizoTestamento: {
        $cond: {
          if: {
            $and: [
              {
                $ifNull: ["$tiposEventos", false],
              },
              {
                $in: ["Hizo Testamento", "$tiposEventos"],
              },
            ],
          },
          then: true,
          else: false,
        },
      },
      hasFather: {
        $cond: {
          if: {
            $eq: [
              {
                $type: "$idFather",
              },
              "missing",
            ],
          },
          then: false,
          else: true,
        },
      },
      relations: {
        $map: {
          input: "$relations",
          as: "relation",
          in: {
            $mergeObjects: [
              "$$relation",
              {
                hasID: {
                  $cond: {
                    if: {
                      $eq: [
                        {
                          $type: "$$relation.idPerson",
                        },
                        "missing",
                      ],
                    },
                    then: false,
                    else: true,
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
];

module.exports = { generalview };
