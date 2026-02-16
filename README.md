# Strictlys — Habit & Todo Tracker

Build better habits, one day at a time. Strictlys is a modern, mobile-first productivity app that combines a daily to-do list with a Duolingo-style streak system to keep you motivated.

![Streakly App](https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=2072&ixlib=rb-4.0.3)

## ✨ Features

- **🔥 Streak System**: Complete all your tasks for the day to increase your streak. Skip a day, and it resets!
- **🏆 Best Streak**: Tracks your all-time high score. Even if your current streak resets, your best streak remains.
- **📅 Daily Groups**: Todos are automatically grouped by date (Today, Yesterday, etc.).
- **🎨 Habitly-Inspired UI**: Beautiful pastel cards, auto-generated emoji icons, and a clean card-based layout.
- **📱 Mobile First**: Designed to look and feel great on your phone.
- **🔒 Secure Auth**: Powered by Supabase Authentication.

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js (v18 or higher)
- A [Supabase](https://supabase.com/) account (free)

### 1. Clone the repository

```bash
git clone https://github.com/G2aluh/Streakly---Todolist.git
cd Streakly---Todolist
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Supabase

1. Create a new project in your Supabase dashboard.
2. Go to square **SQL Editor** in the sidebard.
3. Run the following SQL to create the necessary tables and policies:

```sql
-- Create Todos Table
create table public.todos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  date date not null,
  is_completed boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS for Todos
alter table public.todos enable row level security;
create policy "Users manage own todos" on public.todos
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create Streaks Table
create table public.streaks (
  user_id uuid references auth.users(id) on delete cascade primary key,
  current_streak int default 0,
  best_streak int default 0,
  last_completed_date date
);

-- Enable RLS for Streaks
alter table public.streaks enable row level security;
create policy "Users manage own streak" on public.streaks
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

4. Get your project URL and Anon Key from **Project Settings > API**.

### 4. Set up environment variables

Create a `.env` file in the root directory:

```bash
touch .env
```

Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to start building your streak!

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Backend/Auth**: Supabase
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📝 License

This project is open source. Feel free to use it to build your own habits!
