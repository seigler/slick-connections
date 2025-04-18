import { createEffect, createSignal, type Accessor } from "solid-js";

export default function FitText(props: { body: Accessor<string> }) {
  let textRef: SVGTextElement | undefined;
  const [viewBox, setViewbox] = createSignal<string | undefined>()

  createEffect(async () => {
    props.body();
    await Promise.resolve()
    const bounds = textRef?.getBBox();
    if (bounds === undefined) {
      return;
    }
    setViewbox(`0 0 ${bounds.width} ${bounds.height}`)
  });

  return (
    <svg
      style={{
        width: "100%",
        "max-height": "40%",
      }}
      viewBox={viewBox()}
      fill="currentcolor"
    >
      <text
        ref={textRef}
        x="50%"
        y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        font-size="30px"
        font-family="inherit"
        font-weight="inherit"
      >
        {props.body()}
      </text>
    </svg>
  );
}
