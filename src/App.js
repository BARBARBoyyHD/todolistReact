import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, settodos] = useState([]);
  const [task, setTask] = useState("");
  const [taskName, setTaskName] = useState("");
  const [status, setStatus] = useState("todos");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/todos")
      .then((res) => res.json())
      .then((data) => {
        settodos(data);
      });
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:8000/todos/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          settodos(todos.filter((todo) => todo.id !== id));
        } else {
          console.log("Something went wrong");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTodo = { task, taskName, status };

    if (isEditing) {
      fetch(`http://localhost:8000/todos/${currentTodoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      })
        .then((res) => res.json())
        .then((data) => {
          const updatedTodos = todos.map((todo) =>
            todo.id === currentTodoId ? data : todo
          );
          settodos(updatedTodos);
          setTask("");
          setTaskName("");
          setStatus("todos");
          setIsEditing(false);
          setCurrentTodoId(null);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      fetch("http://localhost:8000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      })
        .then((res) => res.json())
        .then((data) => {
          settodos([...todos, data]);
          setTask("");
          setTaskName("");
          setStatus("todos");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleEdit = (todo) => {
    setTask(todo.task);
    setTaskName(todo.taskName);
    setStatus(todo.status);
    setIsEditing(true);
    setCurrentTodoId(todo.id);
  };

  return (
    <div className="App">
      <h1>Todos List App</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="task">Task:</label>
        <input
          type="text"
          name="task"
          id="task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          required
        />
        <label htmlFor="taskName">Task Name:</label>
        <input
          type="text"
          name="taskName"
          id="taskName"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />
        <label htmlFor="status">Status:</label>
        <select
          name="status"
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="todos">todos</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <button type="submit" className="add">
          {isEditing ? "Update" : "Add"}
        </button>
      </form>
      <div className="task-details">
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Task Name</th>
              <th>Status</th>
              <th>Edit</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo, index) => (
              <tr key={index}>
                <td>{todo.task}</td>
                <td>{todo.taskName}</td>
                <td>{todo.status}</td>
                <td>
                  <button onClick={() => handleEdit(todo)} className="edit">
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="remove"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
