"use client";
import { Save, UploadCloud, User } from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import CardHeader from "../ui/CardHeader";
import Field from "../ui/Field";
import GhostButton from "../ui/GhostButton";
export default function ProfileSection({
  profile,
  avatarPreview,
  fileInputRef,
  uploadingAvatar,
  updatingProfile,
  handleFileChange,
  handleProfileChange,
  handleUploadAvatar,
  handleUpdateProfile,
  loadProfile,
}) {
  return (
    <Card>
      <CardHeader
        icon={<User />}
        title="Profile"
        subtitle="Update your personal details and avatar."
      />

      <div className="grid md:grid-cols-3 gap-6">
        {/* Avatar */}
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

        {/* Profile Form */}
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
  );
}
