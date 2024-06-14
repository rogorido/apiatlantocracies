const pl_places_global = [
  {
    $facet: {
      placebirthCounts: [
        {
          $group: {
            _id: {
              place: "$placebirth",
              coord: "$pbirthUTM",
            },
            totalbirths: {
              $sum: 1,
            },
          },
        },
      ],
      placedeathCounts: [
        {
          $group: {
            _id: {
              place: "$placedeath",
            },
            totaldeaths: {
              $sum: 1,
            },
          },
        },
      ],
      placeEventsCounts: [
        {
          $unwind: {
            path: "$events",
          },
        },
        {
          $group: {
            _id: {
              place: "$events.placeEv",
              coord: "$events.placeEvUTM",
            },
            totalevents: {
              $sum: 1,
            },
          },
        },
      ],
      placePositionsCounts: [
        {
          $unwind: {
            path: "$positions",
          },
        },
        {
          $group: {
            _id: {
              place: "$positions.placePos",
              coord: "$positions.placePosUTM",
            },
            totalpositions: {
              $sum: 1,
            },
          },
        },
      ],
      placeRelationsCounts: [
        {
          $unwind: {
            path: "$relations",
          },
        },
        {
          $group: {
            _id: {
              place: "$relations.placeRel",
              coord: "$relations.placeRUTM",
            },
            totalrelations: {
              $sum: 1,
            },
          },
        },
      ],
    },
  },
  {
    $project: {
      allPlaces: {
        $concatArrays: [
          "$placebirthCounts",
          "$placedeathCounts",
          "$placeEventsCounts",
          "$placePositionsCounts",
          "$placeRelationsCounts",
        ],
      },
    },
  },
  {
    $unwind: "$allPlaces",
  },
  {
    $set: {
      "allPlaces._id.trunccoords": {
        $map: {
          input: {
            $split: ["$allPlaces._id.coord", "/"],
          },
          as: "coord",
          in: {
            $trunc: [
              {
                $toDouble: "$$coord",
              },
              1,
            ],
          },
        },
      },
    },
  },
  {
    $group: {
      _id: {
        place: "$allPlaces._id.place",
        coords: "$allPlaces._id.trunccoords",
      },
      totalbirths: {
        $sum: "$allPlaces.totalbirths",
      },
      totaldeaths: {
        $sum: "$allPlaces.totaldeaths",
      },
      totalevents: {
        $sum: "$allPlaces.totalevents",
      },
      totalpositions: {
        $sum: "$allPlaces.totalpositions",
      },
      totalrelations: {
        $sum: "$allPlaces.totalrelations",
      },
    },
  },
  {
    $addFields: {
      totalplaces: {
        $sum: [
          "$totalbirths",
          "$totaldeaths",
          "$totalpositions",
          "$totalevents",
          "$totalrelations",
        ],
      },
    },
  },
  {
    $project: {
      place: "$_id.place",
      coords: "$_id.coords",
      totalbirths: 1,
      totaldeaths: 1,
      totalpositions: 1,
      totalevents: 1,
      totalrelations: 1,
      totalplaces: 1,
      _id: 0,
    },
  },
  {
    $match: {
      $and: [
        {
          place: {
            $exists: true,
            $ne: null,
          },
        },
        { coords: { $ne: null } },
      ],
    },
  },
  {
    $sort: {
      place: 1,
    },
  },
];

module.exports = { pl_places_global };
