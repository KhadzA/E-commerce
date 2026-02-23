"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  Shield,
  LogOut,
} from "lucide-react";

interface Profile {
  userId: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  role: string;
}

function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const navigate = useNavigate();

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        const res = await fetch(`http://localhost:5000/profile/${userId}`);
        if (!res.ok) throw new Error("Failed to load profile.");
        const data: Profile = await res.json();
        setProfile(data);
        setEditForm({
          name: data.name || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed to update profile.");
      const data = await res.json();
      setProfile(data.profile);
      localStorage.setItem("userName", data.profile.name || "");
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const getAvatar = (name: string, email: string) => {
    const src = name?.trim() || email?.trim();
    return src ? src[0].toUpperCase() : "?";
  };

  const getRoleBadgeStyle = (role: string) =>
    role?.toLowerCase() === "admin"
      ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
      : "bg-blue-500/10 text-blue-600 border-blue-500/20";

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Profile not found.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account details
          </p>
        </div>
        {/* <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button> */}
      </div>

      {/* ── Avatar + identity card ── */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
            <span className="text-3xl font-bold text-primary">
              {getAvatar(profile.name, profile.email)}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-semibold text-foreground truncate">
                {profile.name || "No name set"}
              </h2>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeStyle(profile.role)}`}
              >
                <Shield className="w-3 h-3" />
                {profile.role || "customer"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {profile.email}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              ID: {profile.userId}
            </p>
          </div>

          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors shrink-0"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* ── Details card ── */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Account Details
        </h3>

        {/* Email — read-only */}
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
            <Mail className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Email</p>
            <p className="text-sm font-medium text-foreground">
              {profile.email}
            </p>
          </div>
        </div>

        {/* Name */}
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Full Name</p>
            {editing ? (
              <input
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="Your full name"
              />
            ) : (
              <p className="text-sm font-medium text-foreground">
                {profile.name || (
                  <span className="text-muted-foreground italic">Not set</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
            <Phone className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Phone Number</p>
            {editing ? (
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="+63 9XX XXX XXXX"
              />
            ) : (
              <p className="text-sm font-medium text-foreground">
                {profile.phone || (
                  <span className="text-muted-foreground italic">Not set</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Address</p>
            {editing ? (
              <input
                type="text"
                value={editForm.address}
                onChange={(e) =>
                  setEditForm({ ...editForm, address: e.target.value })
                }
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="Street, City, Province"
              />
            ) : (
              <p className="text-sm font-medium text-foreground">
                {profile.address || (
                  <span className="text-muted-foreground italic">Not set</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Edit action buttons */}
        {editing && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setEditForm({
                  name: profile.name || "",
                  phone: profile.phone || "",
                  address: profile.address || "",
                });
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
