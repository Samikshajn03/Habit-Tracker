import React, { useState, useEffect } from 'react';
import { updateStreakOnAllHabitsDone, getCurrentStreak } from './streakHelper';

const getToday = () => new Date().toISOString().slice(0, 10); 

const HabitTracker = () => {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  });
  const [newHabit, setNewHabit] = useState('');
  const [streak, setStreak] = useState(getCurrentStreak());

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

 const addHabit = () => {
  if (newHabit.trim() === '') return;
  const today = getToday();
  const newHabitItem = {
    id: Date.now(),
    name: newHabit,
    createdDate: today,
    history: {}
  };
  const updatedHabits = [...habits, newHabitItem];
  setHabits(updatedHabits);
  setNewHabit('');

  // Recalculate streak with the new habit included
  setTimeout(() => {
    const newStreak = updateStreakOnAllHabitsDone(updatedHabits);
    setStreak(newStreak);
  }, 0);
};


  const toggleHabit = (id) => {
    const today = getToday();
    const updatedHabits = habits.map(habit => {
      if (habit.id === id) {
        const doneToday = habit.history[today];
        return {
          ...habit,
          history: {
            ...habit.history,
            [today]: !doneToday
          }
        };
      }
      return habit;
    });

    setHabits(updatedHabits);

    // After update, check streaks
    setTimeout(() => {
      const newStreak = updateStreakOnAllHabitsDone(updatedHabits);
      setStreak(newStreak);
    }, 0); // Let state update first
  };

  const deleteHabit = (id) =>{
    const updatedHabits = habits.filter(habit => habit.id !== id);
    setHabits(updatedHabits);

    setTimeout(()=>{
      const newStreak = updateStreakOnAllHabitsDone(updatedHabits);
      setStreak(newStreak);
    }, 0);
  };

  return (
    <div>
      <h2>🔥 Current Streak: {streak} day{streak !== 1 ? 's' : ''}</h2>
      <div className="input-container">
        <input 
          type="text"
          placeholder="Add a habit"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
        />
        <button onClick={addHabit}>Add</button>
      </div>
      <ul className="habit-list">
        {habits.map(habit => (
          <li key={habit.id}>
            <span>{habit.name}</span>
            <button 
              onClick={() => toggleHabit(habit.id)} 
              className={habit.history[getToday()] ? 'done' : ''}
            >
              {habit.history[getToday()] ? '✓' : '○'}
            </button>
             <button onClick={() => deleteHabit(habit.id)} className="delete-btn">
        X
      </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HabitTracker;
