import { Link } from "@remix-run/react";

export default function Header() {
  return (
    <header className="flex justify-between">
      <Link to="/">
        <h1 className="text-2xl font-bold">{"Saldyy's blog"}</h1>
      </Link>
      <h1 className="text-2xl font-bold">Phillip</h1>
    </header>
  )
}
