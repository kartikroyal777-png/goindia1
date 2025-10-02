/*
          # Create Phrases Table
          This migration creates a new table `public.phrases` to store translation data for the app and seeds it with initial content.

          ## Query Description: 
          This operation is structural and safe. It creates a new table and populates it. It does not affect any existing data. Row Level Security is enabled to allow public read access, while only the specified admin user can write, update, or delete entries.

          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true (by dropping the table)
          
          ## Structure Details:
          - Table: `public.phrases`
          - Columns: `id`, `category`, `en`, `hi`, `pronunciation`, `is_adult`, `created_at`
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes (Adds policies for read and admin write access)
          - Auth Requirements: Admin role for write operations.
          
          ## Performance Impact:
          - Indexes: Primary key index on `id`.
          - Triggers: None
          - Estimated Impact: Negligible.
          */

CREATE TABLE public.phrases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    en TEXT NOT NULL,
    hi TEXT NOT NULL,
    pronunciation TEXT,
    is_adult BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.phrases IS 'Stores phrases for the translation feature.';

ALTER TABLE public.phrases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public phrases are viewable by everyone." ON public.phrases FOR SELECT USING (true);

CREATE POLICY "Admins can manage phrases." ON public.phrases FOR ALL 
USING (auth.jwt() ->> 'email' = 'kartikroyal777@gmail.com') 
WITH CHECK (auth.jwt() ->> 'email' = 'kartikroyal777@gmail.com');

-- Seed Data
INSERT INTO public.phrases (category, en, hi, pronunciation, is_adult) VALUES
('Survival & Polite', 'Hello', 'नमस्ते', 'namaste', false),
('Survival & Polite', 'Thank you', 'धन्यवाद', 'dhanyavaad', false),
('Survival & Polite', 'Please', 'कृपया', 'kripya', false),
('Survival & Polite', 'Sorry / Excuse me', 'माफ़ कीजिए', 'maaf kijie', false),
('Survival & Polite', 'Yes', 'हाँ / जी', 'haan / ji', false),
('Survival & Polite', 'No', 'नहीं', 'nahī̃', false),
('Survival & Polite', 'OK', 'ठीक है', 'ṭhīk hai', false),
('Survival & Polite', 'How much?', 'कितना हुआ?', 'kitnā huā?', false),
('Survival & Polite', 'Water', 'पानी', 'pānī', false),
('Survival & Polite', 'Food', 'खाना', 'khānā', false),
('Survival & Polite', 'Where is the bathroom?', 'बाथरूम कहाँ है?', 'bathroom kahān hai?', false),
('Survival & Polite', 'Let''s go', 'चलो', 'chalo', false),
('Survival & Polite', 'Help', 'सहायता', 'sahāytā', false),
('Survival & Polite', 'Police', 'पुलिस', 'pulis', false),
('Survival & Polite', 'Hospital', 'हस्पताल', 'haspatal', false),
('Directions & Transport', 'Left', 'बाएँ', 'bāē̃', false),
('Directions & Transport', 'Right', 'दाएँ', 'dāē̃', false),
('Directions & Transport', 'Straight', 'सीधे', 'sīdhe', false),
('Directions & Transport', 'Stop', 'रुको', 'ruko', false),
('Directions & Transport', 'Station', 'स्टेशन', 'sṭeśan', false),
('Directions & Transport', 'Train', 'रेलगाड़ी', 'relgāṛī', false),
('Directions & Transport', 'Taxi', 'टैक्सी', 'ṭaiksī', false),
('Directions & Transport', 'Auto-rickshaw', 'ऑटो', 'oṭo', false),
('Directions & Transport', 'Fare', 'किराया', 'kirāyā', false),
('Directions & Transport', 'Ticket', 'टिकट', 'ṭikaṭ', false),
('Shopping & Bargaining', 'What''s the price?', 'क्या कीमत है?', 'kya qīmat hai?', false),
('Shopping & Bargaining', 'It''s expensive', 'महँगा है', 'mahãgā hai', false),
('Shopping & Bargaining', 'Cheap', 'सस्ता', 'sastā', false),
('Shopping & Bargaining', 'Reduce the price', 'दाम कम करो', 'dām kam karo', false),
('Shopping & Bargaining', 'Show me', 'दिखाइए', 'dikhāiye', false),
('Shopping & Bargaining', 'Money', 'पैसा', 'paisā', false),
('Food & Drink', 'Tea', 'चाय', 'chāy', false),
('Food & Drink', 'Coffee', 'कॉफ़ी', 'kāfī', false),
('Food & Drink', 'Sugar', 'चीनी', 'chīnī', false),
('Food & Drink', 'Salt', 'नमक', 'namak', false),
('Food & Drink', 'Spice', 'मिर्च', 'mirc', false),
('Food & Drink', 'Flat-bread', 'रोटी', 'roṭī', false),
('Food & Drink', 'Rice', 'चावल', 'chāwal', false),
('Food & Drink', 'Lentils', 'दाल', 'dāl', false),
('Food & Drink', 'Vegetables', 'सब्ज़ी', 'sabzī', false),
('Food & Drink', 'Cold', 'ठंडा', 'ṭhaṇḍā', false),
('Food & Drink', 'Hot', 'गरम', 'garam', false),
('Food & Drink', 'Bill', 'बिल', 'bil', false),
('Slang / Cool Words', 'Dude / Pal', 'यार', 'yār', false),
('Slang / Cool Words', 'Awesome', 'झकास', 'jhakās', false),
('Slang / Cool Words', 'Cool / Chilled', 'मस्त', 'mast', false),
('Slang / Cool Words', 'Carefree', 'बिंदास', 'bindās', false),
('Slang / Cool Words', 'Hack / Workaround', 'जुगाड़', 'jugāṛ', false),
('Slang & Adult (18+)', 'Idiot / Fool', 'चूतिया', 'chūṭiyā', true),
('Slang & Adult (18+)', 'Sister-f*er (common curse)', 'भेंचो', 'bhencho', true),
('Slang & Adult (18+)', 'Mother-f*er (strong curse)', 'मादरचोद', 'mādarchod', true),
('Slang & Adult (18+)', 'Bastard / Rascal', 'हरामी', 'harāmī', true),
('Slang & Adult (18+)', 'Assh*le', 'गांडू', 'gāṇḍu', true),
('Slang & Adult (18+)', 'Wh*re', 'रंडी', 'ranḍī', true),
('Slang & Adult (18+)', 'Son of a dog', 'कुत्ते का पिल्ला', 'kutte ka pillā', true),
('Slang & Adult (18+)', 'Idiot (lit. owl)', 'उल्लू', 'ullū', true),
('Slang & Adult (18+)', 'Fool', 'बेवक़ूफ़', 'bevakūf', true),
('Slang & Adult (18+)', 'Pimp', 'भड़वा', 'bhaṛvā', true),
('Slang & Adult (18+)', 'Sh*t', 'टट्टी', 'ṭaṭṭī', true),
('Slang & Adult (18+)', 'Piss', 'मूत', 'mūt', true);
