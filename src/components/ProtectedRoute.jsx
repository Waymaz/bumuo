import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UsernameSetup } from './UsernameSetup'
import { LoadingScreen } from './LoadingScreen'

export const ProtectedRoute = ({ children }) => {
  const { user, loading, needsUsername, handleProfileCreated } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  // Show username setup modal if user needs to set their username
  if (needsUsername) {
    return (
      <>
        {children}
        <UsernameSetup onComplete={handleProfileCreated} />
      </>
    )
  }

  return children
}
