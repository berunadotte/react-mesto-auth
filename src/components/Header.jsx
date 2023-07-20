import logo from '../images/header_logo.svg'

export function Header() {
  return (
    <header className="header">
      <img src={logo} alt="Место Россия" className="header__logo" />
    </header>
  )
}
