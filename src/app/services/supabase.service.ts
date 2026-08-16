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
      const supabaseKey = environment.supabaseAnonKey;
      this.client = createClient(environment.supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        },
        global: {
          fetch: (input, init) => this.fetchWithApiKey(input as RequestInfo, init, supabaseKey)
        }
      });
    }

    return this.client;
  }

  private fetchWithApiKey(input: RequestInfo, init: RequestInit | undefined, apiKey: string): Promise<Response> {
    const headers = new Headers(init && init.headers ? init.headers : undefined);
    headers.set('apikey', apiKey);

    // New publishable/secret keys are not JWTs and must not be sent as Bearer.
    if (apiKey.indexOf('sb_publishable_') === 0 || apiKey.indexOf('sb_secret_') === 0) {
      headers.delete('Authorization');
    }

    return fetch(input, Object.assign({}, init, { headers }));
  }
}
