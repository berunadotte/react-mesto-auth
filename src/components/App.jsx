import React from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { Header } from './Header.jsx'
import { Main } from './Main.jsx'
import { Footer } from './Footer.jsx'
import avatar from '../images/avatar_photo.png'
import PopupWithForm from './PopupWithForm.jsx'
import ImagePopup from './ImagePopup.jsx'
import { CurrentUserContext } from '../contexts/CurrentUserContext.js'
import { apiMesto } from '../utils/api.js'
import EditProfilePopup from './EditProfilePopup.jsx'
import EditAvatarPopup from './EditAvatarPopup.jsx'
import { AddPlacePopup } from './AddPlacePopup.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import InfoTooltip from './InfoTooltip.jsx'
import * as authApi from '../utils/authApi.js'
import registration_error from '../images/registration_error.svg'
import registration_succes from '../images/registration_succes.svg'

function App() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false)
  const [selectedCard, setSelectedCard] = React.useState({})
  const [isOpenImage, setIsOpenImage] = React.useState(false)
  const [cards, setCards] = React.useState([])
  const [currentUser, setCurrentUser] = React.useState({
    name: 'Жак Ив Кусто',
    about: 'Исследователь океана',
    avatar: avatar,
  })

  const [loggedIn, setLoggedIn] = React.useState(false)
  const [message, setMessage] = React.useState({ imgPath: '', text: '' })
  const [isTooltipOpen, setIsTooltipOpen] = React.useState(false)
  const [email, setEmail] = React.useState('email')

  const navigate = useNavigate()

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  }

  function closeAllPopup() {
    setIsAddPlacePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setIsEditProfilePopupOpen(false)
    setSelectedCard({})
    setIsOpenImage(false)
    setIsTooltipOpen(false)
  }

  function handleCardClick(card) {
    setSelectedCard(card)
    setIsOpenImage(true)
  }

  function handleCardDelete(id) {
    apiMesto
      .removeCard(id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== id))
      })
      .catch((err) => {
        console.log(err)
      })
  }

  function handleSubmit(request) {
    setIsLoading(true)
    request()
      .then(closeAllPopup)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }

  function handleUpdateUser(inputValues) {
    function makeRequest() {
      return apiMesto
        .changeNameAndInfo(inputValues.name, inputValues.about)
        .then(setCurrentUser)
    }
    handleSubmit(makeRequest)
  }

  function handleUpdateAvatar(inputValue) {
    function makeRequest() {
      return apiMesto.updateAvatar(inputValue.avatar).then(setCurrentUser)
    }
    handleSubmit(makeRequest)
  }

  function handleAddPlaceSubmit(inputValues) {
    function makeRequest() {
      return apiMesto.addNewCardToServer(inputValues).then((newCard) => {
        setCards([newCard, ...cards])
      })
    }
    handleSubmit(makeRequest)
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id)

    apiMesto
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((cards) =>
          cards.map((c) => (c._id === card._id ? newCard : c))
        )
      })
      .catch((err) => {
        console.log(err)
      })
  }

  React.useEffect(() => {
    apiMesto
      .loadNameAndInfo()
      .then((data) => {
        setCurrentUser(data)
      })
      .catch((err) => {
        console.log(err)
      })

    apiMesto
      .getInitialCards()
      .then((data) => {
        setCards(data)
      })
      .catch((err) => {
        console.log(err)
      })

    checkToken()
  }, [])

  function checkToken() {
    const jwt = localStorage.getItem('jwt')

    if (jwt) {
      console.log('est jwt')
      authApi
        .getContent(jwt)
        .then((res) => {
          if (res) {
            setLoggedIn(true)
            setEmail(res.data.email)
            navigate('/')
          }
        })
        .catch((err) => console.log(err))
    }
  }

  function handleRegister(email, password) {
    authApi
      .register(email, password)
      .then((res) => {
        console.log('registration_complete')
        setEmail(res.data.email)
        setMessage({
          imgPath: registration_succes,
          text: 'Вы успешно зарегистрировались!',
        })
        navigate('./sign-in')
      })
      .catch(() =>
        setMessage({
          imgPath: registration_error,
          text: 'Что-то пошло не так! Попробуйте еще раз.',
        })
      )
      .finally(() => setIsTooltipOpen(true))
  }

  function handleLogin(password, email) {
    authApi
      .signin(password, email)
      .then((token) => {
        authApi.getContent(token).then((res) => {
          setEmail(res.data.email)
          setLoggedIn(true)
          navigate('/')
        })
      })
      .catch((err) => console.log(err))
  }

  function onSignOut() {
    localStorage.removeItem('jwt')
    setLoggedIn(false)
  }

  return (
    <div className="root">
      <CurrentUserContext.Provider value={currentUser}>
        <Header loggedIn={loggedIn} email={email} onSignOut={onSignOut} />

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={Main}
                loggedIn={loggedIn}
                cards={cards}
                onEditProfile={handleEditProfileClick}
                onEditAvatar={handleEditAvatarClick}
                onAddPlace={handleAddPlaceClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />
            }
          />
          <Route
            path="/sign-in"
            element={
              <Login onLogin={handleLogin} isTooltipOpen={isTooltipOpen} />
            }
          />
          <Route
            path="/sign-up"
            element={
              <Register
                onRegister={handleRegister}
                isTooltipOpen={isTooltipOpen}
              />
            }
          />
        </Routes>

        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopup}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopup}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopup}
          onAddPlace={handleAddPlaceSubmit}
          isLoading={isLoading}
        />

        <PopupWithForm
          title="Вы уверены?"
          name="before_deleting"
          buttonName="Вы уверены"
          onClose={closeAllPopup}
        >
          <h2 className="popup__header">Вы уверены?</h2>
          <button type="submit" className="popup__delete-button submit-button">
            Да
          </button>
          <button type="button" className="popup__close-button"></button>
        </PopupWithForm>

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopup}
          isOpen={isOpenImage}
        />

        <InfoTooltip
          name="tooltip"
          isOpen={isTooltipOpen}
          onClose={closeAllPopup}
          title={message.text}
          imgPath={message.imgPath}
        />
      </CurrentUserContext.Provider>
    </div>
  )
}

export default App
