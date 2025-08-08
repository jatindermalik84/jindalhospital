export interface Tenant {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  theme: TenantTheme;
  subscription: SubscriptionPlan;
  branches: Branch[];
  settings: TenantSettings;
}

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isMainBranch: boolean;
  settings: BranchSettings;
}

export interface TenantTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logo?: string;
  favicon?: string;
  brandName: string;
  brandSlogan?: string;
  customCss?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  features: string[];
  maxBranches: number;
  maxUsers: number;
  isActive: boolean;
  expiresAt: string;
}

export interface TenantSettings {
  timezone: string;
  dateFormat: string;
  currency: string;
  language: string;
  features: {
    appointments: boolean;
    ivfTracking: boolean;
    billing: boolean;
    inventory: boolean;
    reports: boolean;
    telemedicine: boolean;
  };
}

export interface BranchSettings {
  operatingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  departments: string[];
  services: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
  branchId?: string;
  isActive: boolean;
  permissions: Permission[];
}

export type UserRole = 
  | 'super_admin'    // Platform admin
  | 'tenant_admin'   // Hospital admin
  | 'branch_admin'   // Branch admin
  | 'doctor'
  | 'nurse'
  | 'receptionist'
  | 'lab_technician'
  | 'pharmacist'
  | 'accountant';

export interface Permission {
  module: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  selectedBranch: Branch | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}