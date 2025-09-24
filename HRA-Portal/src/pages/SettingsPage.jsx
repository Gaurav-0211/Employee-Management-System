// "use client";
// import { motion } from "framer-motion";
// import {
//   Bell,
//   Eye,
//   Globe,
//   Lock,
//   Moon,
//   Palette,
//   Shield,
//   Sun,
//   Trash2,
//   UserCog,
// } from "lucide-react";
// import { useState } from "react";
// import { useTheme } from "../context/ThemeProvider";

// // 🔹 Reusable Components
// function Card({ children }) {
//   return (
//     <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-5">
//       {children}
//     </div>
//   );
// }
// function CardHeader({ children }) {
//   return (
//     <div className="flex items-center justify-between mb-3">{children}</div>
//   );
// }
// function CardTitle({ children }) {
//   return (
//     <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
//       {children}
//     </h2>
//   );
// }
// function CardContent({ children }) {
//   return <div className="text-gray-600 dark:text-gray-300">{children}</div>;
// }
// function Button({ children, className = "", ...props }) {
//   return (
//     <button
//       className={`px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// }
// function Switch({ checked, onChange }) {
//   return (
//     <label className="relative inline-flex items-center cursor-pointer">
//       <input
//         type="checkbox"
//         checked={checked}
//         onChange={(e) => onChange(e.target.checked)}
//         className="sr-only peer"
//       />
//       <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5"></div>
//     </label>
//   );
// }

// // 🔹 Main Component
// export default function SettingsPage() {
//   const { darkMode, setDarkMode } = useTheme();
//   const [twoFactor, setTwoFactor] = useState(false);
//   const [notifications, setNotifications] = useState(true);
//   const [themeColor, setThemeColor] = useState("blue");
//   const [fontSize, setFontSize] = useState("medium");
//   const [layout, setLayout] = useState("standard");
//   const [language, setLanguage] = useState("en");
//   const [timeZone, setTimeZone] = useState("GMT");
//   const [profileVisibility, setProfileVisibility] = useState(true);
//   const [dataSharing, setDataSharing] = useState(false);
//   const [messaging, setMessaging] = useState(true);

//   return (
//     <div
//       className={`${
//         darkMode ? "dark" : ""
//       } min-h-screen p-6 bg-gray-100 dark:bg-gray-900`}
//     >
//       <div className="max-w-5xl mx-auto space-y-6">
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//           Settings
//         </h1>

//         {/* Profile Settings */}
//         <SettingsCard
//           icon={<UserCog />}
//           title="Profile Settings"
//           description="Manage your profile details like name, email, and role."
//           actionText="Edit Profile"
//           action={() => alert("Open Profile Edit Modal")}
//         />

//         {/* Appearance */}
//         <SettingsSwitch
//           icon={darkMode ? <Moon /> : <Sun />}
//           title="Appearance"
//           description="Toggle between light and dark mode."
//           checked={darkMode}
//           onChange={setDarkMode}
//         />

//         {/* Notifications */}
//         <SettingsSwitch
//           icon={<Bell />}
//           title="Notifications"
//           description="Enable or disable notifications for updates and alerts."
//           checked={notifications}
//           onChange={setNotifications}
//         />

//         {/* Security */}
//         <SettingsSwitch
//           icon={<Shield />}
//           title="Security"
//           description="Enable two-factor authentication for enhanced security."
//           checked={twoFactor}
//           onChange={setTwoFactor}
//         />

//         {/* Password Management */}
//         <SettingsCard
//           icon={<Lock />}
//           title="Password Management"
//           description="Change or reset your password."
//           actionText="Change Password"
//           action={() => alert("Open Change Password Modal")}
//         />

//         {/* Account Management */}
//         <SettingsCard
//           icon={<Trash2 />}
//           title="Account Management"
//           description="Deactivate or permanently delete your account."
//           actionText="Manage Account"
//           action={() => alert("Open Account Management Modal")}
//         />

