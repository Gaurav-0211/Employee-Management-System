"use client";
import { EyeOff } from "lucide-react";
import { Button, Card, CardHeader, GhostButton, Switch } from "../ui";

export default function PrivacySection({
  profileVisibility,
  setProfileVisibility,
  dataSharing,
  setDataSharing,
}) {
  return (
    <Card>
      <CardHeader
        icon={<EyeOff />}
        title="Privacy & Connected Apps"
        subtitle="Control who sees your profile and which apps are connected."
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Privacy Settings */}
        <div>
          <div className="mb-2 font-medium text-gray-700">Privacy</div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm">Profile visibility</div>
            <Switch
              checked={profileVisibility}
              onChange={setProfileVisibility}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">Data sharing with partners</div>
            <Switch checked={dataSharing} onChange={setDataSharing} />
          </div>
        </div>

        {/* Connected Apps */}
        <div>
          <div className="mb-2 font-medium text-gray-700">Connected apps</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-700">Google</div>
                <div className="text-sm text-gray-500">OAuth connected</div>
              </div>
              <GhostButton>Disconnect</GhostButton>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-700">Slack</div>
                <div className="text-sm text-gray-500">Not connected</div>
              </div>
              <Button>Connect</Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
