import { useState } from "react";
import { Plus, CheckSquare, Square } from "lucide-react";

interface Habit {
  id: string;
  name: string;
  completedDates: string[];
}

const Habits = () => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: "1", name: "Morning Pages", completedDates: ["2024-01-15", "2024-01-13", "2024-01-12"] },
    { id: "2", name: "Exercise", completedDates: ["2024-01-14", "2024-01-12", "2024-01-10"] },
    { id: "3", name: "Reading", completedDates: ["2024-01-15", "2024-01-14", "2024-01-13", "2024-01-11"] },
    { id: "4", name: "Meditation", completedDates: ["2024-01-13", "2024-01-11"] },
  ]);

  const [newHabit, setNewHabit] = useState("");

  // Generate the last 30 days
  const getLast30Days = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const last30Days = getLast30Days();

  const toggleHabit = (habitId: string, date: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;
      
      const isCompleted = habit.completedDates.includes(date);
      return {
        ...habit,
        completedDates: isCompleted
          ? habit.completedDates.filter(d => d !== date)
          : [...habit.completedDates, date]
      };
    }));
  };

  const addHabit = () => {
    if (newHabit.trim()) {
      const habit: Habit = {
        id: Date.now().toString(),
        name: newHabit.trim(),
        completedDates: [],
      };
      setHabits(prev => [...prev, habit]);
      setNewHabit("");
    }
  };

  const getStreak = (habit: Habit) => {
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const sortedDates = [...habit.completedDates].sort().reverse();
    
    let currentDate = new Date();
    for (const date of sortedDates) {
      const checkDate = currentDate.toISOString().split('T')[0];
      if (date === checkDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const getDayAbbrev = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 1);
  };

  const getDayNumber = (dateString: string) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Habits</h1>
        <p className="text-muted-foreground">Track your daily habits over the last 30 days</p>
      </div>

      {/* Add New Habit */}
      <div className="mb-8 p-4 border border-foreground bg-card">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Add a new habit..."
            className="flex-1 p-2 border border-foreground bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            onKeyPress={(e) => e.key === 'Enter' && addHabit()}
          />
          <button
            onClick={addHabit}
            className="px-4 py-2 bg-foreground text-background hover:bg-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Habit
          </button>
        </div>
      </div>

      {/* Habit Tracker Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-full border border-foreground bg-card">
          {/* Header Row with Days */}
          <div className="grid grid-cols-[200px_repeat(30,minmax(24px,1fr))] gap-0 border-b border-foreground">
            <div className="p-3 font-semibold border-r border-foreground">Habit</div>
            {last30Days.map((date, index) => (
              <div key={date} className="p-1 text-xs text-center border-r border-foreground last:border-r-0">
                <div className="font-medium">{getDayAbbrev(date)}</div>
                <div className="text-muted-foreground">{getDayNumber(date)}</div>
              </div>
            ))}
          </div>

          {/* Habit Rows */}
          {habits.map((habit) => (
            <div key={habit.id} className="grid grid-cols-[200px_repeat(30,minmax(24px,1fr))] gap-0 border-b border-foreground last:border-b-0">
              <div className="p-3 border-r border-foreground">
                <div className="font-medium">{habit.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {getStreak(habit)} day streak
                </div>
              </div>
              {last30Days.map((date) => {
                const isCompleted = habit.completedDates.includes(date);
                const isToday = date === new Date().toISOString().split('T')[0];
                return (
                  <div 
                    key={date} 
                    className={`flex items-center justify-center p-1 border-r border-foreground last:border-r-0 ${
                      isToday ? 'bg-muted' : ''
                    }`}
                  >
                    <button
                      onClick={() => toggleHabit(habit.id, date)}
                      className="w-5 h-5 hover:scale-110 transition-transform"
                    >
                      {isCompleted ? (
                        <CheckSquare className="w-full h-full" />
                      ) : (
                        <Square className="w-full h-full" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}

          {habits.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              <Square className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No habits added yet</p>
              <p className="text-sm mt-1">Add your first habit to start tracking</p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      {habits.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border border-foreground bg-card">
            <h3 className="font-semibold mb-2">Today's Progress</h3>
            <p className="text-2xl font-bold">
              {habits.filter(h => h.completedDates.includes(new Date().toISOString().split('T')[0])).length}
              <span className="text-sm font-normal text-muted-foreground">/{habits.length}</span>
            </p>
          </div>

          <div className="p-4 border border-foreground bg-card">
            <h3 className="font-semibold mb-2">Best Streak</h3>
            <p className="text-2xl font-bold">
              {Math.max(...habits.map(getStreak), 0)}
              <span className="text-sm font-normal text-muted-foreground"> days</span>
            </p>
          </div>

          <div className="p-4 border border-foreground bg-card">
            <h3 className="font-semibold mb-2">Total Completions</h3>
            <p className="text-2xl font-bold">
              {habits.reduce((sum, habit) => sum + habit.completedDates.length, 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Habits;