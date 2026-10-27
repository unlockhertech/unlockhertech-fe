import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

export interface ResourceLeadRecord {
  id?: string;
  email: string;
  full_name?: string;
  discord_handle?: string;
  role_interest?: string;
  resource_title: string;
  resource_slug?: string;
  category?: string;
  collection?: string;
  download_date?: string;
  created_at?: string;
  user_agent?: string;
  referrer?: string;
}

export interface BookingLeadRecord {
  id?: string;
  email: string;
  full_name?: string;
  meeting_key: string;
  booking_date: string;
  booking_time?: string;
  timezone?: string;
  notes?: string;
  created_at?: string;
}

export interface DiscountClaimRecord {
  id?: string;
  email: string;
  full_name?: string;
  event_title: string;
  discount_code?: string;
  discount_percentage?: string;
  ticket_url?: string;
  created_at?: string;
}

/**
 * Returns an authenticated server-side Supabase client instance.
 * Uses SUPABASE_SERVICE_ROLE_KEY (preferred for serverless functions) or SUPABASE_ANON_KEY.
 * Returns null if Supabase environment variables are missing.
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return cachedClient;
}

/**
 * Persists a resource download lead capture record to Supabase.
 * Returns true if successful or if Supabase is unconfigured (graceful fallback).
 */
export async function recordResourceLead(record: ResourceLeadRecord): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseServerClient();
  if (!client) {
    // Graceful degradation when Supabase is not configured
    return { success: true };
  }

  try {
    const timestamp = record.created_at ?? new Date().toISOString();
    const payload = {
      email: record.email.toLowerCase().trim(),
      full_name: record.full_name?.trim() || null,
      discord_handle: record.discord_handle?.trim() || null,
      role_interest: record.role_interest?.trim() || null,
      resource_title: record.resource_title.trim(),
      resource_slug: record.resource_slug?.trim() || null,
      category: record.category?.trim() || null,
      collection: record.collection?.trim() || null,
      download_date: record.download_date ?? timestamp,
      created_at: timestamp,
      user_agent: record.user_agent || null,
      referrer: record.referrer || null,
    };

    const { error } = await client.from("resource_leads").insert(payload);
    if (error) {
      console.warn("Supabase resource lead insertion failed:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("Unexpected error inserting resource lead into Supabase:", message);
    return { success: false, error: message };
  }
}

/**
 * Persists an event discount claim record to Supabase.
 */
export async function recordDiscountClaim(record: DiscountClaimRecord): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseServerClient();
  if (!client) {
    return { success: true };
  }

  try {
    const timestamp = record.created_at ?? new Date().toISOString();
    const payload = {
      email: record.email.toLowerCase().trim(),
      full_name: record.full_name?.trim() || null,
      event_title: record.event_title.trim(),
      discount_code: record.discount_code?.trim() || null,
      discount_percentage: record.discount_percentage?.trim() || null,
      ticket_url: record.ticket_url?.trim() || null,
      created_at: timestamp,
    };

    const { error } = await client.from("event_discount_claims").insert(payload);
    if (error) {
      console.warn("Supabase discount claim insertion failed:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("Unexpected error inserting discount claim into Supabase:", message);
    return { success: false, error: message };
  }
}
