"use strict";

// Plain CommonJS — no esbuild TypeScript compilation needed.
// Vercel's file-system tracer will follow require('../dist/lambda')
// and bundle the compiled NestJS output (produced by `nest build`).

let handler;

module.exports = async (req, res) => {
  if (!handler) {
    const { bootstrapLambda } = require("../dist/lambda");
    handler = await bootstrapLambda();
  }
  handler(req, res);
};
