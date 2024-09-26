const macrofilterConverter = (filter) => {
  if (filter.place) {
    filter.$or = [
      { placebirth: filter.place },
      { placedeath: filter.place },
      { "events.placeEv": filter.place },
      { "positions.placePos": filter.place },
      { "relations.placeRel": filter.place },
    ];
    delete filter.place;
  } else {
    delete filter.$or;
  }

  if (filter.tiposPositions) {
    filter.tiposPositions = { $in: filter.tiposPositions };
  }

  if (filter.tiposRelations) {
    filter.tiposRelations = { $in: filter.tiposRelations };
  }

  if (filter.histBirths) {
    filter.histBirth = { $in: filter.histBirths };
    delete filter.histBirths;
  }

  if (filter.source) {
    filter.source = { $in: filter.source };
  }
  console.log(JSON.stringify(filter, null, 2));

  return filter;
};

module.exports = { macrofilterConverter };
