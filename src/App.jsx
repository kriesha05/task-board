import tasks from "./data/tasks.json"
import { useState } from 'react'
import './App.css'

function App() {

  const [taskList, setTaskList] = useState(tasks)
  const [searchText, setSearchText] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newStatus, setNewStatus] = useState("open")
  const [newPriority, setNewPriority] = useState("medium")
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editedTitle, setEditedTitle] = useState("")
  const [editedDescription, setEditedDescription] = useState("")
  const [editedStatus, setEditedStatus] = useState("open")
  const [editedPriority, setEditedPriority] = useState("medium")

  function handleDelete(taskId) {
    const updatedTasks = taskList.filter((task) => task.id !== taskId)
    setTaskList(updatedTasks)
  }

  function handleEdit(task) {
    setEditingTaskId(task.id)
    setEditedTitle(task.title)
    setEditedDescription(task.description)
    setEditedStatus(task.status)
    setEditedPriority(task.priority)
  }

  function handleSaveEdit(taskId) {
    const updatedTasks = taskList.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          title: editedTitle,
          description: editedDescription,
          status: editedStatus,
          priority: editedPriority
        }
      }
      return task
    })
    setTaskList(updatedTasks)
    setEditingTaskId(null)
  }

  function handleCancelEdit() {
    setEditingTaskId(null)
  }

  function handleAddTask(event) {
    event.preventDefault()
    if (newTitle.trim() === "") {
      alert("Der Titel ist erforderlich")
      return
    }
    const newTask = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDescription,
      status: newStatus,
      priority: newPriority,
      createdAt: new Date().toISOString()
    }
    setTaskList([...taskList, newTask])
    setNewTitle("")
    setNewDescription("")
    setNewStatus("open")
    setNewPriority("medium")
  }

  const statusLabels = {
    open: "Offen",
    in_progress: "In Bearbeitung",
    done: "Erledigt"
  }
  const priorityLabels = {
    low: "Niedrig",
    medium: "Mittel",
    high: "Hoch"
  }

  const filteredTasks = taskList.filter((task) => {
    const query = searchText.toLowerCase()
    const titleMatches = task.title.toLowerCase().includes(query)
    const descriptionMatches = task.description.toLowerCase().includes(query)
    const statusMatches = statusFilter === "all" || task.status === statusFilter
    const priorityMatches = priorityFilter === "all" || task.priority === priorityFilter
    return (titleMatches || descriptionMatches) && statusMatches && priorityMatches
  })

  return (
    <div className="app-container">
      <h1>Task Board</h1>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Tasks durchsuchen..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Alle Status</option>
          <option value="open">Offen</option>
          <option value="in_progress">In Bearbeitung</option>
          <option value="done">Erledigt</option>
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="all">Alle Prioritäten</option>
          <option value="low">Niedrig</option>
          <option value="medium">Mittel</option>
          <option value="high">Hoch</option>
        </select>
      </div>

      <form className="task-form" onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Task Titel"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Task Beschreibung"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
          <option value="open">Offen</option>
          <option value="in_progress">In Bearbeitung</option>
          <option value="done">Erledigt</option>
        </select>
        <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
          <option value="low">Niedrig</option>
          <option value="medium">Mittel</option>
          <option value="high">Hoch</option>
        </select>
        <button type="submit">Task hinzufügen</button>
      </form>

      <ul className="task-list">
        {filteredTasks.map((task) => (
          <li key={task.id} className="task-card">
            {editingTaskId === task.id ? (
              <div className="edit-form">
                <input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
                <input value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
                <select value={editedStatus} onChange={(e) => setEditedStatus(e.target.value)}>
                  <option value="open">Offen</option>
                  <option value="in_progress">In Bearbeitung</option>
                  <option value="done">Erledigt</option>
                </select>
                <select value={editedPriority} onChange={(e) => setEditedPriority(e.target.value)}>
                  <option value="low">Niedrig</option>
                  <option value="medium">Mittel</option>
                  <option value="high">Hoch</option>
                </select>
                <div className="edit-form-actions">
                  <button className="save-btn" onClick={() => handleSaveEdit(task.id)}>Speichern</button>
                  <button className="cancel-btn" onClick={handleCancelEdit}>Abbrechen</button>
                </div>
              </div>
            ) : (
              <>
                <div className="task-title">{task.title}</div>
                {task.description && (
                  <div className="task-description">{task.description}</div>
                )}
                <div className="task-tags">
                  <span className={`badge status-${task.status}`}>{statusLabels[task.status]}</span>
                  <span className={`badge priority-${task.priority}`}>{priorityLabels[task.priority]}</span>
                </div>
                <div className="task-actions">
                  <button onClick={() => handleEdit(task)}>Bearbeiten</button>
                  <button className="delete-btn" onClick={() => handleDelete(task.id)}>Löschen</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
