-- ============================================================
-- Supabase Schema for yt-summary-to-md
-- Project: yt-summary-to-md
-- Reuses existing mood-tracker Supabase project
-- ============================================================

-- ------------------------------------------------------------
-- 1. profiles table
--    Mirrors auth.users for app-level user data.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email      text NOT NULL,
    created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'App-level user profile synced from auth.users';

-- ------------------------------------------------------------
-- 2. user_settings table
--    Per-user configuration (e.g., Gemini API key).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id        uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    gemini_api_key text,
    created_at     timestamptz DEFAULT now(),
    updated_at     timestamptz DEFAULT now()
);

COMMENT ON TABLE public.user_settings IS 'Per-user settings and API keys';

-- ------------------------------------------------------------
-- 3. summaries table
--    Stores YouTube video summaries per user.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.summaries (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    youtube_url text NOT NULL,
    video_title text,
    summary_md  text,
    created_at  timestamptz DEFAULT now()
);

COMMENT ON TABLE public.summaries IS 'YouTube video summaries generated per user';

-- ------------------------------------------------------------
-- 4. Indexes
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS summaries_user_created_idx
    ON public.summaries (user_id, created_at DESC);

-- ------------------------------------------------------------
-- 5. Row Level Security (RLS)
-- ------------------------------------------------------------

-- Enable RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;

-- user_settings policies: users can only access their own row
CREATE POLICY "user_settings_select_own"
    ON public.user_settings
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "user_settings_insert_own"
    ON public.user_settings
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_settings_update_own"
    ON public.user_settings
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_settings_delete_own"
    ON public.user_settings
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- summaries policies: users can only access their own summaries
CREATE POLICY "summaries_select_own"
    ON public.summaries
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "summaries_insert_own"
    ON public.summaries
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "summaries_delete_own"
    ON public.summaries
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6. Trigger: auto-update updated_at on user_settings
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_settings_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------
-- 7. Trigger: auto-create profile on auth.user creation
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
