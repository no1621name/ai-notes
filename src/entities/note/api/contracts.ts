export interface NoteBody {
  id: string;
  title: string;
  text: string;
  created_at: Date;
  reminder_date: Date | null;
}

export interface NoteShort extends Omit<NoteBody, 'text'> {
  description: string;
}
