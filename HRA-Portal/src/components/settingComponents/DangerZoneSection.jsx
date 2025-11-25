"use client";
import { Trash2 } from "lucide-react";
import Card from "../ui/Card";
import CardHeader from "../ui/CardHeader";
import GhostButton from "../ui/GhostButton";

export default function DangerZoneSection({ deleting, handleDeleteAccount }) {
  return (
    <Card>
      <CardHeader
        icon={<Trash2 />}
        title="Danger Zone"
        subtitle="Irreversible actions — proceed with caution."
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Sign Out Everywhere */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">
            Sign out everywhere
          </h4>
          <p className="text-sm text-gray-500 mb-3">
            Invalidate all active sessions (logout from all devices).
          </p>
          <div className="flex gap-3">
            <GhostButton>Sign out from other devices</GhostButton>
            <GhostButton>Revoke API tokens</GhostButton>
          </div>
        </div>

        {/* Delete Account */}
        <div>
          <h4 className="font-medium mb-2 text-red-600">Delete account</h4>
          <p className="text-sm text-gray-500 mb-3">
            This will permanently delete your account and data.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              disabled={deleting}
            >
              {deleting ? (
                "Deleting..."
              ) : (
                <>
                  <Trash2 className="inline-block mr-2" />
                  Delete account
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
