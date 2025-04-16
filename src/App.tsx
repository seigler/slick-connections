import { type JSX } from "solid-js"

type AppProps = {
  children?: JSX.Element
}

export default function App({ children }: AppProps) {
  return (
    <>
      <header>
        <h1>Slick Connections</h1>
      </header>
      <main>
        {children}
      </main>
    </>
  )
}
