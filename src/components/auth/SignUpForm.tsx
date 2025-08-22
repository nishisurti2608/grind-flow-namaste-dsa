import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpForm({ onSubmit, isLoading }) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ email, password, fullName });
            }}
            className="space-y-4"
        >
            <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="signupEmail">Email</Label>
                <Input
                    id="signupEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="signupPassword">Password</Label>
                <Input
                    id="signupPassword"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                />
            </div>

            <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600"
                disabled={isLoading}
            >
                {isLoading ? "Creating account..." : "Create Account"}
            </Button>
        </form>
    );
}
