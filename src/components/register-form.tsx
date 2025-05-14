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
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://v2.api.noroff.dev";
  const API_KEY = process.env.NEXT_PUBLIC_NOROFF_API_KEY || "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": API_KEY },
        body: JSON.stringify({
          name,
          email,
          password,
          bio: bio || undefined,
          venueManager,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.errors?.[0]?.message || data?.error || "Registration failed");
        setIsLoading(false);
        return;
      }
      router.push("/login");
    } catch {
      setError("Network error");
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
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="username"
                  required
                  minLength={3}
                  maxLength={30}
                  pattern="^\w+$"
                  value={name}
                  onChange={e => setName(e.target.value)}
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
                  pattern="^[\\w.-]+@stud\\.noroff\\.no$"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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
                  onChange={e => setBio(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="venueManager"
                  type="checkbox"
                  checked={venueManager}
                  onChange={e => setVenueManager(e.target.checked)}
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