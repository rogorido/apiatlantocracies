// I wanted to make this in mongoDB, but it is so complicated...

/**
 * Returns an array with persons and details
 * @param {person} Object with the person we want to operate on.
 *
 * Returns an object with all the data of the person: events.
 *
 * The reason is we want to add extra fields to the documents relations,
 * events, etc. For instance: transform the date into an usable format,
 *
 */
const personDetails = (person) => {
  let updatedObject = person;

  if (person.relations && Array.isArray(person.relations)) {
    const relationsUpdated = person.relations.map((relation) => {
      // bool whether idPerson in relation
      const hasId = "idPerson" in relation;

      // we check whether their is dateRelF
      let relYear = null;

      if (relation.dateRelF) {
        relYear = extractYear(relation.dateRelF);
      }
      return { ...relation, hasId: hasId, relYear: relYear };
    });

    // Retorna un nuevo objeto con los mismos campos y el array `relations` actualizado
    updatedObject = {
      ...updatedObject,
      relations: relationsUpdated,
    };
  }

  if (person.events && Array.isArray(person.events)) {
    const eventsWithYear = person.events.map((event) => {
      if (event.dateEv) {
        return { ...event, eventYear: extractYear(event.dateEv) };
      } else {
        return { ...event, eventYear: null };
      }
    });

    // Retorna un nuevo objeto con los mismos campos y el array `relations` actualizado
    updatedObject = {
      ...updatedObject,
      events: eventsWithYear,
    };
  }

  if (person.positions && Array.isArray(person.positions)) {
    const positionsWithYear = person.positions.map((position) => {
      let posYearF = null;
      let posYearT = null;

      if (position.datePosF) {
        posYearF = extractYear(position.datePosF);
      }

      if (position.datePosT) {
        posYearT = extractYear(position.datePosT);
      }

      return { ...position, posYearF: posYearF, posYearT: posYearT };
    });

    // Retorna un nuevo objeto con los mismos campos y el array `relations` actualizado
    updatedObject = {
      ...updatedObject,
      positions: positionsWithYear,
    };
  }

  return updatedObject;
};

function extractYear(fecha) {
  // Comprueba si la cadena comienza con "c"
  const esPrefijoC = fecha.startsWith("c");

  // Elimina el prefijo "c" si está presente
  const fechaSinPrefijoC = esPrefijoC ? fecha.slice(1) : fecha;

  // Usa expresiones regulares para extraer el año
  const regex = /^\d{4}/; // Busca cuatro dígitos consecutivos
  const match = fechaSinPrefijoC.match(regex);

  if (match) {
    return parseInt(match[0]); // Convierte la coincidencia a un entero y devuelve el año
  } else {
    return null; // Si no se encuentra el año, devuelve null
  }
}

module.exports = { personDetails };
