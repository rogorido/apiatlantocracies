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

module.exports = { placeSchema, postSchema, postUserSchema };
