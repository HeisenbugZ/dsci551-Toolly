import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import root from 'react-shadow';
import { AuthLayout } from '@/components/AuthLayout';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/auth/Login';
import { useMemo } from 'react';
import { SignUp } from './pages/auth/SignUp';
import { Browse } from './pages/Browse';
import { NavLayout } from './components/NavLayout';
import { Rent } from './pages/Rent';
import { EditProfile } from './pages/user/EditProfile';
import { Profile } from './pages/user/Profile';
import { Rentals } from './pages/rentals';
import { Tool } from './pages/tool';
import { EditRental } from './pages/rentals/EditRental';
import { UserTools } from './pages/tool/UserTools';
import { AddEditTool } from './pages/tool/AddEditTool';
import { AddEditDemand } from './pages/demand/AddEditDemand';
import { Demand } from './pages/demand';

function App() {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: { retry: 0 },
        },
      }),
    [],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
          </Route>
          <Route path="/" element={<NavLayout />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="tools" element={<Browse />} />
            <Route path="home" element={<Home />} />
            <Route path="rent" element={<Rent />} />
            <Route path="rentals" element={<Rentals />} />
            <Route path="rentals/edit-rental" element={<EditRental />} />
            <Route path="user/edit-profile" element={<EditProfile />} />
            <Route path="user/profile" element={<Profile />} />
            <Route path="tool" element={<Tool />} />
            <Route path="tool/user-tools" element={<UserTools />} />
            <Route path="tool/add-edit-tool" element={<AddEditTool />} />
            <Route path="demand/add-edit-demand" element={<AddEditDemand />} />
            <Route path="demand" element={<Demand />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <root.div>
        <ReactQueryDevtools initialIsOpen={false} />
      </root.div>
    </QueryClientProvider>
  );
}

export default App;
