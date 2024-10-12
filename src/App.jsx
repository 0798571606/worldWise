import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Product from './pages/Product';
import HomePage from './pages/homePage';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import AppLayout from './pages/AppLayout';
import Cities from './components/CityList';
import CountryList from './components/CountryList';
import City from './components/City';
import Form from './components/Form';
import { CitiesProvider } from './Contexts/CitiesContext';
import { AuthProvider } from './Contexts/fakeAuthContext';
import ProtectedRoute from './pages/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path='/product' element={<Product />} />
            <Route path='/pricing' element={<Pricing />} />
            <Route path='/login' element={<Login />} />
            <Route
              path='/app'
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate replace to='cities' />} />
              <Route path='cities' element={<Cities />} />

              <Route path='cities/:id' element={<City />} />

              <Route path='countries' element={<CountryList />} />
              <Route path='form' element={<Form />} />
            </Route>
            <Route path='*' element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}
