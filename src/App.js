import { useState, useEffect } from "react";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);

const API_URL = "http://localhost:5000/api/todos";


  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error("Greška pri učitavanju beleški:", err));
  }, []);

  const saveNote = () => {
    if (title.trim() === "" || content.trim() === "") return;

    if (editId) {
      fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      })
        .then((res) => res.json())
        .then((updatedNote) => {
          setNotes(notes.map((note) => (note._id === editId ? updatedNote : note)));
          resetForm();
        })
        .catch((err) => console.error("Greška pri ažuriranju beleške:", err));
    } else {
     fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    })
      .then((res) => res.json())
      .then((newNote) => {
        console.log("Dodato:", newNote); // <--- dodaj ovo
        setNotes([newNote, ...notes]);
        resetForm();
      })
      .catch((err) => console.error("Greška pri dodavanju beleške:", err));
      }  }

  const deleteNote = (id) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => {
        setNotes(notes.filter((note) => note._id !== id));
        if (editId === id) resetForm();
      })
      .catch((err) => console.error("Greška pri brisanju beleške:", err));
  };

  const editNote = (note) => {
    setEditId(note._id);
    setTitle(note.title);
    setContent(note.content);
  };

  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setContent("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 p-8 flex justify-center items-start">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-8 flex flex-col md:flex-row gap-8">
        <div className="flex flex-col flex-shrink-0 w-full md:w-1/3 bg-indigo-50 rounded-2xl p-6 shadow-inner">
          <h1 className="text-4xl font-extrabold mb-6 text-indigo-900 select-none">My Notes</h1>
          <input
            type="text"
            placeholder="Title"
            className="mb-4 px-5 py-3 rounded-lg border border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 shadow-sm text-lg font-semibold"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            rows="8"
            placeholder="Write your note here..."
            className="resize-none px-5 py-3 rounded-lg border border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 shadow-sm text-gray-700"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            onClick={saveNote}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition text-white rounded-lg font-bold text-lg py-3 shadow-lg shadow-indigo-400/50"
          >
            {editId ? "Update Note" : "Add Note"}
          </button>
          {editId && (
            <button
              onClick={resetForm}
              className="mt-2 text-indigo-600 underline hover:text-indigo-800"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="flex-grow overflow-y-auto max-h-[80vh]">
          {notes.length === 0 ? (
            <p className="text-center text-indigo-100 text-xl select-none mt-20">No notes yet. Add one!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {notes.map((note) => (
                <div
                  key={note._id}
                  onClick={() => editNote(note)}
                  className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition relative"
                >
                  <h2 className="text-2xl font-semibold mb-3 text-indigo-900 truncate">{note.title}</h2>
                  <p className="text-gray-700 whitespace-pre-wrap max-h-32 overflow-hidden">{note.content}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note._id);
                    }}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-extrabold text-2xl select-none"
                    aria-label="Delete note"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
