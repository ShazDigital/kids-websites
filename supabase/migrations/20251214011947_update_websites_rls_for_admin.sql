/*
  # Update RLS policies for admin operations
  
  1. Changes
    - Add INSERT policy for public access (admin panel will have client-side password)
    - Add UPDATE policy for public access
    - Add DELETE policy for public access
  
  2. Security Notes
    - This allows anyone to modify the data
    - Client-side password protection in admin panel provides basic access control
    - For production, consider implementing proper authentication
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert websites" ON websites;
DROP POLICY IF EXISTS "Anyone can update websites" ON websites;
DROP POLICY IF EXISTS "Anyone can delete websites" ON websites;

-- Allow anyone to insert websites
CREATE POLICY "Anyone can insert websites"
  ON websites
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update websites
CREATE POLICY "Anyone can update websites"
  ON websites
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow anyone to delete websites
CREATE POLICY "Anyone can delete websites"
  ON websites
  FOR DELETE
  USING (true);