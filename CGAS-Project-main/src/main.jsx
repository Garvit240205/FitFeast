<<<<<<< ours
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {SignInPage} from './SignIn.jsx'
import {SignUpPage} from './SignUp.jsx'
import Profile from './Profile.jsx'
import Home from './Home.jsx'
import Explore from './explore.jsx'
import App from './App.jsx'
import WelcomePage from './WelcomePage.jsx'
import FitnessProfile from './FitnessProfile.jsx'
import Temp from './temp.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
<<<<<<< ours
    <Profile />
||||||| ancestor
    <FitnessProfile />
=======
    <Home />
>>>>>>> theirs
  </StrictMode>,
||||||| ancestor
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {SignInPage} from './SignIn.jsx'
import {SignUpPage} from './SignUp.jsx'
import Profile from './Profile.jsx'
import Home from './Home.jsx'
import Explore from './explore.jsx'
import App from './App.jsx'
import WelcomePage from './WelcomePage.jsx'
import FitnessProfile from './FitnessProfile.jsx'
import Temp from './temp.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Profile />
  </StrictMode>,
=======
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {SignInPage} from './SignIn.jsx'
import {SignUpPage} from './SignUp.jsx'
import Profile from './Profile.jsx'
import Home from './Home.jsx'
import Explore from './explore.jsx'
import App from './App.jsx'
import WelcomePage from './WelcomePage.jsx'
import FitnessProfile from './FitnessProfile.jsx'
import Temp from './temp.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FitnessProfile />
  </StrictMode>,
>>>>>>> theirs
)