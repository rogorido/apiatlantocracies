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

module.exports = {
  placeSchema,
  postSchema,
  postUserSchema,
  versionSchema,
  generalstatsSchema,
  eventstypesSchema,
};
