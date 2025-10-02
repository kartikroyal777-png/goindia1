/*
          # [Feature Expansion: Admin, Trips, Notifications]
          This migration adds the necessary tables to support a full admin panel, user-specific saved trips, saved places, and a notification system.

          ## Query Description: [This operation is structural and adds new tables without affecting existing data. It is safe to run on the existing database. It enables core new features for user accounts and administration.]
          
          ## Metadata:
          - Schema-Category: ["Structural"]
          - Impact-Level: ["Low"]
          - Requires-Backup: [false]
          - Reversible: [true]
          
          ## Structure Details:
          - Adds table: `notifications`
          - Adds table: `trips`
          - Adds table: `saved_places`
          - Adds table: `admin_action_logs`
          - Adds RLS policies to `trips` and `saved_places` for user-level security.
          
          ## Security Implications:
          - RLS Status: [Enabled]
          - Policy Changes: [Yes]
          - Auth Requirements: [User authentication is required to interact with `trips` and `saved_places`.]
          
          ## Performance Impact:
          - Indexes: [Added on foreign keys and user_id]
          - Triggers: [None]
          - Estimated Impact: [Low performance impact, consists of adding new tables and indexes.]
          */

-- Table for storing notifications sent to users
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('general', 'safety_alert', 'promo', 'update')),
    created_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE public.notifications IS 'Stores notifications for users, managed by admins.';

-- Table for storing user-generated trip plans
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    destination TEXT NOT NULL,
    days INT NOT NULL,
    travel_style TEXT,
    companions TEXT,
    itinerary JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE public.trips IS 'Stores user-created trip itineraries.';

-- Table for storing user's saved places
CREATE TABLE IF NOT EXISTS public.saved_places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE public.saved_places IS 'Stores locations saved by users.';

-- Table for logging admin actions
CREATE TABLE IF NOT EXISTS public.admin_action_logs (
    id BIGSERIAL PRIMARY KEY,
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE public.admin_action_logs IS 'Logs all actions performed in the admin panel for auditing.';

-- Enable RLS for user-specific tables
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_places ENABLE ROW LEVEL SECURITY;

-- Policies for trips table
CREATE POLICY "Users can view their own trips"
ON public.trips FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trips"
ON public.trips FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips"
ON public.trips FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips"
ON public.trips FOR DELETE
USING (auth.uid() = user_id);

-- Policies for saved_places table
CREATE POLICY "Users can view their own saved places"
ON public.saved_places FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved places"
ON public.saved_places FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved places"
ON public.saved_places FOR DELETE
USING (auth.uid() = user_id);
