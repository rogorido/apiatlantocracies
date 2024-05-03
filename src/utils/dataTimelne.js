/**
 * Creates a data timeline based on the provided data.
 *
 * @param {Object} data - The data to create the timeline from.
 * @return {Object} The created data timeline.
 */
const createDataTimeline = (data) => {
  let nodes = [];

  if (data.birthyear) {
    nodes.push({
      id: 0,
      content: "Birth",
      start: `${data.birthyear}-01-01`,
    });
  }

  // we have to add +1 in idx because of birth. And if there is no birth, no matters...
  // TODO: but this is not a good way to do it!
  if (data.events && Array.isArray(data.events)) {
    data.events.map((item, idx) => {
      if (item.eventYear) {
        nodes.push({
          id: idx + 1,
          content: item.typeEv,
          start: `${item.eventYear}-01-01`,
        });
      }
    });
  }

  if (nodes) {
    return nodes;
  }
};

module.exports = { createDataTimeline };
