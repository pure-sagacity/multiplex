# Multiplex

## Overview
Multiplex is a Next.js-based web application designed for creating, editing, and sharing Markdown-based "Boards". It functions as a collaborative content management system or documentation tool where users can maintain boards with rich text editing capabilities.

## Technology Stack

### Core Frameworks
- **Next.js**: v16.1.5 (App Router)
- **React**: v19.2.3
- **Language**: TypeScript

### Styling
- **Tailwind CSS**: v4.0
- **DaisyUI**: v5.5.14
- **Lucide React**: For icons
- **Tools**: PostCSS

### Database & ORM
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Drizzle ORM
- **Migration Tool**: Drizzle Kit
- **Supabase**: Client included (`@supabase/supabase-js`), likely for storage or specific backend features.

### Authentication
- **Library**: `better-auth`
- **Features**: Email/Password login, Admin privileges, Username support.
- **Session Management**: Database-backed sessions.

### Editor
- **Core Engine**: CodeMirror 6
- **Markdown Support**: `@codemirror/lang-markdown`, `react-markdown`, `remark-gfm`
- **Syntax Highlighting**: `highlight.js`

### Image Upload
- **Storage**: Supabase Storage (bucket: `profile_pics`)
- **Upload**: Handled via Server Action (`app/actions/images/Upload.ts`)
- **Usage**: Primarily for user profile pictures.

## Architecture

### Directory Structure
```
/
├── app/                  # Next.js App Router source
│   ├── (pages)/          # Route groups and page definitions
│   │   ├── (dynamics)/   # Dynamic routes (e.g., /board/[id])
│   │   ├── board/        # Board management pages
│   │   ├── login/        # Authentication pages
│   │   └── create/       # Creation flows
│   ├── actions/          # Server Actions for data mutation
│   ├── api/              # API Routes (Next.js)
│   ├── components/       # Reusable React components
│   └── lib/              # Utilities, DB configuration, Auth setup
├── drizzle/              # Database migrations (.sql files)
├── public/               # Static assets
└── ...config files       # TSConfig, Tailwind, Drizzle, etc.
```

### Key Directories

#### `app/lib`
Contains core backend configurations:
- `schema.ts`: Drizzle ORM schema definitions.
- `auth.ts`: Better Auth configuration.
- `drizzle.ts`: Database connection instance.
- `supabase.ts`: Supabase client initialization.

#### `app/components`
Key UI components, importantly:
- `MarkdownEditor.tsx`: The core editor component containing the CodeMirror integration.

#### `app/actions`
Server actions for handling business logic (e.g., `GetBoard`, creating boards).

## Data Model

### Board (`board` table)
The central entity of the application.
- `id`: UUID, Primary Key.
- `author_id`: User ID of the creator.
- `title`: Title of the board.
- `data`: Text content of the board (Markdown).
- `editors`: Array of User IDs who can edit.
- `is_public`: Boolean flag for visibility.
- `created_at`: Timestamp.

### User & Auth (`user`, `session`, `account`, `verification`)
Standard tables managed by Better Auth to handle user identity, sessions, and OAuth accounts (if added).
- **User**: Stores name, email, role, ban status, and username.

## Key Features

1.  **Authentication**: Users can sign up and login using Email/Password. Sessions are persisted in Postgres.
2.  **Board Management**:
    - Create new boards.
    - View and Edit boards using a Markdown editor.
    - Public/Private visibility toggles.
    - Collaboration (via `editors` array).
3.  **Markdown Editing**:
    - Real-time preview (implied by React Markdown usage).
    - Syntax highlighting.
    - GFM (GitHub Flavored Markdown) support (tables, strikethrough, etc.).

4.  **Image Upload**:
    - Uses Supabase Storage (bucket: `profile_pics`).
    - Handled via Server Action (`app/actions/images/Upload.ts`).
    - Primarily for user profile pictures.

## Environment Variables
The application relies on the following environment variables (inferred):
- `DATABASE_URL`: Connection string for PostgreSQL (Neon).
- `BETTER_AUTH_URL`: Base URL for authentication.
- `BETTER_AUTH_SECRET`: Secret key for signing tokens (standard for Better Auth).
- `SUPABASE_URL` / `SUPABASE_ANON_KEY`: If Supabase features are active.

## Development Commands
- `npm run dev` / `pnpm dev`: Start development server.
- `npm run build`: Build for production.
- `npx drizzle-kit push`: Push schema changes to the database.
- `npx drizzle-kit studio`: Open Drizzle Studio to manage data.
