// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, CheckCircle, Circle, PlusCircle, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Define the Task type
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date | null;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
}
// Main components
const TaskManager = () => {
  // state to hold all tasks
  const [tasks, setTasks] = useState<Task[]>([]);

  // UI state: is the form for adding/editing tasks open
  const [isAddingTask, setIsAddingTask] = useState(false);
  // Form state for new or editing task
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState<Date | null>(null);
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Track completed task count by priority 
  const [completedTaskCounts, setCompletedTaskCounts] = useState<{ High: number; Medium: number; Low: number }>({ High: 0, Medium: 0, Low: 0 });
  
  // Track percentage completion by priority
  const [totalTaskCounts, setTotalTaskCounts] = useState<{ High: number; Medium: number; Low: number }>({ High: 0, Medium: 0, Low: 0 });
  const [completionPercentages, setCompletionPercentages] = useState<{ High: string; Medium: string; Low: string }>({ High: '0%', Medium: '0%', Low: '0%' });

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Validate data structure
        if (Array.isArray(parsedTasks)) {
          let valid = true;
          for (const task of parsedTasks) {
            // Validate task structure
            if (
              typeof task !== 'object' ||
              typeof task.id !== 'string' ||
              typeof task.title !== 'string' ||
              typeof task.description !== 'string' ||
              (task.dueDate !== null && typeof task.dueDate !== 'string') || // Allow null dueDate, check for string
              typeof task.completed !== 'boolean' ||
              (task.priority !== 'High' && task.priority !== 'Medium' && task.priority !== 'Low')
            ) {
              valid = false;
              break;
            }
          }
          if (valid) {
            // Convert dueDate strings back to Date objects.
            const loadedTasks = parsedTasks.map((task: Task) => ({
              ...task,
              dueDate: task.dueDate ? new Date(task.dueDate) : null,
            }));
            setTasks(loadedTasks);
          } else {
            console.error('Invalid data structure in localStorage');
            localStorage.removeItem('tasks');
            setTasks([]);
          }
        } else {
          console.error('Data loaded from localStorage is not an array.');
          localStorage.removeItem('tasks');
          setTasks([]);
        }
      } catch (error) {
        console.error('Error parsing tasks from localStorage:', error);
        localStorage.removeItem('tasks'); // Clear corrupted data
        setTasks([]);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem('tasks')) { // only save if there are tasks
      // Convert Date objects to strings before saving
      const tasksToSave = tasks.map(task => ({
        ...task,
        dueDate: task.dueDate ? task.dueDate.toISOString() : null, //convert date to string
      }));
      localStorage.setItem('tasks', JSON.stringify(tasksToSave));
    } else {
      localStorage.removeItem('tasks');
    }
  }, [tasks]);

  // Recalculate completed total and percentage values on task change
  useEffect(() => {
    const highCompleted = tasks.filter(task => task.completed && task.priority === 'High').length;
    const mediumCompleted = tasks.filter(task => task.completed && task.priority === 'Medium').length;
    const lowCompleted = tasks.filter(task => task.completed && task.priority === 'Low').length;
    setCompletedTaskCounts({ High: highCompleted, Medium: mediumCompleted, Low: lowCompleted });

    const highTotal = tasks.filter(task => task.priority === 'High').length;
    const mediumTotal = tasks.filter(task => task.priority === 'Medium').length;
    const lowTotal = tasks.filter(task => task.priority === 'Low').length;
    setTotalTaskCounts({ High: highTotal, Medium: mediumTotal, Low: lowTotal });

    const calculatePercentage = (completed: number, total: number) => {
      return total === 0 ? '0%' : `${((completed / total) * 100).toFixed(0)}%`;
    };

    setCompletionPercentages({
      High: calculatePercentage(highCompleted, highTotal),
      Medium: calculatePercentage(mediumCompleted, mediumTotal),
      Low: calculatePercentage(lowCompleted, lowTotal),
    });
  }, [tasks]);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      description: newTaskDescription,
      dueDate: newDueDate,
      completed: false,
      priority: newPriority,
    };

    setTasks([...tasks, newTask]);
    setIsAddingTask(false);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewDueDate(null);
    setNewPriority('Medium');
    setEditingTaskId(null); // Clear editing ID
  };

  const updateTask = (id: string, updates: Partial<Omit<Task, 'id'>>) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    setEditingTaskId(null); // Clear editing ID if the current editing task is deleted
  };

  const toggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const startEditing = (id: string) => {
    setEditingTaskId(id);
    const taskToEdit = tasks.find(task => task.id === id);
    if (taskToEdit) {
      setNewTaskTitle(taskToEdit.title);
      setNewTaskDescription(taskToEdit.description);
      setNewDueDate(taskToEdit.dueDate);
      setNewPriority(taskToEdit.priority);
      setIsAddingTask(true); // Ensure form is visible
    }
  };

  const saveChanges = (id: string) => {
    if (!newTaskTitle.trim()) return;
    updateTask(id, {
      title: newTaskTitle,
      description: newTaskDescription,
      dueDate: newDueDate,
      priority: newPriority,
    });
    setEditingTaskId(null);
    setIsAddingTask(false); // Hide form after saving
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewDueDate(null);
    setNewPriority('Medium');
  };

  // Return color classes for different priorities
  const getPriorityColor = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High':
        return 'bg-red-500 text-white';
      case 'Medium':
        return 'bg-yellow-500 text-white';
      case 'Low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen rounded-lg shadow-lg flex flex-col lg:flex-row">
      {/* Overview Section */}
      <div className="w-full lg:w-1/4 mr-8 mb-8 lg:mb-0">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Overview</h2>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Completed Tasks</h3>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <span className="text-gray-600">High Priority:</span>
              <div>
                <span className="font-semibold text-red-500 mr-2">{completedTaskCounts.High}</span>
                <span className="text-gray-500 text-sm">({completionPercentages.High})</span>
                <span className="text-gray-600 text-sm ml-2">
                  / {totalTaskCounts.High}
                </span>
              </div>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-600">Medium Priority:</span>
              <div>
                <span className="font-semibold text-yellow-500 mr-2">{completedTaskCounts.Medium}</span>
                <span className="text-gray-500 text-sm">({completionPercentages.Medium})</span>
                <span className="text-gray-600 text-sm ml-2">
                  / {totalTaskCounts.Medium}
                </span>
              </div>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-600">Low Priority:</span>
              <div>
                <span className="font-semibold text-green-500 mr-2">{completedTaskCounts.Low}</span>
                <span className="text-gray-500 text-sm">({completionPercentages.Low})</span>
                <span className="text-gray-600 text-sm ml-2">
                  / {totalTaskCounts.Low}
                </span>
              </div>
            </li>
            <li className="flex justify-between items-center mt-2">
              <span className="text-gray-700 font-semibold">Total:</span>
              <span className="font-bold text-gray-800">
                {completedTaskCounts.High + completedTaskCounts.Medium + completedTaskCounts.Low}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Task Manager Section */}
      <div className="w-full lg:w-3/4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Task Manager</h1>

        {/* Add New Task Section */}
        {!isAddingTask && (
          <Button
            onClick={() => setIsAddingTask(true)}
            className="mb-4 bg-blue-500 hover:bg-blue-600 text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Task
          </Button>
        )}

        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

        {isAddingTask && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editingTaskId ? "Edit Task" : "Add New Task"}
            </h2>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                Title
              </label>
              <Input
                type="text"
                id="title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="bg-gray-50 text-gray-900"
                placeholder="Task title"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <Textarea
                id="description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="bg-gray-50 text-gray-900"
                placeholder="Task description"
                rows={3}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="dueDate" className="block text-gray-700 text-sm font-bold mb-2">
                Due Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full bg-gray-50 text-gray-700 justify-start text-left font-normal border-gray-300",
                      !newDueDate && "text-muted-foreground"
                    )}
                  >
                    {newDueDate ? (
                      format(newDueDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border-gray-300" align="start">
                  <Calendar
                    mode="single"
                    selected={newDueDate}
                    onSelect={setNewDueDate}
                    className="rounded-md text-gray-900"
                    style={{ backgroundColor: '#fff' }} // Fix calendar style issue.
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="mb-4">
              <label htmlFor="priority" className="block text-gray-700 text-sm font-bold mb-2">
                Priority
              </label>
              <Select
                value={newPriority}
                onValueChange={(value) => setNewPriority(value as 'High' | 'Medium' | 'Low')}
              >
                <SelectTrigger className="w-full bg-gray-50 text-gray-700 border-gray-300">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className='bg-white border-gray-300'>
                  <SelectItem value="High" className="text-gray-900 hover:bg-gray-100">High</SelectItem>
                  <SelectItem value="Medium" className="text-gray-900 hover:bg-gray-100">Medium</SelectItem>
                  <SelectItem value="Low" className="text-gray-900 hover:bg-gray-100">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingTask(false);
                  setNewTaskTitle('');
                  setNewTaskDescription('');
                  setNewDueDate(null);
                  setNewPriority('Medium');
                  if (editingTaskId) {
                    setEditingTaskId(null);
                  }
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (editingTaskId) {
                    saveChanges(editingTaskId);
                  } else {
                    addTask();
                  }
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {editingTaskId ? "Save" : "Add"}
              </Button>
            </div>
          </div>
        )}

        {/* Task List */}
        <div>
          {tasks.length === 0 && !isAddingTask && (
            <p className="text-gray-400 text-center py-8">No tasks yet. Add a new task!</p>
          )}
          {tasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-lg shadow-md mb-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleComplete(task.id)}
                  className={cn(
                    "rounded-full h-10 w-10",
                    task.completed
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "text-gray-400 hover:text-gray-700"
                  )}
                >
                  {task.completed ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </Button>
                <div>
                  <h3 className={cn("text-lg font-semibold", task.completed ? "text-gray-400 line-through" : "text-gray-800")}>
                    {task.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{task.description}</p>
                  {task.dueDate && (
                    <p className="text-gray-600 text-sm">
                      Due: {format(task.dueDate, 'PPP')}
                    </p>
                  )}
                  <div className={cn(
                    "mt-1 px-2 py-1 rounded-full text-xs inline-block",
                    getPriorityColor(task.priority)
                  )}>
                    {task.priority}
                  </div>

                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => startEditing(task.id)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/50"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;

