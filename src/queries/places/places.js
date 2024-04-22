
const pl_places_global = [
    {
      '$facet': {
        'placebirthCounts': [
          {
            '$group': {
              '_id': {
                'place': '$placebirth', 
                'coord': '$pbirthUTM'
              }, 
              'totalbirths': {
                '$sum': 1
              }
            }
          }
        ], 
        'placedeathCounts': [
          {
            '$group': {
              '_id': {
                'place': '$placedeath'
              }, 
              'totaldeaths': {
                '$sum': 1
              }
            }
          }
        ], 
        'placeEventsCounts': [
          {
            '$unwind': {
              'path': '$events'
            }
          }, {
            '$group': {
              '_id': {
                'place': '$events.placeEv', 
                'coord': '$events.placeEvUTM'
              }, 
              'totalevents': {
                '$sum': 1
              }
            }
          }
        ], 
        'placePositionsCounts': [
          {
            '$unwind': {
              'path': '$positions'
            }
          }, {
            '$group': {
              '_id': {
                'place': '$positions.placePos', 
                'coord': '$positions.placePosUTM'
              }, 
              'totalpositions': {
                '$sum': 1
              }
            }
          }
        ], 
        'placeRelationsCounts': [
          {
            '$unwind': {
              'path': '$relations'
            }
          }, {
            '$group': {
              '_id': {
                'place': '$relations.placeRel', 
                'coord': '$relations.placeRUTM'
              }, 
              'totalrelations': {
                '$sum': 1
              }
            }
          }
        ]
      }
    }, {
      '$project': {
        'allPlaces': {
          '$concatArrays': [
            '$placebirthCounts', '$placedeathCounts', '$placeEventsCounts', '$placePositionsCounts', '$placeRelationsCounts'
          ]
        }
      }
    }, {
      '$unwind': '$allPlaces'
    }, {
      '$group': {
        '_id': '$allPlaces._id', 
        'totalbirths': {
          '$first': '$allPlaces.totalbirths'
        }, 
        'totaldeaths': {
          '$first': '$allPlaces.totaldeaths'
        }, 
        'totalevents': {
          '$first': '$allPlaces.totalevents'
        }, 
        'totalpositions': {
          '$first': '$allPlaces.totalpositions'
        }, 
        'totalrelations': {
          '$first': '$allPlaces.totalrelations'
        }
      }
    }, {
      '$addFields': {
        'totalplaces': {
          '$sum': [
            '$totalbirths', '$totaldeaths', '$totalpositions', '$totalevents', '$totalrelations'
          ]
        }
      }
    }, {
      '$project': {
        'place': '$_id.place', 
        'coord': {
          '$map': {
            'input': {
              '$split': [
                '$_id.coord', '/'
              ]
            }, 
            'as': 'coord', 
            'in': {
              '$toDouble': '$$coord'
            }
          }
        }, 
        'totalbirths': 1, 
        'totaldeaths': 1, 
        'totalpositions': 1, 
        'totalevents': 1, 
        'totalrelations': 1, 
        'totalplaces': 1, 
        '_id': 0
      }
    },
    { $match: { place: { $exists: true, $ne: null } } },
  ]


module.exports = { pl_places_global };
