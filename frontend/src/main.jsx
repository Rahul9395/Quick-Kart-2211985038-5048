import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './Context/UserContext.jsx'
import { BrowserRouter as Router } from 'react-router-dom';
import { AdminProvider } from './Context/AdminContext.jsx';

createRoot(document.getElementById('root')).render(
 
    <Router>
      <UserProvider>
        <AdminProvider>
          <App />
        </AdminProvider>
      </UserProvider>
    </Router>
  
)
