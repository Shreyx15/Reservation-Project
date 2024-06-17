import { Routes, Route, RouterProvider, BrowserRouter, createBrowserRouter, Outlet } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import { ThemeContextProvider } from "./context/themeContext";
import Users from "./pages/List/Users/Users";
import Hotels from "./pages/List/Hotels/Hotels";
import NewUser from "./pages/Single/NewUser/NewUser";
import Rooms from "./pages/List/Rooms/Rooms";
import { HotelRoomContextProvider } from "./context/hotelRoomContext";
import SingleUser from "./pages/Single/singleUser/SingleUser";
import SingleHotel from "./pages/Single/singleHotel/SingleHotel";
import NewHotel from "./pages/Single/NewHotel/NewHotel";
import SingleRoom from "./pages/Single/singleRoom/SingleRoom";
import NewRoom from "./pages/Single/NewRoom/NewRoom";
import { AuthContextProvider } from "./context/AuthContext";
import { ToastContainer } from 'react-toastify';
import Login from "./pages/Login/Login";
// import { BrowserRouter, Routes, Route } from 'react-router-dom';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/users",
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <Users />,
      },
      {
        path: "newUser",
        element: <NewUser />
      },
      {
        path: ":userId",
        element: <SingleUser />
      }
    ]
  },
  {
    path: "/hotels",
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <Hotels />
      },
      {
        path: "newHotel",
        element: <NewHotel />
      },
      {
        path: ":hotelId",
        element: <SingleHotel />
      }
    ]
  },
  {
    path: "/rooms",
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <Rooms />
      },
      {
        path: ":roomId",
        element: <SingleRoom />
      },
      {
        path: "newRoom",
        element: <NewRoom />
      }
    ]
  }
]);


function App() {
  return (
    <AuthContextProvider>
      <ThemeContextProvider>
        <HotelRoomContextProvider>
          <RouterProvider router={router} />
        </HotelRoomContextProvider>
      </ThemeContextProvider>
    </AuthContextProvider>
  );
}


export default App;