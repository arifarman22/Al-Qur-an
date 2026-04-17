const BASE = "/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Request failed");
  return json.data as T;
}

// Auth
export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export async function apiRegister(name: string, email: string, password: string) {
  return request<AuthUser>("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
}

export async function apiLogin(email: string, password: string) {
  return request<AuthUser>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

export async function apiLogout() {
  return request<{ message: string }>("/auth/logout", { method: "POST" });
}

export async function apiGetMe() {
  return request<AuthUser>("/auth/me");
}

// Surahs (quran.com shape)
export interface SurahDTO {
  id: number;
  name_simple: string;
  name_arabic: string;
  name_complex: string;
  revelation_place: string;
  revelation_order: number;
  verses_count: number;
  pages: number[];
  translated_name: { language_name: string; name: string };
  bismillah_pre: boolean;
}

export interface SurahInfoDTO {
  id: number;
  chapter_id: number;
  language_name: string;
  short_text: string;
  source: string;
  text: string;
}

export async function apiGetSurahs() {
  return request<SurahDTO[]>("/surahs");
}

export async function apiGetSurah(id: number) {
  return request<SurahDTO>(`/surahs/${id}`);
}

export async function apiGetSurahInfo(id: number) {
  return request<SurahInfoDTO>(`/surahs/${id}/info`);
}

// Ayahs (quran.com shape + audio)
export interface AyahDTO {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani?: string;
  text_indopak?: string;
  translations?: { id: number; resource_id: number; text: string }[];
  audio_url?: string | null;
}

export async function apiGetAyahs(surahId: number, script: "uthmani" | "indopak" = "uthmani") {
  return request<AyahDTO[]>(`/surahs/${surahId}/ayahs?script=${script}`);
}

// Search (quran.com shape)
export interface SearchResultDTO {
  verse_key: string;
  verse_id: number;
  text: string;
}

export async function apiSearch(q: string) {
  return request<SearchResultDTO[]>(`/search?q=${encodeURIComponent(q)}`);
}

// Bookmarks (our DB)
export interface BookmarkDTO {
  id: string;
  verseKey: string;
  surahId: number;
  surahName: string;
  ayahNumber: number;
  note: string;
  createdAt: string;
}

export async function apiGetBookmarks() {
  return request<BookmarkDTO[]>("/bookmarks");
}

export async function apiCreateBookmark(verseKey: string, surahId: number, surahName: string, ayahNumber: number, note = "") {
  return request<BookmarkDTO>("/bookmarks", {
    method: "POST",
    body: JSON.stringify({ verseKey, surahId, surahName, ayahNumber, note }),
  });
}

export async function apiUpdateBookmark(id: string, note: string) {
  return request<BookmarkDTO>(`/bookmarks/${id}`, { method: "PATCH", body: JSON.stringify({ note }) });
}

export async function apiDeleteBookmark(id: string) {
  return request<{ message: string }>(`/bookmarks/${id}`, { method: "DELETE" });
}

// Profile
export interface ProfileDTO {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  bookmarkCount: number;
  lastRead: { surahId: number; surahName: string; ayahNumber: number; updatedAt: string } | null;
}

export async function apiGetProfile() {
  return request<ProfileDTO>("/auth/profile");
}

export async function apiUpdateProfile(name: string) {
  return request<AuthUser>("/auth/profile", { method: "PATCH", body: JSON.stringify({ name }) });
}

export async function apiChangePassword(currentPassword: string, newPassword: string) {
  return request<{ message: string }>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

// Reading Progress
export interface ReadingProgressDTO {
  surahId: number;
  surahName: string;
  ayahNumber: number;
  updatedAt: string;
}

export async function apiGetReadingProgress() {
  return request<ReadingProgressDTO | null>("/reading-progress");
}

export async function apiSaveReadingProgress(surahId: number, surahName: string, ayahNumber: number) {
  return request<ReadingProgressDTO>("/reading-progress", {
    method: "POST",
    body: JSON.stringify({ surahId, surahName, ayahNumber }),
  });
}

// Daily Ayah
export interface DailyAyahDTO {
  verse: AyahDTO;
  surah: { id: number; name_simple: string; name_arabic: string };
}

export async function apiGetDailyAyah() {
  return request<DailyAyahDTO>("/daily-ayah");
}

// Learning
export interface LearningProgressDTO {
  id: string;
  lessonId: string;
  completed: boolean;
  completedAt: string | null;
}

export async function apiGetLearningProgress() {
  return request<LearningProgressDTO[]>("/learn");
}

export async function apiCompleteLesson(lessonId: string) {
  return request<LearningProgressDTO>("/learn", { method: "POST", body: JSON.stringify({ lessonId }) });
}

// Memorization
export interface MemorizationDTO {
  id: string;
  surahId: number;
  surahName: string;
  status: "not_started" | "in_progress" | "memorized";
  updatedAt: string;
}

export async function apiGetMemorization() {
  return request<MemorizationDTO[]>("/memorize");
}

export async function apiUpdateMemorization(surahId: number, surahName: string, status: string) {
  return request<MemorizationDTO>("/memorize", { method: "POST", body: JSON.stringify({ surahId, surahName, status }) });
}
