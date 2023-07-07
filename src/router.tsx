import { lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";

const LoginPage = lazy(() => import("./pages/Login"));
const SignupPage = lazy(() => import("./pages/Signup"));

export const router = createBrowserRouter([
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "signup",
    element: <SignupPage />,
  },
  {
    path: "",
    element: <Navigate to="/login" />,
  },
]);
