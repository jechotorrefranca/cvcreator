import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();

  const handleSignout = () => {
    void signOut().then(() => {
      router.push("/signin");
    });
  };

  return (
    <div>
      {isAuthenticated && (
        <Button variant="default" size="lg" onClick={handleSignout} className="cursor-pointer">
          Sign out
        </Button>
      )}
    </div>
  );
}
