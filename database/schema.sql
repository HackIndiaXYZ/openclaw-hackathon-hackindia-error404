-- PostgreSQL Schema for EduSync Karma Ledger

-- Users Extension (Profiles)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    campus TEXT,
    karma_balance INTEGER DEFAULT 100,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Resources (Vault)
CREATE TABLE IF NOT EXISTS resources (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subject TEXT,
    level TEXT,
    file_url TEXT NOT NULL,
    cost INTEGER DEFAULT 10,
    downloads INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    nexus_network BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Karma Transactions (Ledger)
CREATE TABLE IF NOT EXISTS karma_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender_id UUID REFERENCES profiles(id),
    receiver_id UUID REFERENCES profiles(id),
    amount INTEGER NOT NULL,
    resource_id UUID REFERENCES resources(id),
    type TEXT CHECK (type IN ('unlock', 'reward', 'transfer', 'upload_bonus')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE karma_transactions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Resources are viewable by everyone." ON resources FOR SELECT USING (true);
CREATE POLICY "Users can upload resources." ON resources FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Transactions are viewable by involved parties." ON karma_transactions FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
