import { useState } from 'react';

const DEFAULT_EXERCISE = {
  name: '',
  sets: '',
  reps: '',
  weightKg: '',
  restTimeSec: '60',
  notes: '',
};

export function useWorkoutPlanner({ onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('45 mins');
  const [error, setError] = useState(null);
  const [exercises, setExercises] = useState([
    { name: 'Barbell Bench Press', sets: '4', reps: '10', weightKg: '80', restTimeSec: '90', notes: 'Chest focus' },
  ]);

  const handleAddExercise = () => {
    setExercises((prev) => [...prev, { ...DEFAULT_EXERCISE }]);
  };

  const handleRemoveExercise = (idx) => {
    setExercises((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleMoveUp = (idx) => {
    if (idx === 0) return;
    setExercises((prev) => {
      const copy = [...prev];
      [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]];
      return copy;
    });
  };

  const handleMoveDown = (idx) => {
    if (idx === exercises.length - 1) return;
    setExercises((prev) => {
      const copy = [...prev];
      [copy[idx + 1], copy[idx]] = [copy[idx], copy[idx + 1]];
      return copy;
    });
  };

  const handleExerciseChange = (idx, field, value) => {
    setExercises((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleSelectFromLibrary = (selectedEx, replacingIdx) => {
    if (replacingIdx !== null) {
      setExercises((prev) => {
        const copy = [...prev];
        copy[replacingIdx] = { ...copy[replacingIdx], name: selectedEx.name };
        return copy;
      });
    } else {
      setExercises((prev) => [
        ...prev,
        {
          name: selectedEx.name,
          sets: '3',
          reps: '10',
          weightKg: '0',
          restTimeSec: '60',
          notes: `${selectedEx.muscleGroup} exercise`,
        },
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!title || title.trim() === '') {
      setError('Workout Name is required.');
      return;
    }
    if (!duration || duration.trim() === '') {
      setError('Target Duration is required.');
      return;
    }
    if (exercises.length === 0) {
      setError('At least one exercise is required.');
      return;
    }
    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
      if (!ex.name || ex.name.trim() === '') {
        setError(`Exercise #${i + 1} requires a name.`);
        return;
      }
      if (!ex.sets || isNaN(Number(ex.sets))) {
        setError(`Exercise "${ex.name}" requires a valid number of sets.`);
        return;
      }
      if (!ex.reps || String(ex.reps).trim() === '') {
        setError(`Exercise "${ex.name}" requires reps.`);
        return;
      }
    }

    onSave({ title: title.trim(), duration, exercises });
    onClose();
  };

  return {
    title,
    setTitle,
    duration,
    setDuration,
    error,
    setError,
    exercises,
    handleAddExercise,
    handleRemoveExercise,
    handleMoveUp,
    handleMoveDown,
    handleExerciseChange,
    handleSelectFromLibrary,
    handleSubmit,
  };
}
