export function updateStreakOnAllHabitsDone(habits) {
  let streakData = JSON.parse(localStorage.getItem('streak')) || {
    count: 0,
    lastDate: null
  };

  const previousStreak = JSON.parse(localStorage.getItem('previousStreak')) || null;

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
    localStorage.removeItem('previousStreak');
    streakData.count = 0;
    streakData.lastDate = null;
    localStorage.setItem('streak', JSON.stringify(streakData));
    return streakData.count;
  }

  // ✅ User unchecked habit after completing all earlier → restore backup
  if (!allDoneToday && previousStreak && streakData.lastDate === today) {
    localStorage.setItem('streak', JSON.stringify(previousStreak));
    localStorage.removeItem('previousStreak');
    return previousStreak.count;
  }

  // ✅ All habits done today and not updated yet → update streak
  if (!alreadyUpdatedToday && allDoneToday) {
    localStorage.setItem('previousStreak', JSON.stringify(streakData));

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