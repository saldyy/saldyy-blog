import { Link } from "@remix-run/react";
import AvatarUrl from '~/assets/images/png_portraits.jpeg'

export default function Header() {
  return (
    <header className="flex justify-between">
      <Link to="/" className="text-primary">
        <h1 className="text-2xl font-bold ">{"Saldyy's blog"}</h1>
      </Link>
      <img src={AvatarUrl} alt="avatar" className="w-12 h-12 rounded-full" />
    </header>
  )
}
