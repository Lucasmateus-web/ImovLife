import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { PageCorrect } from "../modules/auth/pages/FormLogin";
import { HomeScreen } from "../modules/properties/presentation/pages/HomeScreen";
import { Forgot } from "../modules/auth/pages/Forgot";
import { AdminDashboard } from "../modules/properties/presentation/pages/AdminScreen";
import { Favorites } from "../modules/properties/presentation/pages/ClientScreen";
import Explores from "../modules/properties/presentation/pages/ExplorePublic";
import { PropertyManagementScreen } from "../modules/properties/presentation/pages/PropertyManagementScreen";
import { PropertyDetailsPage } from "../modules/properties/presentation/pages/PropertyDetailsPage";
import { AuthScreen } from "../modules/auth/pages/Login";

type AppUser = {
  role: "ADMIN" | "CORRETOR" | "CLIENTE";
  name?: string;
};

const getStoredUser = (): AppUser | null => {
  const rawUser = localStorage.getItem("@ImovLife:user");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AppUser;
  } catch {
    localStorage.removeItem("@ImovLife:user");
    localStorage.removeItem("@ImovLife:token");
    return null;
  }
};

const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element; allowedRoles?: Array<AppUser["role"]> }) => {
  const token = localStorage.getItem("@ImovLife:token");
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeScreen />,
  },
  {
    path: "/login",
    element: <AuthScreen />,
  },
  {
    path: "/forgot",
    element: <Forgot />,
  },
  {
    path: "/anunciar",
    element: <PageCorrect />,
  },
  {
    path: "/public",
    element: <Explores />,
  },
  {
    path: "/property/:id",
    element: <PropertyDetailsPage />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Client",
    element: (
      <ProtectedRoute allowedRoles={["CLIENTE"]}>
        <Favorites isLoggedIn user={{ name: "Lucas Lima", role: "CLIENTE" }} />
      </ProtectedRoute>
    ),
  },
  {
    path: "/management",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN", "CORRETOR"]}>
        <PropertyManagementScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: "/gest",
    element: <Navigate to="/management" replace />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};