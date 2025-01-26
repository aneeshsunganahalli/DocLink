import React from "react";
import { createContext } from "react";
import { doctors } from "../assets/assets_frontend/assets";

export const AppContext = createContext();

export default function AppContextProvider(props) {

  const currencySymbol = '$'
  
  const value = {
    doctors,
    currencySymbol
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

