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

  if (filter.titles) {
    const { nomTit, continental, yearsrange } = filter.titles;

    filter.titles = { $elemMatch: { nomTit: { $in: nomTit } } };

    if (continental) {
      filter.titles.$elemMatch.continental = { $in: continental };
    }

    if (yearsrange) {
      filter.titles.$elemMatch.dateTitYear = {
        $gte: yearsrange[0],
        $lt: yearsrange[1],
      };
    }
  }

  if (filter.events) {
    const { eventtype, yearsrange } = filter.events;

    filter.events = { $elemMatch: { typeEv: { $in: eventtype } } };

    if (yearsrange) {
      filter.events.$elemMatch.dateEvYear = {
        $gte: yearsrange[0],
        $lt: yearsrange[1],
      };
    }
  }

  if (filter.source) {
    filter.source = { $in: filter.source };
  }

  if (filter.birthYear) {
    filter.birthYear = { $gte: filter.birthYear[0], $lt: filter.birthYear[1] };
  }

  if (filter.deathYear) {
    filter.deathYear = { $gte: filter.deathYear[0], $lt: filter.deathYear[1] };
  }
  console.log(JSON.stringify(filter, null, 2));

  return filter;
};

const macroTableFields = {
  _id: 1,
  name: 1,
  birthYear: 1,
  deathYear: 1,
  placebirth: 1,
  placeDeath: 1,
  gender: 1,
  hasFather: 1,
  wasMarried: 1,
  hasMother: 1,
  hizoTestamento: 1,
  numberOfEvents: 1,
  numberOfRelations: 1,
  numberOfPositions: 1,
  numberOfTitles: 1,
};

module.exports = { macrofilterConverter, macroTableFields };
