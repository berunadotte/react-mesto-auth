export default function Login() {

  return (
    <div className="login">
      <h2 className="login__title">Вход</h2>
      <input
        className="login__form login__form__email"
        type="email"
        placeholder="Email"
      />
      <input
        className="login__form login__form__password"
        type="password"
        placeholder="Password"
      />
      <button className="login__button">Войти</button>
    </div>
  )
}
