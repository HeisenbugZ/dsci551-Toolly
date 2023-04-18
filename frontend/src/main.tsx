import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { auth } from '@/utils/auth';

import Axios from 'axios';

Axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_SERVER as string;

Axios.defaults.headers.common.authorization = '';
Object.defineProperty(Axios.defaults.headers.common, 'authorization', {
  get: () => `Bearer ${auth.getToken()}`,
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
