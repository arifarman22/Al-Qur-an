"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { apiGetProfile, apiUpdateProfile, apiChangePassword, type ProfileDTO } from "@/utils/api";
import QuranReaderLayout from "@/components/quran-reader/QuranReaderLayout";
import { User, Mail, Calendar, Bookmark, BookOpen, Lock, Save, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, loading: authLoading, checkAuth } = useAuthStore();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit name
  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);

  // Change password
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/login"); return; }
    apiGetProfile()
      .then((p) => { setProfile(p); setName(p.name); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || !user) return <div className="h-screen bg-background" />;

  const handleSaveName = async () => {
    if (!name.trim() || name === profile?.name) return;
    setSavingName(true);
    try {
      await apiUpdateProfile(name);
      await checkAuth();
      toast.success("Name updated");
      setProfile((p) => p ? { ...p, name } : p);
    } catch (err: any) { toast.error(err.message); }
    finally { setSavingName(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    if (!currentPwd || !newPwd) return;
    setSavingPwd(true);
    try {
      await apiChangePassword(currentPwd, newPwd);
      toast.success("Password changed");
      setCurrentPwd("");
      setNewPwd("");
    } catch (err: any) { setPwdError(err.message); }
    finally { setSavingPwd(false); }
  };

  return (
    <QuranReaderLayout>
      <div className="p-6 max-w-3xl mx-auto">
      
        <h1 className="text-2xl font-bold mb-8">Profile</h1>

        {loading ? (
          <div className="text-center py-16"><Loader2 size={24} className="animate-spin text-primary mx-auto" /></div>
        ) : profile && (
          <div className="space-y-6">
            {/* Avatar & Info */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-2xl font-bold">
                  {profile.name[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold">{profile.name}</h2>
                  <p className="text-sm text-muted flex items-center gap-1"><Mail size={14} />{profile.email}</p>
                  <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                    <Calendar size={12} />Joined {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-alt rounded-lg p-4 text-center">
                  <Bookmark size={20} className="mx-auto mb-1 text-accent" />
                  <p className="text-2xl font-bold">{profile.bookmarkCount}</p>
                  <p className="text-xs text-muted">Bookmarks</p>
                </div>
                <div className="bg-surface-alt rounded-lg p-4 text-center">
                  <BookOpen size={20} className="mx-auto mb-1 text-primary" />
                  {profile.lastRead ? (
                    <>
                      <p className="text-sm font-bold">{profile.lastRead.surahName}</p>
                      <p className="text-xs text-muted">Ayah {profile.lastRead.ayahNumber}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-muted">—</p>
                      <p className="text-xs text-muted">No reading yet</p>
                    </>
                  )}
                </div>
              </div>

              {profile.lastRead && (
                <Link
                  href={`/surah/${profile.lastRead.surahId}?ayah=${profile.lastRead.ayahNumber}`}
                  className="mt-4 block text-center text-sm text-primary font-medium hover:underline"
                >
                  Continue reading →
                </Link>
              )}
            </motion.div>

            {/* Edit Name */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><User size={16} className="text-primary" />Edit Name</h3>
              <div className="flex gap-2">
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-surface-alt border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors"
                />
                <button onClick={handleSaveName} disabled={savingName || name === profile.name}
                  className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-1.5">
                  {savingName ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save
                </button>
              </div>
            </motion.div>

            {/* Change Password */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Lock size={16} className="text-primary" />Change Password</h3>
              <form onSubmit={handleChangePassword} className="space-y-3">
                {pwdError && (
                  <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    <AlertCircle size={14} />{pwdError}
                  </div>
                )}
                <input
                  type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder="Current password" required
                  className="w-full px-3 py-2.5 bg-surface-alt border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors"
                />
                <input
                  type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="New password (min 8, A-Z, a-z, 0-9)" required minLength={8}
                  className="w-full px-3 py-2.5 bg-surface-alt border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors"
                />
                <button type="submit" disabled={savingPwd}
                  className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-1.5">
                  {savingPwd ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                  Update Password
                </button>
              </form>
            </motion.div>
          </div>
        )}
      
      </div>
    </QuranReaderLayout>
  );
}
