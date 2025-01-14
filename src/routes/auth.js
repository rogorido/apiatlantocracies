const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// la contra es cojonesvarios con salt count 10
const usuarios = require("../../usuarios.json");

async function routes(fastify, options) {
  fastify.post("/login", async (request, reply) => {
    const { email, password } = request.body;

    const user = usuarios.find((usuario) => usuario.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      reply.status(401).send({ message: "Invalid credentials" });
    } else {
      const token = jwt.sign(
        { userId: user.id },
        // process.env.JWT_SECRET as string,
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
      );
      reply.status(200).send({
        message: "Logged in!",
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    }
  });

  fastify.post("/me", async (request, reply) => {
    const { token } = request.body;

    if (!token) {
      reply.status(401).send({ message: "Unauthorized: No token" });
    } else {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = usuarios.find((u) => u.id === decoded.userId);
        reply.status(200).send({ user });
      } catch (error) {
        reply.status(401).send({ message: "Unauthorized" });
      }
    }
  });
}

module.exports = routes;
