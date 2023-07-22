export default function Register() {

  return (
    <div class="signup">
      <h2 class="signup__title">Регистрация</h2>
      <input
        class="signup__form signup__form__email"
        type="email"
        placeholder="Email"
      />
      <input
        class="signup__form signup__form__password"
        type="password"
        placeholder="Password"
      />
      <button class="signup__button">Зарегистрироваться</button>
      <button class="signup__button_login">Уже зарегистрированы? Войти</button>
    </div>
  )
}
