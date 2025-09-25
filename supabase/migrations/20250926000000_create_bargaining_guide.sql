/*
# [Create Bargaining Price Guide Table]
This migration creates the `bargaining_price_guide` table to store fair and quoted prices for various items in different locations. It also sets up Row Level Security (RLS) to allow public read access and restricts write operations to administrators.

## Query Description: [This operation creates a new table for the Bargaining Coach feature. It is a structural change and does not affect any existing data. It is safe to run on a production database.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Table Created: `public.bargaining_price_guide`
- Columns: `id`, `location_name`, `item_name`, `fair_price_range`, `quoted_price_range`, `created_at`

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [Yes]
- Auth Requirements: [Admin role for write, public for read]

## Performance Impact:
- Indexes: [Primary Key on `id`]
- Triggers: [None]
- Estimated Impact: [Low. Creates a new table with minimal impact on overall database performance.]
*/

-- Create the table for bargaining price guides
CREATE TABLE public.bargaining_price_guide (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_name TEXT NOT NULL,
    item_name TEXT NOT NULL,
    fair_price_range TEXT,
    quoted_price_range TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add comments to the table and columns for clarity
COMMENT ON TABLE public.bargaining_price_guide IS 'Stores fair and quoted price ranges for items to help users in bargaining.';
COMMENT ON COLUMN public.bargaining_price_guide.location_name IS 'The city or market where the item is sold.';
COMMENT ON COLUMN public.bargaining_price_guide.item_name IS 'The name of the item (e.g., T-shirt, Handicraft).';
COMMENT ON COLUMN public.bargaining_price_guide.fair_price_range IS 'The fair price range for the item (e.g., ₹150-300).';
COMMENT ON COLUMN public.bargaining_price_guide.quoted_price_range IS 'The commonly quoted price range by sellers (e.g., ₹600-800).';

-- Enable Row Level Security
ALTER TABLE public.bargaining_price_guide ENABLE ROW LEVEL SECURITY;

-- Create a helper function to identify the admin user based on the app's logic
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'service_role' THEN
    RETURN TRUE;
  END IF;
  IF auth.jwt() IS NOT NULL AND auth.jwt()->>'email' = 'kartikroyal777@gmail.com' THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- Create policies for the table
-- 1. Allow public read access to everyone
CREATE POLICY "Allow public read access"
ON public.bargaining_price_guide
FOR SELECT
USING (true);

-- 2. Allow admins to perform all actions (insert, update, delete)
CREATE POLICY "Allow admins full access"
ON public.bargaining_price_guide
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());
