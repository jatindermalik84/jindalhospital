import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { demoCredentials } from '@/lib/mockData';
import { Heart, Building2, Shield, Users } from 'lucide-react';

export function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(formData.email, formData.password);
    if (!success) {
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleDemoLogin = (email: string, password: string) => {
    setFormData({ email, password });
    setError('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding */}
        <div className="hidden md:block space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary">Hospital ERP</h1>
                <p className="text-muted-foreground">Multi-Tenant Management System</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-card border">
              <Building2 className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Multi-Branch</h3>
              <p className="text-sm text-muted-foreground">Manage multiple hospital locations</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-card border">
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Secure</h3>
              <p className="text-sm text-muted-foreground">Role-based access control</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-card border">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Multi-Tenant</h3>
              <p className="text-sm text-muted-foreground">Isolated hospital instances</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-card border">
              <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Patient Care</h3>
              <p className="text-sm text-muted-foreground">Comprehensive healthcare</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-brand">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to your hospital management system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <Separator />

              <div className="space-y-3">
                <p className="text-sm text-center text-muted-foreground font-medium">
                  Demo Accounts
                </p>
                <div className="grid gap-2">
                  {demoCredentials.map((cred, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left"
                      onClick={() => handleDemoLogin(cred.email, cred.password)}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{cred.name}</div>
                        <div className="text-xs text-muted-foreground">{cred.email}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}