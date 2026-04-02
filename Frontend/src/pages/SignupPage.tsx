import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus, Camera, X } from "lucide-react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { toast } from "sonner";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id.apps.googleusercontent.com";

const SignupPage = () => {
  const { signup, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || "/profile";

  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [avatar, setAvatar] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  if (isLoggedIn) {
    navigate(from);
    return null;
  }

  const set = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[+\d\s]{7,15}$/.test(form.phone)) e.phone = "Enter a valid phone number";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    signup({ ...form, avatar: avatar || undefined });
    toast.success("Account created successfully!");
    navigate(from);
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      console.log("Google credential:", credentialResponse.credential);
      // Mock: create user from Google (name/email would come from decoded token in real backend)
      signup({ name: "Google User", email: "google@example.com", phone: "", avatar: undefined });
      toast.success("Signed up with Google!");
      navigate(from);
    } catch {
      toast.error("Google Sign-Up failed");
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB"); return; }
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <main className="pt-24 pb-20 min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md animate-fade-in-up px-4">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold mb-3 animate-fade-in-down">Create Account</h1>
          <p className="font-body text-muted-foreground animate-fade-in-up stagger-1">Join us to order, reserve, and more</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 space-y-5 hover-lift animate-scale-in">
          {/* Google Sign-Up */}
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google Sign-Up failed")}
                theme="outline"
                size="large"
                text="signup_with"
                shape="rectangular"
                width="100%"
              />
            </div>
          </GoogleOAuthProvider>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="px-2 bg-card text-muted-foreground font-body">or sign up with details</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Image — optional */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                {avatar ? (
                  <img src={avatar} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-primary/30" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
                    <Camera className="w-7 h-7 text-muted-foreground" />
                  </div>
                )}
                {avatar && (
                  <button type="button" onClick={() => setAvatar(null)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="font-body text-xs text-primary hover:underline">
                {avatar ? "Change photo" : "Upload profile photo (optional)"}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            {/* Name */}
            <div>
              <label className="font-body text-sm font-medium text-foreground mb-1 block">Full Name <span className="text-destructive">*</span></label>
              <input
                type="text"
                placeholder="Rahul Sharma"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${errors.name ? "border-destructive" : "border-border"}`}
              />
              {errors.name && <p className="font-body text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="font-body text-sm font-medium text-foreground mb-1 block">Email <span className="text-destructive">*</span></label>
              <input
                type="email"
                placeholder="rahul@example.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${errors.email ? "border-destructive" : "border-border"}`}
              />
              {errors.email && <p className="font-body text-xs text-destructive mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="font-body text-sm font-medium text-foreground mb-1 block">Phone Number <span className="text-destructive">*</span></label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${errors.phone ? "border-destructive" : "border-border"}`}
              />
              {errors.phone && <p className="font-body text-xs text-destructive mt-1">{errors.phone}</p>}
            </div>

            {/* Address — optional */}
            <div>
              <label className="font-body text-sm font-medium text-foreground mb-1 block">
                Address <span className="font-body text-xs text-muted-foreground">(optional)</span>
              </label>
              <textarea
                placeholder="123, MG Road, Mumbai, Maharashtra - 400001"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-border font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none"
              />
            </div>

            <Button type="submit" className="w-full font-body gap-2 h-11">
              <UserPlus className="w-4 h-4" /> Create Account
            </Button>
          </form>
        </div>

        <p className="text-center font-body text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" state={location.state} className="text-primary hover:underline font-semibold">Sign in</Link>
        </p>
        <p className="text-center text-xs text-muted-foreground font-body mt-2">
          By signing up, you agree to our <Link to="/terms" className="text-primary hover:underline">Terms</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </main>
  );
};

export default SignupPage;
