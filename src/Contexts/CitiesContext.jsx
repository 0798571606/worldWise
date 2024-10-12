import { createContext, useState, useEffect, useContext, useReducer, act } from 'react';
const BASE_URL = 'http://localhost:9000';

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };

    case 'cities/loaded':
      return { ...state, isLoading: false, cities: action.payLoad };

    case 'city/loaded':
      return { ...state, isLoading: false, currentCity: action.payLoad };

    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payLoad],
        currentCity: action.payLoad,
      };

    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payLoad),
        currentCity: {},
      };
    case 'rejected':
      return { ...state, isLoading: false, payLoad: action.payLoad };
    default:
      throw new Error('Unknown action');
  }
}

const CitiesProvider = ({ children }) => {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: 'loading' });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: 'cities/loaded', payLoad: data });
      } catch {
        dispatch({
          type: 'rejected',
          payLoad: 'This was an error when loading Cities...',
        });
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    if (Number(id) === currentCity.id) return;

    dispatch({ type: 'loading' });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: 'cities/loaded', payLoad: data });
    } catch {
      dispatch({
        type: 'rejected',
        payLoad: 'This was an error when loading City...',
      });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: 'loading' });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      dispatch({ type: 'city/created', payLoad: data });
    } catch {
      dispatch({
        type: 'rejected',
        payLoad: 'This was an error when crating City...',
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: 'loading' });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });
      dispatch({ type: 'city/deleted', payLoad: id });
    } catch {
      dispatch({
        type: 'rejected',
        payLoad: 'This was an error when deleting City...',
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error('CitiesContext was used outside of CitiesProvider');
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { CitiesProvider, useCities };
