import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, Facebook, Apple } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Logo from "@/components/Logo";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login:", { email, password });
  };

  const handleSocialLogin = (provider: string) => {
    // Handle social login
    console.log("Social login:", provider);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Logo */}
        <div className="text-center space-y-2">
          <Logo className="h-12 w-12 mx-auto" />
          <h1 className="text-2xl font-bold gradient-text">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your Shipnix account</p>
        </div>

        <Card className="glass-card shadow-xl-colored">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Choose your preferred sign-in method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Social Login Buttons */}
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSocialLogin("google")}
                className="h-12 relative hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/20 transition-all duration-300"
              >
                <FcGoogle className="h-5 w-5 mr-3" />
                Continue with Google
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleSocialLogin("facebook")}
                className="h-12 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 transition-all duration-300"
              >
                <Facebook className="h-5 w-5 mr-3 fill-white" />
                Continue with Facebook
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleSocialLogin("apple")}
                className="h-12 bg-black hover:bg-gray-800 text-white border-black hover:border-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 transition-all duration-300"
              >
                <Apple className="h-5 w-5 mr-3" />
                Continue with Apple
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-10 w-10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" className="rounded border border-input" />
                  <span>Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full h-12 btn-gradient">
                Sign In
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/register" className="text-primary hover:underline font-medium">
                Create one now
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>By signing in, you agree to our</p>
          <div className="space-x-4 mt-1">
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}