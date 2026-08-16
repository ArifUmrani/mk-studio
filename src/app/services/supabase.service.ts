import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private client: SupabaseClient | null = null;

  get isConfigured(): boolean {
    return Boolean(
      environment.supabaseUrl &&
      environment.supabaseAnonKey &&
      !environment.supabaseUrl.includes('YOUR_PROJECT') &&
      environment.supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'
    );
  }

  getClient(): SupabaseClient {
    if (!this.isConfigured) {
      throw new Error(
        'Supabase is not configured. Set supabaseUrl and supabaseAnonKey in environment.ts.'
      );
    }

    if (!this.client) {
      this.client = createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
    }

    return this.client;
  }
}
