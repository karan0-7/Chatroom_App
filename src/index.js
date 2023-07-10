import React from 'react';
import ReactDOM from 'react-dom/client';
import HomePage from './Homepage';
import Chatroom from './Chatroom';
import ChangeUsername from './ChangeUsername';
import ChangeProfilePicture from './ChangeProfilePicture';
import { createBrowserRouter, Route, RouterProvider, createRoutesFromElements } from 'react-router-dom';


const router = createBrowserRouter(createRoutesFromElements(
  <Route>
  <Route path='/' element={<HomePage />} />
  <Route path='/chatroom' element={<Chatroom />}  />
  <Route path='/changeUsername' element={<ChangeUsername />}  />
  <Route path='/changeProfilePicture' element={<ChangeProfilePicture />} />


  
  </Route>
    
))

function App() {
  return (
    <RouterProvider router={router} />
  )   
}

 

ReactDOM.createRoot(document.getElementById("root")).render(<App />) 

