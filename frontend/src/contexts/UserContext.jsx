import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Use sessionStorage to persist logout state across page reloads
  const [isLoggedOut, setIsLoggedOut] = useState(() => {
    return sessionStorage.getItem('isLoggedOut') === 'true';
  });
  const navigate = useNavigate();

  // Base API URL
  const API_BASE = 'http://localhost:5000/apiv1';

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    console.log('🔍 Checking auth status...');
    console.log('🚪 Is logged out:', isLoggedOut);
    
    // Don't check auth if user has explicitly logged out
    if (isLoggedOut) {
      console.log('❌ User is logged out, skipping auth check');
      setUser(null);
      setLoading(false);
      return;
    }

    // Check if logout happened recently (within the last 5 minutes)
    const logoutTimestamp = sessionStorage.getItem('logoutTimestamp');
    if (logoutTimestamp) {
      const timeSinceLogout = Date.now() - parseInt(logoutTimestamp);
      const fiveMinutes = 5 * 60 * 1000;
      
      console.log('⏰ Time since logout:', timeSinceLogout, 'ms');
      
      if (timeSinceLogout < fiveMinutes) {
        console.log('❌ Recent logout detected, blocking auth');
        setUser(null);
        setLoading(false);
        return;
      } else {
        console.log('✅ Old logout timestamp cleared');
        // Clear old logout timestamp
        sessionStorage.removeItem('logoutTimestamp');
        sessionStorage.removeItem('isLoggedOut');
        setIsLoggedOut(false);
      }
    }

    try {
      console.log('📡 Making auth verification request...');
      const response = await fetch(`${API_BASE}/auth/verify-token`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Auth response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Auth response data:', { verified: data.verified, hasUser: !!data.user });
        
        if (data.verified && data.user && !isLoggedOut) {
          console.log('🎉 User authenticated successfully');
          setUser(data.user);
        } else {
          console.log('❌ Token invalid or user not found');
          // Token is invalid or user not found
          setUser(null);
        }
      } else {
        console.log('❌ Authentication failed');
        // Authentication failed - clear user state
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setIsLoggedOut(false); // Reset logout state on successful login
        // Clear logout state from sessionStorage
        sessionStorage.removeItem('isLoggedOut');
        sessionStorage.removeItem('logoutTimestamp');
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Server error' };
    }
  };

  const logout = async () => {
    console.log('🚪 Logout initiated...');
    
    try {
      // Call logout endpoint to clear HTTP-only cookies
      console.log('📡 Calling backend logout...');
      const response = await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        console.log('✅ Backend logout successful');
      } else {
        console.error('❌ Backend logout failed, status:', response.status);
      }
    } catch (error) {
      console.error('❌ Logout network error:', error);
    }
    
    // Always clear the user state regardless of server response
    console.log('🧹 Clearing frontend state...');
    setUser(null);
    setLoading(false);
    setIsLoggedOut(true); // Mark as explicitly logged out
    
    // Persist logout state and timestamp
    const logoutTime = Date.now().toString();
    sessionStorage.setItem('isLoggedOut', 'true');
    sessionStorage.setItem('logoutTimestamp', logoutTime);
    console.log('💾 Logout state persisted:', { isLoggedOut: true, timestamp: logoutTime });
    
    // Clear any other potential storage
    localStorage.clear();
    
    // Force navigation to login page
    console.log('🧭 Navigating to login...');
    navigate('/login', { replace: true });
    
    // Force a page reload to completely reset the app state
    setTimeout(() => {
      console.log('🔄 Forcing page reload...');
      window.location.href = '/login';
    }, 100);
  };

  const signup = async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setIsLoggedOut(false); // Reset logout state on successful signup
        // Clear logout state from sessionStorage
        sessionStorage.removeItem('isLoggedOut');
        sessionStorage.removeItem('logoutTimestamp');
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error || data.message };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Server error' };
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      const response = await fetch(`${API_BASE}/auth/update-profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return { success: true, message: 'Profile updated successfully' };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: 'Server error' };
    }
  };

  // API helper function with authentication
  const apiCall = async (endpoint, options = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
    
    const defaultOptions = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      // Handle unauthorized responses
      if (response.status === 401 || response.status === 403) {
        setUser(null);
        navigate('/');
        throw new Error('Authentication required');
      }

      return response;
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
    updateProfile,
    checkAuthStatus,
    apiCall,
    API_BASE,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
