import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BookOpen, User, Mail, Lock, Sparkles, Star, Users, Award } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      displayName: "",
    },
  });

  const onLogin = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const onRegister = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Hero Section */}
        <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800">QuranicFlow</h1>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Master Quranic Arabic with 
              <span className="text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text">
                {" "}Confidence
              </span>
            </h2>
            
            <p className="text-xl text-slate-600 leading-relaxed">
              Learn 1,611 authentic Quranic words through gamified lessons, 
              achieving 89% comprehension coverage with scholarly accuracy.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200 shadow-lg">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
                <Star className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Authentic Sources</h3>
              <p className="text-sm text-slate-600">
                Every word verified from Lane's Lexicon and classical Islamic scholarship
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-teal-200 shadow-lg">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Smart Learning</h3>
              <p className="text-sm text-slate-600">
                AI-powered spaced repetition adapts to your learning pace
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-cyan-200 shadow-lg">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Family Learning</h3>
              <p className="text-sm text-slate-600">
                Study together with family members and track group progress
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-200 shadow-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Achievements</h3>
              <p className="text-sm text-slate-600">
                Unlock milestones and track your spiritual learning journey
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">1,611</div>
                <div className="text-emerald-100 text-sm">Quranic Words</div>
              </div>
              <div>
                <div className="text-2xl font-bold">89%</div>
                <div className="text-emerald-100 text-sm">Coverage</div>
              </div>
              <div>
                <div className="text-2xl font-bold">6</div>
                <div className="text-emerald-100 text-sm">Learning Phases</div>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Form Section */}
        <div className="order-1 lg:order-2">
          <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 pb-6">
              <CardTitle className="text-2xl font-bold text-slate-900">
                {isLogin ? "Welcome Back" : "Join QuranicFlow"}
              </CardTitle>
              <p className="text-slate-600">
                {isLogin 
                  ? "Continue your journey of Quranic understanding" 
                  : "Begin your blessed journey of Arabic learning"
                }
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {isLogin ? (
                /* Login Form */
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-slate-700">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        {...loginForm.register("username")}
                        id="username"
                        placeholder="Enter your username"
                        className="pl-10 bg-white border-slate-200 focus:border-emerald-400 focus:ring-emerald-400"
                      />
                    </div>
                    {loginForm.formState.errors.username && (
                      <p className="text-sm text-red-600">{loginForm.formState.errors.username.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        {...loginForm.register("password")}
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        className="pl-10 bg-white border-slate-200 focus:border-emerald-400 focus:ring-emerald-400"
                      />
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  {loginMutation.isError && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        Login failed. Please check your credentials and try again.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              ) : (
                /* Register Form */
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-slate-700">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        {...registerForm.register("displayName")}
                        id="displayName"
                        placeholder="Enter your full name"
                        className="pl-10 bg-white border-slate-200 focus:border-emerald-400 focus:ring-emerald-400"
                      />
                    </div>
                    {registerForm.formState.errors.displayName && (
                      <p className="text-sm text-red-600">{registerForm.formState.errors.displayName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerUsername" className="text-slate-700">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        {...registerForm.register("username")}
                        id="registerUsername"
                        placeholder="Choose a username"
                        className="pl-10 bg-white border-slate-200 focus:border-emerald-400 focus:ring-emerald-400"
                      />
                    </div>
                    {registerForm.formState.errors.username && (
                      <p className="text-sm text-red-600">{registerForm.formState.errors.username.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        {...registerForm.register("email")}
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        className="pl-10 bg-white border-slate-200 focus:border-emerald-400 focus:ring-emerald-400"
                      />
                    </div>
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-600">{registerForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerPassword" className="text-slate-700">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        {...registerForm.register("password")}
                        type="password"
                        id="registerPassword"
                        placeholder="Create a secure password"
                        className="pl-10 bg-white border-slate-200 focus:border-emerald-400 focus:ring-emerald-400"
                      />
                    </div>
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-600">{registerForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  {registerMutation.isError && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        Registration failed. Please try again or choose a different username.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              )}

              {/* Toggle Form */}
              <div className="text-center pt-4 border-t border-slate-200">
                <p className="text-slate-600 text-sm mb-2">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </p>
                <Button
                  variant="ghost"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                >
                  {isLogin ? "Sign up for free" : "Sign in here"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}