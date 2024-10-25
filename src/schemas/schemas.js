const placeSchema = {
  schema: {
    params: {
      type: "object",
      properties: {
        place: { type: "string", pattern: "^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$" },
      },
      required: ["place"],
      additionalProperties: false,
    },
  },
};

const postSchema = {
  schema: {
    body: {
      type: "object",
      properties: {
        wasMarried: { type: "boolean" },
        hasPositions: { type: "boolean" },
        hasTitles: { type: "boolean" },
        hasEvents: { type: "boolean" },
        wasMarried: { type: "boolean" },
      },
      additionalProperties: false,
    },
  },
};

const postUserSchema = {
  body: {
    type: "object",
    // required: ['hasPositions'],
    properties: {
      hasPositions: { type: "boolean" },
      hasTitles: { type: "boolean" },
      gender: { type: "string", enum: ["male", "female", "other"] },
    },
    additionalProperties: false,
  },
};

const versionSchema = {
  schema: {
    description: "API version.",
    tags: ["general"],
    summary: "Version of the API apiatlantocracies",
    response: {
      200: {
        description: "API version number.",
        type: "string",
      },
    },
  },
};

const generalstatsSchema = {
  schema: {
    description: "General statistics of the database.",
    tags: ["general"],
    summary: "Some general statistics of the database",
    response: {
      default: {
        description: "API version number.",
        type: "string",
      },
    },
  },
};

const eventstypesSchema = {
  schema: {
    description: "Event types",
    tags: ["general"],
    summary: "Array of event types.",
    response: {
      default: {
        description: "Array of event types.",
        type: "array",
      },
    },
  },
};

const searchSchema = {
  schema: {
    description:
      "Main search with big filter. Returns array o objects with result, gendersData, gendersChartData, histBirthsData, histBirthsChartData, hasTitlesChartData, hasTitlesData, hasPositionsChartData, hasPositionsData, positionsTable, positionsTableTree, decadesBirthsChartData.",
    tags: ["general"],
    summary: "Main search filter.",
    body: { type: "object" },
    response: {
      200: {
        type: "object",
        description: "Array objects.",
        properties: {
          result: { type: "array", description: "Array of persons objects." },
          gendersData: {
            type: "array",
            description: "Array of persons objects.",
          },
          gendersChartData: {
            type: "object",
            description: "Array of persons objects.",
          },
          histBirthsData: {
            type: "array",
            description: "Array of persons objects.",
          },
          histBirthsChartData: {
            type: "object",
            description: "Array of persons objects.",
          },
          hasTitlesChartData: {
            type: "object",
            description: "Array of persons objects.",
          },
          hasTitlesData: {
            type: "array",
            description: "Array of persons objects.",
          },
          hasPositionsChartData: {
            type: "object",
            description: "Array of persons objects.",
          },
          hasPositionsData: {
            type: "array",
            description: "Array of persons objects.",
          },
          positionsTable: {
            type: "array",
            description: "Array of persons objects.",
          },
          positionsTableTree: {
            type: "array",
            description: "Array of persons objects.",
          },
          decadesBirthsChartData: {
            type: "object",
            description: "Array of persons objects.",
          },
        },
      },
    },
  },
};

module.exports = {
  placeSchema,
  postSchema,
  postUserSchema,
  versionSchema,
  generalstatsSchema,
  eventstypesSchema,
  searchSchema,
};
