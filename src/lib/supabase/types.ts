/**
 * Database types placeholder.
 *
 * Generate types from your Supabase project:
 *   pnpm supabase gen types --lang=typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
 *
 * Or from a local Supabase instance:
 *   pnpm supabase gen types --lang=typescript --local > src/lib/supabase/types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          stripe_customer_id: string;
          created_at: string;
        };
        Insert: {
          id: string;
          stripe_customer_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          stripe_customer_id?: string;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_price_id: string;
          status: string;
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
          canceled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          stripe_price_id: string;
          status: string;
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end?: boolean;
          canceled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_price_id?: string;
          status?: string;
          current_period_start?: string;
          current_period_end?: string;
          cancel_at_period_end?: boolean;
          canceled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      purchases: {
        Row: {
          id: string;
          user_id: string;
          stripe_price_id: string;
          product_id: string;
          amount: number;
          currency: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          stripe_price_id: string;
          product_id: string;
          amount: number;
          currency?: string;
          status: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_price_id?: string;
          product_id?: string;
          amount?: number;
          currency?: string;
          status?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
