import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Building2, ChevronDown, MapPin, Phone, Mail } from 'lucide-react';

export function BranchSelector() {
  const { tenant, selectedBranch, selectBranch, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!tenant || !selectedBranch) return null;

  // Filter branches based on user permissions
  const availableBranches = tenant.branches.filter(branch => {
    // Super admin and tenant admin can access all branches
    if (user?.role === 'super_admin' || user?.role === 'tenant_admin') {
      return true;
    }
    // Other users can only access their assigned branch or main branch
    return branch.id === user?.branchId || branch.isMainBranch;
  });

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-card hover:bg-accent min-w-[200px] justify-between"
        >
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span className="truncate">{selectedBranch.name}</span>
            {selectedBranch.isMainBranch && (
              <Badge variant="secondary" className="text-xs">Main</Badge>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="start" 
        className="w-80 bg-popover border shadow-lg"
      >
        <DropdownMenuLabel className="flex items-center space-x-2">
          <Building2 className="h-4 w-4" />
          <span>Select Branch</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {availableBranches.map((branch) => (
          <DropdownMenuItem
            key={branch.id}
            className="cursor-pointer p-3 focus:bg-accent"
            onClick={() => {
              selectBranch(branch);
              setIsOpen(false);
            }}
          >
            <div className="w-full space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium">{branch.name}</span>
                <div className="flex items-center space-x-1">
                  {branch.isMainBranch && (
                    <Badge variant="secondary" className="text-xs">Main</Badge>
                  )}
                  {selectedBranch.id === branch.id && (
                    <Badge variant="default" className="text-xs">Current</Badge>
                  )}
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{branch.address}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span>{branch.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{branch.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        
        {availableBranches.length === 0 && (
          <DropdownMenuItem disabled>
            <span className="text-muted-foreground">No branches available</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
