export function updateStreakOnAllHabitsDone(habits) {
  let streakData = JSON.parse(localStorage.getItem('streak')) || {
    count: 0,
    lastDate: null
  };

  const today = new Date().toISOString().slice(0, 10);
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().slice(0, 10);

  const habitsToCheck = habits.filter(habit => habit.createdDate <= today);

  const allDoneToday =
    habitsToCheck.length > 0 &&
    habitsToCheck.every(habit => habit.history[today]);

  const allDoneYesterday =
    habitsToCheck.length > 0 &&
    habitsToCheck.every(habit => habit.history[yesterday]);

  const alreadyUpdatedToday = streakData.lastDate === today;

  // ✅ Reset streak if yesterday missed
  if (
    streakData.lastDate &&
    streakData.lastDate !== today &&
    !allDoneYesterday
  ) {
    streakData.count = 0;
    streakData.lastDate = null;
    localStorage.setItem('streak', JSON.stringify(streakData));
  }

  // ✅ Reset if user unchecked after previously completing all habits
  if (alreadyUpdatedToday && !allDoneToday) {
    streakData.count = streakData.count > 0 ? streakData.count - 1 : 0;
    streakData.lastDate = null;
    localStorage.setItem('streak', JSON.stringify(streakData));
    return streakData.count;
  }

  // ✅ Only update streak if not already updated today AND all are done
  if (!alreadyUpdatedToday && allDoneToday) {
    if (streakData.lastDate === yesterday) {
      streakData.count += 1;
    } else {
      streakData.count = 1;
    }

    streakData.lastDate = today;
    localStorage.setItem('streak', JSON.stringify(streakData));
  }

  return streakData.count;
}



export function getCurrentStreak() {
  const data = JSON.parse(localStorage.getItem('streak')) || {
    count: 0,
    lastDate: null
  };
  return data.count;
}