import './App.css'
import AuthProvider from './api/AuthContex'
import LoginPage from './ components/LoginPage'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import RetailCheckoutPage from './ components/RetailCheckoutPage'
import { ReactNode } from "react";
import { useAuth } from "./api/AuthContex";
import CashierBills from './ components/CashierBills'
import BillDetail from './ components/BillDetail'

function App() {
  function AuthenticatedRoute({ children }: { children: ReactNode }) {
    const authContext = useAuth()
    
    if (authContext.isAuthenticated){
      console.log(authContext)
      return children
    }
    else
      return <Navigate to="/" />
  }

  return (
    <div className="RcApp">
       <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage/>}/>

            <Route path="/create-bill" element={
              <AuthenticatedRoute>
                <RetailCheckoutPage />
              </AuthenticatedRoute>
            }/>

            <Route path="/cashiers-bills" element={
              <AuthenticatedRoute>
                <CashierBills />
              </AuthenticatedRoute>
            }/>

            <Route path="/bill/:billId" element={
              <AuthenticatedRoute>
                <BillDetail />
              </AuthenticatedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default App
