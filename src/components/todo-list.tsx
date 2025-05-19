import React, { useState, useEffect } from 'react';


// Functional component for the to do list
const TodoList = () => {
    // defining the structure of a list item
    type Todo = {
        id: number;
        text: string;
        completed: boolean;
    };
    
    // state to hold the list
    const [todos, setTodos] = useState<Todo[]>([]);
    // state to hold the text of new item
    const [newTask, setNewTask] = useState('');

    // load todos from localStorage on first render
    useEffect(() => {
        const storedTodos = localStorage.getItem('merge_todos');
        if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
        }
    }, []);

    // save todo list to localStorage on every change
    useEffect(() => {
        localStorage.setItem('merge_todos', JSON.stringify(todos));
    }, [todos]);
    // function to add a new item
    const addTodo = () => {
        if (newTask.trim() === '') return;
        // gives the item a unique id (Date.now())
        setTodos([...todos, { id: Date.now(), text: newTask, completed: false }]);
        // Resets the input field after adding
        setNewTask('');
    };

    // Toggles the 'complete' status of a task when clicked
    const toggleComplete = (id: number) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    // Deletes a task by filyering it out based on its ID
    const deleteTodo = (id: number) => {
        // deleting an item using its unique id
        // keeps everything EXCEPT the item with the id that was passed
        setTodos(todos.filter(todo => todo.id !== id));
    };

  return (
    // Simple html layout and tailwindCSS styling of the section
    <section className="max-w-xl bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">To-Do List</h2>
        <div className="flex items-center space-x-2 mb-4">
        <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
            className="flex-grow border rounded px-3 py-2"
        />
        <button
            onClick={addTodo}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
            Add
        </button>
        </div>
        <ul className="space-y-2">
        {todos.map(todo => (
            <li key={todo.id} className="flex items-center justify-between bg-gray-50 border rounded px-3 py-2">
            <span
                onClick={() => toggleComplete(todo.id)}
                className={`flex-1 cursor-pointer ${todo.completed ? 'line-through text-gray-400' : ''}`}
            >
                {todo.text}
            </span>
            <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700"
            >
                ✕
            </button>
            </li>
        ))}
        </ul>
    </section>
  );
};
// exporting to be used in other pages

// Export the TodoList component for use in other parts of the app
export default TodoList;
