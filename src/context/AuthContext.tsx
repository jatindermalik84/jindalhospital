import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, User, Tenant, Branch } from '@/types/tenant';
import { mockUsers, mockTenants } from '@/lib/mockData';

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; tenant: Tenant } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SELECT_BRANCH'; payload: Branch }
  | { type: 'UPDATE_TENANT_THEME'; payload: Partial<Tenant['theme']> };

const initialState: AuthState = {
  user: null,
  tenant: null,
  selectedBranch: null,
  isAuthenticated: false,
  isLoading: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    
    case 'LOGIN_SUCCESS':
      const { user, tenant } = action.payload;
      const defaultBranch = user.branchId 
        ? tenant.branches.find(b => b.id === user.branchId) || tenant.branches[0]
        : tenant.branches[0];
      
      return {
        ...state,
        user,
        tenant,
        selectedBranch: defaultBranch,
        isAuthenticated: true,
        isLoading: false,
      };
    
    case 'LOGIN_FAILURE':
      return { ...state, isLoading: false };
    
    case 'LOGOUT':
      return initialState;
    
    case 'SELECT_BRANCH':
      return { ...state, selectedBranch: action.payload };
    
    case 'UPDATE_TENANT_THEME':
      if (!state.tenant) return state;
      return {
        ...state,
        tenant: {
          ...state.tenant,
          theme: { ...state.tenant.theme, ...action.payload }
        }
      };
    
    default:
      return state;
  }
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  selectBranch: (branch: Branch) => void;
  updateTenantTheme: (theme: Partial<Tenant['theme']>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Apply tenant theme to CSS variables
  useEffect(() => {
    if (state.tenant?.theme) {
      const root = document.documentElement;
      const theme = state.tenant.theme;
      
      if (theme.primaryColor) {
        root.style.setProperty('--primary', theme.primaryColor);
      }
      if (theme.secondaryColor) {
        root.style.setProperty('--secondary', theme.secondaryColor);
      }
      if (theme.accentColor) {
        root.style.setProperty('--accent', theme.accentColor);
      }
      
      // Update page title and favicon if provided
      if (theme.brandName) {
        document.title = `${theme.brandName} - Hospital Management System`;
      }
      if (theme.favicon) {
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (link) link.href = theme.favicon;
      }
    }
  }, [state.tenant?.theme]);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication
      const user = mockUsers.find(u => u.email === email);
      if (!user) {
        dispatch({ type: 'LOGIN_FAILURE' });
        return false;
      }
      
      const tenant = mockTenants.find(t => t.id === user.tenantId);
      if (!tenant) {
        dispatch({ type: 'LOGIN_FAILURE' });
        return false;
      }
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, tenant } });
      
      // Store in localStorage for persistence
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_tenant', JSON.stringify(tenant));
      
      return true;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_tenant');
    
    // Reset CSS variables to default
    const root = document.documentElement;
    root.style.removeProperty('--primary');
    root.style.removeProperty('--secondary');
    root.style.removeProperty('--accent');
    document.title = 'Hospital Management System';
  };

  const selectBranch = (branch: Branch) => {
    dispatch({ type: 'SELECT_BRANCH', payload: branch });
    localStorage.setItem('selected_branch', JSON.stringify(branch));
  };

  const updateTenantTheme = (theme: Partial<Tenant['theme']>) => {
    dispatch({ type: 'UPDATE_TENANT_THEME', payload: theme });
  };

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    const savedTenant = localStorage.getItem('auth_tenant');
    const savedBranch = localStorage.getItem('selected_branch');
    
    if (savedUser && savedTenant) {
      const user = JSON.parse(savedUser);
      const tenant = JSON.parse(savedTenant);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, tenant } });
      
      if (savedBranch) {
        const branch = JSON.parse(savedBranch);
        dispatch({ type: 'SELECT_BRANCH', payload: branch });
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      selectBranch,
      updateTenantTheme,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}