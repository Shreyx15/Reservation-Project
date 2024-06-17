import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home/Home';
import List from './pages/List/List';
import Hotel from './pages/Hotel/Hotel';
import Login from './pages/login/Login';
import Register from './pages/Register/Register';
import MailVerification from './pages/MailVerification/MailVerification';
import VerifyOTP from './pages/verifyOTP/VerifyOTP';
import { ToastContainer } from 'react-toastify';
import UpdateUserProfile from './pages/UpdateUserProfile/UpdateUserProfile';
import MyBookings from './pages/My Bookings/MyBookings';

const router = createBrowserRouter([
  {
    path: "/home",
    element: <Home />
  },
  {
    path: "/hotels",
    element: <List />
  },
  {
    path: "/hotel/:id",
    element: <Hotel />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/updateProfile",
    element: <UpdateUserProfile />
  },
  {
    path: "/myBookings",
    element: <MyBookings />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/emailVerification",
    element: <MailVerification />
  },
  {
    path: "/verifyOTP",
    element: <VerifyOTP />
  }
]);


function App() {
  return (
    <RouterProvider router={router} >
      <ToastContainer
        className="toast-container"
        bodyClassName="toast-body"
        style={{ fontSize: '16px', backgroundColor: '#333' }}
      />
    </RouterProvider>

  );
}

export default App;
