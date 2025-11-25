"use client";
import { Shield } from "lucide-react";
import { Button, Card, CardHeader, GhostButton, Switch } from "../ui";

export default function SecuritySection({
  passwords,
  setPasswords,
  twoFactor,
  setTwoFactor,
  handleChangePassword,
}) {
  return (
    <Card>
      <CardHeader
        icon={<Shield />}
        title="Security"
        subtitle="Manage password, two-factor auth and session/logout."
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Change Password */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Change password
          </h4>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <input
              type="password"
              placeholder="Current password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, current: e.target.value }))
              }
              className="w-full p-3 rounded-lg border"
            />
            <input
              type="password"
              placeholder="New password"
              value={passwords.next}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, next: e.target.value }))
              }
              className="w-full p-3 rounded-lg border"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, confirm: e.target.value }))
              }
              className="w-full p-3 rounded-lg border"
            />
            <div className="flex gap-3">
              <Button type="submit">Change password</Button>
              <GhostButton
                onClick={() =>
                  setPasswords({ current: "", next: "", confirm: "" })
                }
              >
                Clear
              </GhostButton>
            </div>
          </form>
        </div>

        {/* Two Factor */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Two-factor authentication
          </h4>
          <p className="text-sm text-gray-500 mb-3">
            Add an extra layer of security to your account.
          </p>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-700">
                Two-Factor Authentication
              </div>
              <div className="text-sm text-gray-500">
                Use authenticator app or SMS.
              </div>
            </div>
            <Switch checked={twoFactor} onChange={setTwoFactor} />
          </div>
          <div className="mt-4 text-sm text-gray-500">
            When enabled, setup instructions will appear on next login.
          </div>
        </div>
      </div>
    </Card>
  );
}
