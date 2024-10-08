// app/hooks/useAdminCheck.ts
import { useQuery } from 'convex/react';
import { useConvexAuth } from "convex/react";
import { api } from '@/convex/_generated/api';

export function useAdminCheck() {
    const { isAuthenticated } = useConvexAuth();
    const user = useQuery(api.users.viewer);
    const adminStatus = useQuery(api.adminCheck.checkAdminStatus, 
      user ? { userId: user._id } : "skip"
    );
  
    return isAuthenticated && !!adminStatus;
  }