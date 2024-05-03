/**
 * Flips the coordinates of each place in the provided data array.
 *
 * @param {Array} data - The array of places with coordinates to be flipped
 * @return {Array} The array of places with flipped coordinates
 */
const flipCoords = (data) => {
  return data.map((place) => ({
    ...place,
    coords: [place.coords[1], place.coords[0]],
  }));
};

module.exports = { flipCoords };
