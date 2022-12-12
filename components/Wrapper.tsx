import { Head } from "$fresh/runtime.ts";
import { Fragment, ComponentChildren } from "preact";

type Props = {
  children: ComponentChildren;
};

export function Wrapper(props: Props) {
  return (
    <Fragment>
      <Head>
        <link rel="stylesheet" href="/global.css" />
      </Head>

      <div class="wrapper grid h-screen place-items-center">
        <div class="bg_image">
          <div class="w-full max-w-xs">{props.children}</div>
        </div>
      </div>
    </Fragment>
  );
}
