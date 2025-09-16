import { useState, useEffect } from "react";
import { Plus, CheckSquare, Square, Calendar, Filter, Trash2 } from "lucide-react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  category: 'daily' | 'weekly' | 'monthly';
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tracker-tasks');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: "1", text: "Review quarterly goals", completed: false, dueDate: new Date().toISOString().split('T')[0], priority: 'high', category: 'monthly' },
      { id: "2", text: "Update project documentation", completed: false, dueDate: new Date().toISOString().split('T')[0], priority: 'medium', category: 'weekly' },
      { id: "3", text: "Plan next week's priorities", completed: false, dueDate: new Date().toISOString().split('T')[0], priority: 'low', category: 'daily' },
    ];
  });
  
  const [newTask, setNewTask] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');
  const [showCompleted, setShowCompleted] = useState(true);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tracker-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'medium',
        category: selectedCategory === 'all' ? 'daily' : selectedCategory,
      };
      setTasks(prev => [...prev, task]);
      setNewTask("");
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const filteredTasks = tasks.filter(task => {
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;
    if (!showCompleted && task.completed) return false;
    return true;
  });

  const categories: Array<{value: 'all' | 'daily' | 'weekly' | 'monthly', label: string}> = [
    { value: 'all', label: 'All Tasks' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <Filter className="h-4 w-4 mr-1" />
            {showCompleted ? 'Hide' : 'Show'} Completed
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-1 mb-6 border border-foreground">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`flex-1 py-2 px-4 text-sm font-medium border-r border-foreground last:border-r-0 ${
              selectedCategory === category.value
                ? 'bg-foreground text-background'
                : 'bg-background text-foreground hover:bg-muted'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Add New Task */}
      <div className="mb-8 p-4 border border-foreground bg-card">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 p-2 border border-foreground bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <button
            onClick={addTask}
            className="px-4 py-2 bg-foreground text-background hover:bg-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 border border-foreground bg-card hover:bg-muted transition-colors ${
              task.completed ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleTask(task.id)}
                className="flex-shrink-0 hover:scale-110 transition-transform"
              >
                {task.completed ? (
                  <CheckSquare className="h-5 w-5" />
                ) : (
                  <Square className="h-5 w-5" />
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${
                  task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                }`}>
                  {task.text}
                </p>
                <div className="flex items-center mt-1 space-x-4">
                  <span className={`text-xs px-2 py-1 border border-foreground ${
                    task.category === 'daily' ? 'bg-background' :
                    task.category === 'weekly' ? 'bg-muted' : 'bg-secondary'
                  }`}>
                    {task.category}
                  </span>
                  <span className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => deleteTask(task.id)}
                className="flex-shrink-0 p-1 hover:bg-destructive hover:text-destructive-foreground transition-colors ml-2"
                title="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Square className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No tasks found</p>
            <p className="text-sm mt-1">
              {selectedCategory === 'all' ? 'Add a new task to get started' : `No ${selectedCategory} tasks`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;