//         {/* Theme Customization */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//         >
//           <Card>
//             <CardHeader>
//               <CardTitle>
//                 <Palette /> Theme Customization
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col gap-3">
//                 <div>
//                   <label className="block mb-1">Theme Color</label>
//                   <select
//                     value={themeColor}
//                     onChange={(e) => setThemeColor(e.target.value)}
//                     className="w-full p-2 border rounded-lg"
//                   >
//                     <option value="blue">Blue</option>
//                     <option value="green">Green</option>
//                     <option value="purple">Purple</option>
//                     <option value="red">Red</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block mb-1">Font Size</label>
//                   <select
//                     value={fontSize}
//                     onChange={(e) => setFontSize(e.target.value)}
//                     className="w-full p-2 border rounded-lg"
//                   >
//                     <option value="small">Small</option>
//                     <option value="medium">Medium</option>
//                     <option value="large">Large</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block mb-1">Layout</label>
//                   <select
//                     value={layout}
//                     onChange={(e) => setLayout(e.target.value)}
//                     className="w-full p-2 border rounded-lg"
//                   >
//                     <option value="standard">Standard</option>
//                     <option value="compact">Compact</option>
//                     <option value="spacious">Spacious</option>
//                   </select>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Language & Region */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5 }}
//         >
//           <Card>
//             <CardHeader>
//               <CardTitle>
//                 <Globe /> Language & Region
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col gap-3">
//                 <div>
//                   <label className="block mb-1">Language</label>
//                   <select
//                     value={language}
//                     onChange={(e) => setLanguage(e.target.value)}
//                     className="w-full p-2 border rounded-lg"
//                   >
//                     <option value="en">English</option>
//                     <option value="es">Spanish</option>
//                     <option value="fr">French</option>
//                     <option value="de">German</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block mb-1">Time Zone</label>
//                   <select
//                     value={timeZone}
//                     onChange={(e) => setTimeZone(e.target.value)}
//                     className="w-full p-2 border rounded-lg"
//                   >
//                     <option value="GMT">GMT</option>
//                     <option value="IST">IST</option>
//                     <option value="EST">EST</option>
//                     <option value="PST">PST</option>
//                   </select>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Privacy Controls */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//         >
//           <Card>
//             <CardHeader>
//               <CardTitle>
//                 <Eye /> Privacy Controls
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col gap-3">
//                 <div className="flex items-center justify-between">
//                   <span>Profile Visibility</span>
//                   <Switch
//                     checked={profileVisibility}
//                     onChange={setProfileVisibility}
//                   />
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span>Data Sharing</span>
//                   <Switch checked={dataSharing} onChange={setDataSharing} />
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span>Allow Messages</span>
//                   <Switch checked={messaging} onChange={setMessaging} />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// // 🔹 Reusable Setting Cards
// function SettingsCard({ icon, title, description, actionText, action }) {
//   return (
//     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
//       <Card>
//         <CardHeader>
//           <CardTitle>
//             {icon} {title}
//           </CardTitle>
//           <Button onClick={action}>{actionText}</Button>
//         </CardHeader>
//         <CardContent>{description}</CardContent>
//       </Card>
//     </motion.div>
//   );
// }

// const SettingsSwitch = ({ icon, title, description, checked, onChange }) => {
//   return (
//     <div className="flex items-center justify-between p-4 rounded-lg shadow-md dark:bg-gray-800 bg-gray-100">
//       <div>
//         <h3 className="font-semibold">{title}</h3>
//         <p className="text-white text-gray-500 dark:text-gray-400">
//           {description}
//         </p>
//       </div>
//       <button
//         onClick={() => onChange(!checked)}
//         className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
//       >
//         {icon}
//       </button>
//     </div>
//   );
// };

//-------------------------------------

