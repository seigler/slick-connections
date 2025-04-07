import { createEffect, createSignal, type Accessor } from "solid-js";

export default function FitText(props: { body: Accessor<string> }) {
  let textRef: SVGTextElement | undefined;
  const [width, setWidth] = createSignal(100);
  const [height, setHeight] = createSignal(100);

  createEffect(() => {
    props.body();
    const bounds = textRef?.getBBox();
    if (bounds === undefined) {
      return;
    }
    setWidth(bounds.width);
    setHeight(bounds.height);
  });

  return (
    <svg
      style={{
        width: "100%",
        "max-height": "40%",
      }}
      viewBox={`0 0 ${width()} ${height()}`}
      overflow="visible"
      fill="currentcolor"
    >
      <text
        ref={textRef}
        x="50%"
        y="50%"
        dominant-baseline="central"
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
