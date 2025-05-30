"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [venueManager, setVenueManager] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://v2.api.noroff.dev";
  const API_KEY = process.env.NEXT_PUBLIC_NOROFF_API_KEY || "";

  // Validate Noroff email
  const validateEmail = (email: string) => {
    const noroffEmailRegex = /^[a-zA-Z0-9._-]+@stud\.noroff\.no$/;
    return noroffEmailRegex.test(email);
  };

  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    if (newEmail && !validateEmail(newEmail)) {
      setEmailError("Email must be a valid stud.noroff.no address");
    } else {
      setEmailError(null);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Validate email before submission
    if (!validateEmail(email)) {
      setEmailError("Email must be a valid stud.noroff.no address");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      // Register the user
      const registerRes = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Noroff-API-Key": API_KEY },
        body: JSON.stringify({
          name,
          email,
          password,
          bio: bio || undefined,
          venueManager,
        }),
      });
      
      const registerData = await registerRes.json();
      
      if (!registerRes.ok) {
        setError(registerData?.errors?.[0]?.message || registerData?.error || "Registration failed");
        setIsLoading(false);
        return;
      }
      
      // Automatically log the user in after successful registration
      const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Noroff-API-Key": API_KEY },
        body: JSON.stringify({ email, password }),
      });
      
      const loginData = await loginRes.json();
      
      if (!loginRes.ok) {
        // If login fails, still consider registration successful but redirect to login
        router.push("/login");
        return;
      }
      
      if (loginData?.data?.accessToken && loginData?.data?.name) {
        // Store auth data in localStorage
        localStorage.setItem("accessToken", loginData.data.accessToken);
        localStorage.setItem("username", loginData.data.name);
        
        // Store additional user data
        if (loginData.data.email) {
          localStorage.setItem("email", loginData.data.email);
        }
        
        // Set venue manager status
        localStorage.setItem("venueManager", JSON.stringify(venueManager));
        
        // Store avatar and banner if they exist in the response
        if (loginData.data.avatar) {
          localStorage.setItem("avatar", JSON.stringify(loginData.data.avatar));
        }
        if (loginData.data.banner) {
          localStorage.setItem("banner", JSON.stringify(loginData.data.banner));
        }
        
        // Check if there's a booking intent in session storage
        const bookingIntent = sessionStorage.getItem("bookingIntent");
        if (bookingIntent) {
          try {
            const bookingData = JSON.parse(bookingIntent);
            if (bookingData && bookingData.venueId) {
              // Clear the booking intent from session storage
              sessionStorage.removeItem("bookingIntent");
              // Redirect back to the venue page
              router.push(`/venues/${bookingData.venueId}`);
              return;
            }
          } catch (error) {
            console.error("Error parsing booking intent:", error);
          }
        }
        
        // Default redirect if no booking intent
        router.push("/profile");
      } else {
        // If we can't get token, redirect to login
        router.push("/login");
      }
    } catch (error: unknown) {
      setError("Network error");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your details below to register a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Username</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Username"
                  required
                  minLength={3}
                  maxLength={30}
                  pattern="^\w+$"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="blabla@stud.noroff.no"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isLoading}
                  className={emailError ? "border-red-500" : ""}
                />
                {emailError && (
                  <div className="text-red-600 text-xs mt-1">{emailError}</div>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="bio">Bio (optional)</Label>
                <Input
                  id="bio"
                  type="text"
                  maxLength={160}
                  value={bio}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBio(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="venueManager"
                  type="checkbox"
                  checked={venueManager}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVenueManager(e.target.checked)}
                  disabled={isLoading}
                />
                <Label htmlFor="venueManager">Register as Venue Manager</Label>
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Register"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-pink-600 underline underline-offset-4 hover:text-pink-700">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}