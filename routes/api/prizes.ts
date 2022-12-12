import { Handlers } from "$fresh/server.ts";
import { PRIZES } from "../../lib/constants.ts";

interface Result {
  [key: string]: string;
}

export function prizeUrl(uuid: string) {
  return `https://kyan-prizes-2022.deno.dev/prizes/${uuid}`;
}

export const handler: Handlers = {
  GET() {
    const results: Result = {};

    for (const uuid in PRIZES) {
      const url = prizeUrl(uuid);
      const prize = PRIZES[uuid];

      results[url] = prize;
    }

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
