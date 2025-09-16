import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckSquare, Square, Target, BookOpen, Calendar } from "lucide-react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate: string;
}

interface Habit {
  id: string;
  name: string;
  completedDates: string[];
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const today = new Date().toISOString().split('T')[0];

  // Load sample data
  useEffect(() => {
    const sampleTasks: Task[] = [
      { id: "1", text: "Review quarterly goals", completed: false, dueDate: today },
      { id: "2", text: "Update project documentation", completed: true, dueDate: today },
      { id: "3", text: "Plan next week's priorities", completed: false, dueDate: today },
    ];

    const sampleHabits: Habit[] = [
      { id: "1", name: "Morning Pages", completedDates: [today] },
      { id: "2", name: "Exercise", completedDates: [] },
      { id: "3", name: "Reading", completedDates: [today] },
    ];

    setTasks(sampleTasks);
    setHabits(sampleHabits);
  }, [today]);

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completedHabits = habits.filter(habit => habit.completedDates.includes(today)).length;
  const totalHabits = habits.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 border border-foreground bg-card">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 mr-3" />
            <div>
              <p className="text-sm text-muted-foreground">Today's Tasks</p>
              <p className="text-2xl font-bold">{completedTasks}/{totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border border-foreground bg-card">
          <div className="flex items-center">
            <Target className="h-8 w-8 mr-3" />
            <div>
              <p className="text-sm text-muted-foreground">Habits</p>
              <p className="text-2xl font-bold">{completedHabits}/{totalHabits}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border border-foreground bg-card">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 mr-3" />
            <div>
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </div>

        <div className="p-6 border border-foreground bg-card">
          <div className="flex items-center">
            <CheckSquare className="h-8 w-8 mr-3" />
            <div>
              <p className="text-sm text-muted-foreground">Completion</p>
              <p className="text-2xl font-bold">
                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Tasks */}
        <div className="border border-foreground bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Today's Tasks</h2>
            <Link 
              to="/tasks" 
              className="text-sm text-muted-foreground hover:text-foreground border-b border-transparent hover:border-foreground"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center space-x-3">
                {task.completed ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                  {task.text}
                </span>
              </div>
            ))}
            {tasks.length === 0 && (
              <p className="text-muted-foreground text-sm">No tasks for today</p>
            )}
          </div>
        </div>

        {/* Habits Progress */}
        <div className="border border-foreground bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Today's Habits</h2>
            <Link 
              to="/habits" 
              className="text-sm text-muted-foreground hover:text-foreground border-b border-transparent hover:border-foreground"
            >
              View tracker
            </Link>
          </div>
          <div className="space-y-3">
            {habits.map((habit) => (
              <div key={habit.id} className="flex items-center justify-between">
                <span>{habit.name}</span>
                <div className="flex items-center">
                  {habit.completedDates.includes(today) ? (
                    <CheckSquare className="h-4 w-4" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </div>
              </div>
            ))}
            {habits.length === 0 && (
              <p className="text-muted-foreground text-sm">No habits tracked</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;