"use client";
import { motion } from "framer-motion";
import {
  Bell,
  EyeOff,
  Save,
  Shield,
  Trash2,
  UploadCloud,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white dark:bg-gray-100 shadow-lg rounded-2xl p-6 ${className}`}
    >
      {children}
    </div>
  );
}
function CardHeader({ title, subtitle, icon }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="flex items-center gap-3 text-lg font-semibold text-indigo-700 dark:text-indigo-700">
          {icon}
          <span>{title}</span>
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-gray-600 dark:text-gray-500 mb-1">
        {label}
      </div>
      {children}
    </label>
  );
}
function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] transition ${className}`}
    >
      {children}
    </button>
  );
}
function GhostButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-sm ${className}`}
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
      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5"></div>
    </label>
  );
}

// -------------------- Main Page --------------------
export default function EmployeeSettingsPage() {
  // change this id to test with other employees; ideally derive from logged-in user/session
  const employeeId = 21;
  const baseApi = "http://localhost:8081/api/employees";

  // profile form
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    contactNumber: "",
    address: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // preferences/security
  const [twoFactor, setTwoFactor] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [themeColor, setThemeColor] = useState("indigo");
  const [fontSize, setFontSize] = useState("medium");

  // password
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  // ui state
  const [loading, setLoading] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    setError(null);
    try {
      // try common GET shapes, adapt to your backend
      const tryUrls = [
        `${baseApi}/get-employee/${employeeId}`,
        `${baseApi}/getEmployee/${employeeId}`,
        `${baseApi}/${employeeId}`,
      ];
      let json = null;
      for (const url of tryUrls) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const parsed = await res.json();
          // many of your APIs return { status, message, data }
          if (parsed?.data) json = parsed.data;
          else json = parsed;
          break;
        } catch (err) {
          // ignore and continue
        }
      }

      if (!json) {
        // fallback to empty profile
        setProfile((p) => ({ ...p }));
        return;
      }

      setProfile((prev) => ({
        ...prev,
        name: json.name || json.fullName || prev.name,
        email: json.email || prev.email,
        contactNumber: json.contactNumber || json.contact || prev.contactNumber,
        address: json.address || prev.address,
      }));

      if (json.avatarUrl) setAvatarPreview(json.avatarUrl);
      // load other preferences if backend provides them
      if (json.preferences) {
        setNotifications(Boolean(json.preferences.notifications));
        setTwoFactor(Boolean(json.preferences.twoFactor));
        setProfileVisibility(Boolean(json.preferences.profileVisibility));
        setDataSharing(Boolean(json.preferences.dataSharing));
        setThemeColor(json.preferences.themeColor || "indigo");
        setFontSize(json.preferences.fontSize || "medium");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  function handleProfileChange(e) {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  }

  function handleFileChange(e) {
    const f = e.target.files?.[0] ?? null;
    setAvatarFile(f);
    if (f) setAvatarPreview(URL.createObjectURL(f));
  }

  async function handleUploadAvatar() {
    if (!avatarFile)
      return setMessage({ type: "error", text: "Choose an image first" });
    setUploadingAvatar(true);
    try {
      // placeholder endpoint: update with your real upload path
      const url = `${baseApi}/upload-avatar/${employeeId}`;
      const fd = new FormData();
      fd.append("file", avatarFile);
      const res = await fetch(url, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const json = await res.json();
      setMessage({ type: "success", text: "Avatar uploaded" });
      if (json?.data?.avatarUrl) setAvatarPreview(json.data.avatarUrl);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "Upload failed" });
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleUpdateProfile(e) {
    e && e.preventDefault();
    setUpdatingProfile(true);
    setError(null);
    try {
      // basic validation
      if (!profile.name || !profile.email) {
        setMessage({ type: "error", text: "Name and email are required" });
        setUpdatingProfile(false);
        return;
      }

      const url = `${baseApi}/update-employee/${employeeId}`;
      const payload = {
        name: profile.name,
        email: profile.email,
        contactNumber: profile.contactNumber,
        address: profile.address,
      };
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Update failed (${res.status})`);
      const json = await res.json();
      setMessage({ type: "success", text: json?.message || "Profile updated" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "Update failed" });
    } finally {
      setUpdatingProfile(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (!passwords.current || !passwords.next) {
      setMessage({ type: "error", text: "Fill current and new password" });
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    try {
      setLoading(true);
      // placeholder endpoint — replace if your backend has a change-password API
      const url = `${baseApi}/change-password/${employeeId}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.next,
        }),
      });
      if (!res.ok) throw new Error(`Password change failed (${res.status})`);
      const json = await res.json();
      setMessage({
        type: "success",
        text: json?.message || "Password changed",
      });
      setPasswords({ current: "", next: "", confirm: "" });
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.message || "Password change failed",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSavePreferences() {
    try {
      setLoading(true);
      const url = `${baseApi}/update-preferences/${employeeId}`; // placeholder
      const payload = {
        twoFactor,
        notifications,
        profileVisibility,
        dataSharing,
        themeColor,
        fontSize,
      };
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // not all backends will support this endpoint; be resilient
      if (!res.ok) {
        // treat as local change
        setMessage({
          type: "success",
          text: "Preferences saved locally (no backend endpoint)",
        });
      } else {
        const json = await res.json();
        setMessage({
          type: "success",
          text: json?.message || "Preferences saved",
        });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to save preferences" });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAccount() {
    if (!window.confirm("This will permanently delete your account. Continue?"))
      return;
    try {
      setDeleting(true);
      const url = `${baseApi}/delete-employee/${employeeId}`;
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      const json = await res.json();
      setMessage({ type: "success", text: json?.message || "Account deleted" });
      // optionally: redirect to login or landing page
      // window.location.href = '/goodbye';
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "Delete failed" });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-indigo-600 dark:text-indigo-600 text-center"
        >
          Settings
        </motion.h1>

        {message && (
          <div
            className={`mx-auto max-w-3xl text-center py-3 rounded-lg shadow-md font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Profile */}
        <Card>
          <CardHeader
            icon={<User />}
            title="Profile"
            subtitle="Update your personal details and avatar."
          />

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <User />
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-col gap-2 w-full">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex gap-2">
                  <GhostButton onClick={() => fileInputRef.current?.click()}>
                    Choose Avatar
                  </GhostButton>
                  <button
                    onClick={handleUploadAvatar}
                    className={`px-3 py-1 rounded-lg text-sm text-white ${
                      uploadingAvatar ? "bg-gray-400" : "bg-indigo-600"
                    }`}
                    disabled={uploadingAvatar}
                  >
                    {uploadingAvatar ? (
                      "Uploading..."
                    ) : (
                      <>
                        <UploadCloud className="inline-block mr-2" /> Upload
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">PNG/JPG up to 2MB</p>
              </div>
            </div>

            <div className="md:col-span-2">
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Full name">
                    <input
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-200"
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-200"
                    />
                  </Field>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Contact number">
                    <input
                      name="contactNumber"
                      value={profile.contactNumber}
                      onChange={handleProfileChange}
                      className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-200"
                    />
                  </Field>
                  <Field label="Location / Address">
                    <input
                      name="address"
                      value={profile.address}
                      onChange={handleProfileChange}
                      className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-200"
                    />
                  </Field>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <Button type="submit" disabled={updatingProfile}>
                    {updatingProfile ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="inline-block mr-2" /> Save changes
                      </>
                    )}
                  </Button>
                  <GhostButton type="button" onClick={loadProfile}>
                    Reset
                  </GhostButton>
                </div>
              </form>
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader
            icon={<Shield />}
            title="Security"
            subtitle="Manage password, two-factor auth and session/logout."
          />

          <div className="grid md:grid-cols-2 gap-6">
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
                <Switch checked={twoFactor} onChange={(v) => setTwoFactor(v)} />
              </div>
              <div className="mt-4 text-sm text-gray-500">
                If you enable 2FA we will show setup instructions (QR / secret)
                on next login. Backend integration required.
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications & Preferences */}
        <Card>
          <CardHeader
            icon={<Bell />}
            title="Notifications & Preferences"
            subtitle="Control notifications, theme and interface preferences."
          />

          <div className="grid md:grid-cols-3 gap-6">
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
                <Button onClick={handleSavePreferences}>
                  Save preferences
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">
                Language & Region
              </h4>
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

        {/* Privacy & Connected Apps */}
        <Card>
          <CardHeader
            icon={<EyeOff />}
            title="Privacy & Connected Apps"
            subtitle="Control who sees your profile and which apps are connected."
          />

          <div className="grid md:grid-cols-2 gap-6">
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

            <div>
              <div className="mb-2 font-medium text-gray-700">
                Connected apps
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">Google</div>
                    <div className="text-sm text-gray-500">OAuth connected</div>
                  </div>
                  <div className="flex gap-2">
                    <GhostButton>Disconnect</GhostButton>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700">Slack</div>
                    <div className="text-sm text-gray-500">Not connected</div>
                  </div>
                  <div className="flex gap-2">
                    <Button>Connect</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Danger zone */}
        <Card>
          <CardHeader
            icon={<Trash2 />}
            title="Danger Zone"
            subtitle="Irreversible actions — proceed with caution."
          />
          <div className="grid md:grid-cols-2 gap-6">
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

        <div className="text-center text-sm text-gray-500">
          Employee ID: <span className="font-medium">{employeeId}</span>
        </div>
      </div>
    </div>
  );
}
