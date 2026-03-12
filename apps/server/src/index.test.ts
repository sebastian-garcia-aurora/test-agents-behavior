import { describe, expect, test } from "bun:test";

// Set required env vars before importing the app (which triggers env validation)
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.BETTER_AUTH_SECRET = "test-secret-that-is-at-least-32-characters-long";
process.env.BETTER_AUTH_URL = "http://localhost:3000";
process.env.CORS_ORIGIN = "http://localhost:3001";

const { default: app } = await import("./index");

describe("GET /health", () => {
  test("returns 200 with status ok", async () => {
    const req = new Request("http://localhost/health");
    const res = await app.fetch(req);

    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toEqual({ status: "ok" });
  });
});
