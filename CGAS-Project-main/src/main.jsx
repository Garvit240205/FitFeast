import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {SignInPage} from './SignIn.jsx'
import {SignUpPage} from './SignUp.jsx'
import Profile from './Profile.jsx'
import Home from './Home.jsx'
import Explore from './explore.jsx'
import App from './App.jsx'
import WelcomePage from './WelcomePage.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WelcomePage />
  </StrictMode>,
)