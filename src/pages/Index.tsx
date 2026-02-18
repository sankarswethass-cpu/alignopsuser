import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Shield, Users, TrendingUp, DollarSign, BarChart3, Zap, Clock, Target, Layers, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { login as apiLogin, signup as apiSignup } from "@/api/authApi";

const features = [
  { icon: Settings, label: "Workflow Automation" },
  { icon: Layers, label: "Process Management" },
  { icon: Shield, label: "Secure & Compliant" },
  { icon: Users, label: "Team Collaboration" },
  { icon: DollarSign, label: "Cost Optimization" },
  { icon: BarChart3, label: "Real-time Analytics" },
];

const cards = [
  { icon: Zap, title: "Lightning Fast", desc: "Deploy workflows in minutes, not weeks" },
  { icon: Clock, title: "24/7 Monitoring", desc: "Always-on oversight for your operations" },
  { icon: Target, title: "Precision Control", desc: "Fine-tuned management at every level" },
  { icon: Layers, title: "Scalable Design", desc: "Grows seamlessly with your organization" },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    try {
      const user = await apiLogin(email, password);
      localStorage.setItem("alignops_user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err?.message || "Unable to log in. Please check your credentials.",
        variant: "destructive"
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }
    try {
      const user = await apiSignup(fullName, email, password);
      localStorage.setItem("alignops_user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Signup failed",
        description: err?.message || "Unable to create account. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[55%] gradient-primary flex-col justify-between p-10 text-primary-foreground">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center font-bold text-lg">
              A
            </div>
            <span className="text-xl font-bold">AlignOps</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Streamline Your<br />Operations
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-md">
            Unify workflows, automate processes, and empower your team with a single, intelligent operations platform.
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-3 mb-16">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-sm"
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {cards.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-5 rounded-xl bg-primary-foreground/10 border border-primary-foreground/10"
              >
                <Icon className="w-5 h-5 mb-3 text-primary-foreground/80" />
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-sm text-primary-foreground/60">{desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-primary-foreground/40">© 2026 AlignOps. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center font-bold text-lg text-primary-foreground">
              A
            </div>
            <span className="text-xl font-bold text-foreground">AlignOps</span>
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome to AlignOps</h2>
          <p className="text-muted-foreground mb-8">Sign in to access your operations dashboard.</p>

          {/* Tabs */}
          <div className="flex mb-8 border-b border-border">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 pb-3 text-center font-medium transition-colors ${
                activeTab === "login"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 pb-3 text-center font-medium transition-colors ${
                activeTab === "signup"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <Label htmlFor="login-email" className="text-sm font-medium text-foreground">Email Address</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="login-password" className="text-sm font-medium text-foreground">Password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full gradient-primary hover:opacity-90 text-primary-foreground h-11">
                Sign In
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button type="button" onClick={() => setActiveTab("signup")} className="text-primary hover:underline">
                  Sign up
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <Label htmlFor="signup-name" className="text-sm font-medium text-foreground">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="signup-email" className="text-sm font-medium text-foreground">Email Address</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="signup-password" className="text-sm font-medium text-foreground">Password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="signup-confirm" className="text-sm font-medium text-foreground">Confirm Password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="signup-confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full gradient-primary hover:opacity-90 text-primary-foreground h-11">
                Sign Up
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button type="button" onClick={() => setActiveTab("login")} className="text-primary hover:underline">
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
