import { useState, useRef, useCallback, useEffect } from 'react';
import { useStudyNotesSync } from '../../../hooks/IALab/useStudyNotesSync';

const RESOURCE_NOTES_KEY = 'ialab_resource_notes';

export default function useResourceNotes(resource) {
  const [noteText, setNoteText] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [noteSaved, setNoteSaved] = useState(true);
  const noteDebounceRef = useRef(null);
  const { syncResourceNote } = useStudyNotesSync();

  useEffect(() => {
    setNoteText('');
    setShowNotes(false);
    setNoteSaved(true);
    if (resource?.id) {
      try {
        const allNotes = JSON.parse(localStorage.getItem(RESOURCE_NOTES_KEY) || '{}');
        setNoteText(allNotes[resource.id] || '');
      } catch {}
    }
  }, [resource?.id]);

  const handleNoteChange = useCallback((e) => {
    const val = e.target.value;
    setNoteText(val);
    setNoteSaved(false);
    if (noteDebounceRef.current) clearTimeout(noteDebounceRef.current);
    noteDebounceRef.current = setTimeout(() => {
      try {
        const allNotes = JSON.parse(localStorage.getItem(RESOURCE_NOTES_KEY) || '{}');
        allNotes[resource.id] = val;
        localStorage.setItem(RESOURCE_NOTES_KEY, JSON.stringify(allNotes));
      } catch {}
      syncResourceNote(resource.id, val);
      setNoteSaved(true);
    }, 1500);
  }, [resource, syncResourceNote]);

  useEffect(() => {
    return () => {
      if (noteDebounceRef.current) clearTimeout(noteDebounceRef.current);
    };
  }, []);

  return { noteText, showNotes, setShowNotes, noteSaved, handleNoteChange };
}
