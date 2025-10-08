import { LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router";

export function AuthLayout() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <header className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-3xl font-bold text-primary">L</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Your Website</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back! Please choose an option below
            </p>
          </div>
        </header>

        <div className="space-y-4">
          <Link to="./login" className="block group">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <LogIn className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    Login
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Access your account
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="./register" className="block group">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <UserPlus className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    Register
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Create a new account
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
