"use client";
import { Bell } from "lucide-react";
import { Button, Card, CardHeader, Switch } from "../ui";

export default function PreferencesSection({
  notifications,
  setNotifications,
  themeColor,
  setThemeColor,
  fontSize,
  setFontSize,
  handleSavePreferences,
}) {
  return (
    <Card>
      <CardHeader
        icon={<Bell />}
        title="Notifications & Preferences"
        subtitle="Control notifications, theme and interface preferences."
      />

      <div className="grid md:grid-cols-3 gap-6">
        {/* Notifications */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Notifications</h4>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm">Email notifications</div>
            <Switch checked={notifications} onChange={setNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">Browser push</div>
            <Switch checked={false} onChange={() => {}} />
          </div>
        </div>

        {/* Appearance */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Appearance</h4>
          <div className="space-y-2">
            <select
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              className="w-full p-2 rounded-lg border"
            >
              <option value="indigo">Indigo</option>
              <option value="green">Green</option>
              <option value="purple">Purple</option>
              <option value="red">Red</option>
            </select>

            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-full p-2 rounded-lg border"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>

            <Button onClick={handleSavePreferences}>Save preferences</Button>
          </div>
        </div>

        {/* Language */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Language & Region</h4>
          <select className="w-full p-2 rounded-lg border mb-2">
            <option>English</option>
            <option>Hindi</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
          <select className="w-full p-2 rounded-lg border">
            <option>India (IST)</option>
            <option>GMT</option>
            <option>EST</option>
          </select>
        </div>
      </div>
    </Card>
  );
}
