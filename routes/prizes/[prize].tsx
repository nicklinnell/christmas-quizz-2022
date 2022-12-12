import * as redis from "redis";
import * as date from "date";
import { Handlers, PageProps } from "$fresh/server.ts";
import { Form } from "../../components/Form.tsx";
import { Winner } from "../../components/Winner.tsx";
import { ToEarly } from "../../components/ToEarly.tsx";
import { Claimed } from "../../components/Claimed.tsx";
import { PRIZES } from "../../lib/constants.ts";
import { Wrapper } from "../../components/Wrapper.tsx";

interface Data {
  email: string;
  winner?: boolean;
  error?: string;
  claimed?: boolean;
  claimedByYou?: boolean;
}

const store = await redis.connect({
  password: Deno.env.get("REDIS_PASS") || "",
  hostname: Deno.env.get("REDIS_HOST") || "",
  port: Deno.env.get("REDIS_PORT") || "",
});

function canWeStartYet() {
  const quizzStart = Deno.env.get("QUIZ_START_TIME");
  if (quizzStart === undefined) return true;

  const startDate = date.parse(quizzStart, "HH:mm dd-MM-yyyy");
  const now = new Date();

  return startDate >= now ? false : true;
}

export const handler: Handlers<Data> = {
  async POST(req, ctx): Promise<Response> {
    const formData = await req.formData();
    const email = formData.get("email")?.toString().toLowerCase() || "";
    const prize = ctx.params.prize;

    // prize does not exist
    if (!PRIZES[prize]) return ctx.renderNotFound();

    // email is blank
    if (email === "")
      return ctx.render({ email, error: "Missing email address!" });
    // email is invalid
    const isEmail = /^[a-z0-9.]{1,64}@[a-z0-9.]{1,64}$/i.test(email);
    if (!isEmail)
      return ctx.render({ email: "", error: "Invalid email address!" });
    // email is not kyan
    if (email.split("@")[1].toLowerCase() !== "bcbgroup.io")
      return ctx.render({ email: "", error: "Not a BCB email address!" });

    const prizes = await store.get("prizes");
    const claimedPrizes = prizes ? JSON.parse(prizes) : {};
    const alreadyClaimed = Object.keys(claimedPrizes).includes(prize);
    const alreadyClaimedByYou = Object.values(claimedPrizes).includes(email);

    if (alreadyClaimed)
      return ctx.render({ email: "", error: "Prize already claimed!" });

    if (alreadyClaimedByYou)
      return ctx.render({
        email: "",
        error: "Greedy! Only one prize per person!",
      });

    if (alreadyClaimed || alreadyClaimedByYou) {
      return ctx.render({
        email: "",
        winner: false,
        claimed: alreadyClaimed,
        claimedByYou: alreadyClaimedByYou,
      });
    } else {
      claimedPrizes[prize] = email;
      await store.set("prizes", JSON.stringify(claimedPrizes));

      return ctx.render({ email, winner: true });
    }
  },
  async GET(req, ctx) {
    const prize = ctx.params.prize;
    if (!PRIZES[prize]) return ctx.renderNotFound();

    const prizes = await store.get("prizes");
    const claimedPrizes = prizes ? JSON.parse(prizes) : {};
    const alreadyClaimed = Object.keys(claimedPrizes).includes(prize);

    return ctx.render({ email: "", claimed: alreadyClaimed });
  },
};

export default function Prize({ data }: PageProps<Data>) {
  const { email, winner, error, claimed } = data;

  const content = () => {
    if (!canWeStartYet()) return <ToEarly />;
    if (claimed) return <Claimed />;
    if (winner) return <Winner />;

    return <Form email={email} error={error} />;
  };

  return <Wrapper>{content()}</Wrapper>;
}
