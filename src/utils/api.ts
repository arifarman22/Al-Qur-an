const BASE = "/api";

async function request<T>(url: string): Promise<T> {
  const res = await fetch(`${BASE}${url}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Request failed");
  return json.data as T;
}

// Surahs
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

// Ayahs
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

// Search
export interface SearchResultDTO {
  verse_key: string;
  verse_id: number;
  text: string;
}

export async function apiSearch(q: string) {
  return request<SearchResultDTO[]>(`/search?q=${encodeURIComponent(q)}`);
}

// Daily Ayah
export interface DailyAyahDTO {
  verse: AyahDTO;
  surah: { id: number; name_simple: string; name_arabic: string };
}

export async function apiGetDailyAyah() {
  return request<DailyAyahDTO>("/daily-ayah");
}
