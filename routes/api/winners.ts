import { Handlers } from "$fresh/server.ts";
import { PRIZES } from "../../lib/constants.ts";
import * as redis from "redis";

interface Result {
  [key: string]: string;
}

const store = await redis.connect({
  password: Deno.env.get("REDIS_PASS") || "",
  hostname: Deno.env.get("REDIS_HOST") || "",
  port: Deno.env.get("REDIS_PORT") || "",
});

export const handler: Handlers = {
  async GET() {
    const prizes = await store.get("prizes");
    const winners = prizes ? JSON.parse(prizes) : {};
    const results: Result = {};

    for (const uuid in winners) {
      const email = winners[uuid];
      const prize = PRIZES[uuid];

      results[email] = prize;
    }

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  },
  DELETE() {
    store.del("prizes");

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
