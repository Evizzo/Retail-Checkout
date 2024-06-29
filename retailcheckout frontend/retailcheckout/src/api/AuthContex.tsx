import { ReactNode, createContext, useContext, useState } from "react";
import { apiClient } from "../api/ApiClient";
import { executeJwtAuthenticationService, executeLogout } from "./ApiService";

export const AuthContext = createContext({
    isAuthenticated: false,
    login: async (_username: string, _password: string) => false,
    logout: () => {},
    username: '',
    token: '',
    role: '',
  })
  
export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }: { children: ReactNode }) {

    const [isAuthenticated, setAuthenticated] = useState(false)
    const [username, setUsername] = useState("")
    const [token, setToken] = useState("")
    const [role, setRole] = useState("")

    async function login(username: string, password: string) {
        try {
            const response = await executeJwtAuthenticationService(username, password)
            console.log(response.status)
            if(response.status === 200){
                console.log("resp stat is 200")
                const jwtToken = 'Bearer ' + response.data.token
                console.log(jwtToken)
                
                setAuthenticated(true)
                setUsername(username)
                setToken(jwtToken)
                setRole(response.data.role)

                apiClient.interceptors.request.use(
                    (config) => {
                        console.log('intercepting and adding a token')
                        config.headers.Authorization = jwtToken
                        return config
                    }
                )

                return true            
            } else {
                console.log("failed at authcontext 47")
                logout()
                return false
            }    
        } catch(error) {
            console.error(error)
            logout()
            return false
        }
    }

    function logout() {
        async function performLogout() {
          try {
            const response = await executeLogout();
            console.log(response.status)
            if (response.status === 200) {
              setAuthenticated(false);
              setToken('');
              setUsername('');
              setRole('');

              window.location.reload()

              console.log('Logout successful');
            } else {
              console.error('Logout failed');
            }
          } catch (error) {
            console.error('Error during logout:', error);
          }
        }
      
        performLogout();
      }

    return (
        <AuthContext.Provider value={ {isAuthenticated, login, logout, username, token, role }  }>
            {children}
        </AuthContext.Provider>
    )
} 