/*
  # Create websites table for fun site collection

  1. New Tables
    - `websites`
      - `id` (uuid, primary key) - Unique identifier for each website
      - `description` (text) - Description of what the website does
      - `url` (text) - The website URL
      - `clicks` (integer) - Track how many times it's been clicked
      - `order_index` (integer) - For manual ordering of websites
      - `created_at` (timestamptz) - When the website was added
      - `is_active` (boolean) - Whether to show the website
  
  2. Security
    - Enable RLS on `websites` table
    - Add policy for public read access (anyone can view the websites)
    - Add policy for authenticated admin updates (future use)
*/

CREATE TABLE IF NOT EXISTS websites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  url text NOT NULL,
  clicks integer DEFAULT 0,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Enable RLS
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read websites (public access)
CREATE POLICY "Anyone can view active websites"
  ON websites
  FOR SELECT
  USING (is_active = true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_websites_order ON websites(order_index DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_websites_active ON websites(is_active) WHERE is_active = true;