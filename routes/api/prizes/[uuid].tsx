import * as qr from "qr";
import { Handlers, PageProps } from "$fresh/server.ts";
import { prizeUrl } from "../prizes.ts";
import { PRIZES } from "../../../lib/constants.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const prize = ctx.params.uuid;
    if (!PRIZES[prize]) return ctx.renderNotFound();
    const url = prizeUrl(prize);
    const base64Image = await qr.qrcode(url, { size: 500 });

    return ctx.render({ image: base64Image, url });
  },
};

export default function Prize({ data }: PageProps) {
  const { image, url } = data;

  return <img src={image} title={url} />;
}
