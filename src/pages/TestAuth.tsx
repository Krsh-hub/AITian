import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TestAuth = () => {
  const { user, loading, signIn, signOut } = useAuth();

  const handleTestSignIn = async () => {
    try {
      const { error } = await signIn("test@example.com", "password123");
      if (error) {
        console.error("Sign in error:", error);
        alert(`Sign in failed: ${error.message}`);
      } else {
        alert("Sign in successful!");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Unexpected error occurred");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center">Loading authentication...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Current user:</p>
            <p className="font-medium">
              {user ? user.email : "Not signed in"}
            </p>
          </div>
          
          <div className="space-y-2">
            {user ? (
              <Button onClick={signOut} className="w-full">
                Sign Out
              </Button>
            ) : (
              <Button onClick={handleTestSignIn} className="w-full">
                Test Sign In
              </Button>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>This is a test page to verify authentication is working.</p>
            <p>Check the browser console for any errors.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestAuth;
