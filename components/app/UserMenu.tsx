import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PersonIcon } from "@radix-ui/react-icons";
import { ReactNode, useEffect } from "react";
import Link from 'next/link';
import LoaderSpinner from "./LoaderSpinner";
import { useAdminCheck } from '@/app/hooks/useAdminCheck';
import { Badge } from "@/components/ui/badge";

export function UserMenu({ children }: { children: ReactNode }) {
  const user = useQuery(api.users.viewer);
  const isAdmin = useAdminCheck();

  useEffect(() => {
    console.log("Component: UserMenu");
    if (user === undefined) {
      console.log("User loading...");
    } else if (user === null) {
      console.log("User is not authenticated or not found");
    } else if (user.isAnonymous) {
      console.log("User is Anonymous");
    } else {
      console.log("User: ", user);
    }
    console.log("Is Admin: ", isAdmin);
  }, [user, isAdmin]);

  return (
    <div className="px-4">
      <AuthLoading>
        <LoaderSpinner />
      </AuthLoading>

      <Authenticated>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative w-10 h-10 rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <PersonIcon className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium leading-none">{children}</p>
                  {isAdmin && <Badge variant="destructive">Admin</Badge>}
                </div>
                <p className="text-xs leading-none text-muted-foreground">{user?.name || user?.email || "Unknown"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isAdmin && (
              <DropdownMenuItem>
                <Link href="/admin" className="w-full">
                  Admin Dashboard
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/profile" className="w-full">
                Profile
              </Link>
            </DropdownMenuItem>
            <SignOutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </Authenticated>

      <Unauthenticated>
        <Link href="/auth/login" passHref>
          <Button size="sm">
            Sign In
          </Button>
        </Link>
      </Unauthenticated>
    </div>
  );
}

function SignOutButton() {
  const { signOut } = useAuthActions();
  return (
    <DropdownMenuItem
      onClick={() => void signOut()}
      className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
    >
      Sign out
    </DropdownMenuItem>
  );
}