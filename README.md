# AI Notes

It is a note-taking app built with Vue 3. 

## Key Features
- ✨ **AI-Powered Rich Text Editing**: Prompt, modify, and generate text using AI models directly in the editor.
- 💾 **Local Storage**: All notes and preferences are stored securely in your browser (IndexedDB).
- 🏷️ **Organization**: Keep your thoughts structured using tags.
- ⏰ **Reminders**: Set reminders for your notes.
- 🌐 **Internalization**: The app supports multiple languages.

## Tech Stack
- **Framework & Build**: Vue 3, Vite
- **Styling**: Tailwind CSS, daisyUI
- **State Management**: Pinia
- **Data Fetching**: TanStack Query
- **Editor**: Tiptap
- **Form & Validation**: Regle, Artype
- **Testing**: Vitest
- **Package Manager**: pnpm
- **I18n**: Vue I18n
- **Architecture**: [FSD](https://fsd.how/ru/docs/get-started/overview/)
- **Notifications logic**: Supabase Edge Functions
- **CI/CD**: GitHub Actions 

## Supported Providers & Languages

For now only [Groq](https://groq.com/) is supported as a provider for AI models. If you need support for other providers, please open an issue.

Also there are only English and Russian languages supported for now. If you need support for other languages, please open an issue.

## Acknowledgements

Special thanks to [Vlad Starkovsky](https://github.com/starkovsky) for bug reports and improvement suggestions via his custom AI agent.
