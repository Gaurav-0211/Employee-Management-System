"use client";
import { motion } from "framer-motion";
import {
  Bell,
  Eye,
  Globe,
  Lock,
  Moon,
  Palette,
  Shield,
  Sun,
  Trash2,
  UserCog,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "../context/ThemeProvider";

// 🔹 Reusable Components
function Card({ children }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-5">
      {children}
    </div>
  );
}
function CardHeader({ children }) {
  return (
    <div className="flex items-center justify-between mb-3">{children}</div>
  );
}
function CardTitle({ children }) {
  return (
    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
      {children}
    </h2>
  );
}
function CardContent({ children }) {
  return <div className="text-gray-600 dark:text-gray-300">{children}</div>;
}
function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
function Switch({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5"></div>
    </label>
  );
}

// 🔹 Main Component
export default function SettingsPage() {
  const { darkMode, setDarkMode } = useTheme();
  const [twoFactor, setTwoFactor] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [themeColor, setThemeColor] = useState("blue");
  const [fontSize, setFontSize] = useState("medium");
  const [layout, setLayout] = useState("standard");
  const [language, setLanguage] = useState("en");
  const [timeZone, setTimeZone] = useState("GMT");
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [messaging, setMessaging] = useState(true);

  return (
    <div
      className={`${
        darkMode ? "dark" : ""
      } min-h-screen p-6 bg-gray-100 dark:bg-gray-900`}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>

        {/* Profile Settings */}
        <SettingsCard
          icon={<UserCog />}
          title="Profile Settings"
          description="Manage your profile details like name, email, and role."
          actionText="Edit Profile"
          action={() => alert("Open Profile Edit Modal")}
        />

        {/* Appearance */}
        <SettingsSwitch
          icon={darkMode ? <Moon /> : <Sun />}
          title="Appearance"
          description="Toggle between light and dark mode."
          checked={darkMode}
          onChange={setDarkMode}
        />

        {/* Notifications */}
        <SettingsSwitch
          icon={<Bell />}
          title="Notifications"
          description="Enable or disable notifications for updates and alerts."
          checked={notifications}
          onChange={setNotifications}
        />

        {/* Security */}
        <SettingsSwitch
          icon={<Shield />}
          title="Security"
          description="Enable two-factor authentication for enhanced security."
          checked={twoFactor}
          onChange={setTwoFactor}
        />

        {/* Password Management */}
        <SettingsCard
          icon={<Lock />}
          title="Password Management"
          description="Change or reset your password."
          actionText="Change Password"
          action={() => alert("Open Change Password Modal")}
        />

        {/* Account Management */}
        <SettingsCard
          icon={<Trash2 />}
          title="Account Management"
          description="Deactivate or permanently delete your account."
          actionText="Manage Account"
          action={() => alert("Open Account Management Modal")}
        />

        {/* Theme Customization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                <Palette /> Theme Customization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block mb-1">Theme Color</label>
                  <select
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                    <option value="red">Red</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Font Size</label>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Layout</label>
                  <select
                    value={layout}
                    onChange={(e) => setLayout(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="standard">Standard</option>
                    <option value="compact">Compact</option>
                    <option value="spacious">Spacious</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Language & Region */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                <Globe /> Language & Region
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block mb-1">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Time Zone</label>
                  <select
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="GMT">GMT</option>
                    <option value="IST">IST</option>
                    <option value="EST">EST</option>
                    <option value="PST">PST</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                <Eye /> Privacy Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span>Profile Visibility</span>
                  <Switch
                    checked={profileVisibility}
                    onChange={setProfileVisibility}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Data Sharing</span>
                  <Switch checked={dataSharing} onChange={setDataSharing} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Allow Messages</span>
                  <Switch checked={messaging} onChange={setMessaging} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// 🔹 Reusable Setting Cards
function SettingsCard({ icon, title, description, actionText, action }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader>
          <CardTitle>
            {icon} {title}
          </CardTitle>
          <Button onClick={action}>{actionText}</Button>
        </CardHeader>
        <CardContent>{description}</CardContent>
      </Card>
    </motion.div>
  );
}

const SettingsSwitch = ({ icon, title, description, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg shadow-md dark:bg-gray-800 bg-gray-100">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
      >
        {icon}
      </button>
    </div>
  );
};
