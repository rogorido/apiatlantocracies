const placeSchema = {
  schema: {
    params: {
      type: "object",
      properties: {
        place: { type: "string", pattern: "^[a-zA-ZáéíóúÁÉÍÓÚ]+$" },
      },
      required: ["place"],
      additionalProperties: false,
    },
  },
};

module.exports = { placeSchema };
