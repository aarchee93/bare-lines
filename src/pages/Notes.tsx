import { useState } from "react";
import { Plus, Grid, FileText, Download, Edit3 } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Project Ideas",
      content: "1. Minimalist task tracker\n2. Habit formation app\n3. Digital notebook interface\n\nFocus on clean, distraction-free design with paper-like aesthetics.",
      createdAt: "2024-01-15T09:00:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2", 
      title: "Meeting Notes - Q1 Planning",
      content: "Key Discussion Points:\n- Review previous quarter performance\n- Set objectives for Q1 2024\n- Resource allocation\n- Timeline development\n\nNext Steps:\n- Finalize budget proposals\n- Schedule follow-up meetings",
      createdAt: "2024-01-14T14:00:00Z",
      updatedAt: "2024-01-14T15:45:00Z",
    }
  ]);

  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0] || null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [backgroundPattern, setBackgroundPattern] = useState<'lines' | 'grid'>('lines');

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote);
    setIsEditing(true);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
  };

  const startEditing = (note: Note) => {
    setIsEditing(true);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const saveNote = () => {
    if (!selectedNote) return;
    
    setNotes(prev => prev.map(note => 
      note.id === selectedNote.id 
        ? { 
            ...note, 
            title: editTitle.trim() || "Untitled Note",
            content: editContent,
            updatedAt: new Date().toISOString()
          }
        : note
    ));
    
    setSelectedNote(prev => prev ? {
      ...prev,
      title: editTitle.trim() || "Untitled Note",
      content: editContent,
      updatedAt: new Date().toISOString()
    } : null);
    
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditTitle("");
    setEditContent("");
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      const remaining = notes.filter(note => note.id !== noteId);
      setSelectedNote(remaining[0] || null);
    }
  };

  const exportToPDF = () => {
    // Simple export functionality - in a real app, this would use a PDF library
    if (selectedNote) {
      const content = `${selectedNote.title}\n\n${selectedNote.content}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedNote.title}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-screen flex">
      {/* Notes List Sidebar */}
      <div className="w-80 border-r border-foreground bg-background flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-foreground">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold">Notes</h1>
            <button
              onClick={createNewNote}
              className="p-2 hover:bg-muted border border-foreground"
              title="New Note"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          {/* Background Pattern Toggle */}
          <div className="flex border border-foreground">
            <button
              onClick={() => setBackgroundPattern('lines')}
              className={`flex-1 py-2 px-3 text-sm flex items-center justify-center border-r border-foreground ${
                backgroundPattern === 'lines' ? 'bg-foreground text-background' : 'hover:bg-muted'
              }`}
            >
              <FileText className="h-3 w-3 mr-1" />
              Lines
            </button>
            <button
              onClick={() => setBackgroundPattern('grid')}
              className={`flex-1 py-2 px-3 text-sm flex items-center justify-center ${
                backgroundPattern === 'grid' ? 'bg-foreground text-background' : 'hover:bg-muted'
              }`}
            >
              <Grid className="h-3 w-3 mr-1" />
              Grid
            </button>
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => {
                setSelectedNote(note);
                setIsEditing(false);
              }}
              className={`p-4 border-b border-foreground cursor-pointer hover:bg-muted ${
                selectedNote?.id === note.id ? 'bg-muted' : ''
              }`}
            >
              <h3 className="font-medium text-sm mb-1 truncate">{note.title}</h3>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {note.content.substring(0, 80)}...
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(note.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
          
          {notes.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notes yet</p>
              <p className="text-sm mt-1">Create your first note</p>
            </div>
          )}
        </div>
      </div>

      {/* Note Editor */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            {/* Note Header */}
            <div className="p-4 border-b border-foreground bg-background flex items-center justify-between">
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-lg font-bold bg-transparent border-none outline-none w-full"
                    placeholder="Note title..."
                  />
                ) : (
                  <h1 className="text-lg font-bold truncate">{selectedNote.title}</h1>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Last updated: {new Date(selectedNote.updatedAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={saveNote}
                      className="px-3 py-1 bg-foreground text-background hover:bg-muted-foreground text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-1 border border-foreground hover:bg-muted text-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(selectedNote)}
                      className="p-2 border border-foreground hover:bg-muted"
                      title="Edit"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="p-2 border border-foreground hover:bg-muted"
                      title="Export"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Note Content */}
            <div className="flex-1 p-0">
              {isEditing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className={`w-full h-full p-6 bg-background border-none outline-none resize-none font-mono text-sm leading-relaxed ${
                    backgroundPattern === 'lines' ? 'notebook-lines' : 'notebook-grid'
                  }`}
                  placeholder="Start writing your note..."
                />
              ) : (
                <div 
                  className={`w-full h-full p-6 ${
                    backgroundPattern === 'lines' ? 'notebook-lines' : 'notebook-grid'
                  }`}
                >
                  <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedNote.content || "This note is empty. Click Edit to add content."}
                  </pre>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a note to view</p>
              <p className="text-sm mt-1">Choose from the list or create a new note</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;