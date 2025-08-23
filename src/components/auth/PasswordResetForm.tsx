import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PasswordResetForm({ onSubmit, isLoading }) {
    const [newPassword, setNewPassword] = useState("");

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ newPassword });
            }}
            className="space-y-4"
        >
            <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    required
                />
            </div>

            <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600"
                disabled={isLoading}
            >
                {isLoading ? "Updating..." : "Update Password"}
            </Button>
        </form>
    );
}
