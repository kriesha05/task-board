import tasks from "./data/tasks.json"
import { useState } from 'react'
import './App.css'

function App() {

  const [allTasks, setAllTasks] = useState(tasks)
  const [searchQueryText, setSearchQueryText] = useState("")
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all")
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState("all")
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [newTaskStatus, setNewTaskStatus] = useState("open")
  const [newTaskPriority, setNewTaskPriority] = useState("medium")
  const [currentlyEditingTaskId, setCurrentlyEditingTaskId] = useState(null)
  const [editedTaskTitle, setEditedTaskTitle] = useState("")
  const [editedTaskDescription, setEditedTaskDescription] = useState("")
  const [editedTaskStatus, setEditedTaskStatus] = useState("open")
  const [editedTaskPriority, setEditedTaskPriority] = useState("medium")

  function handleDeleteTask(taskId) {
    const remainingTasks = allTasks.filter((task) => task.id !== taskId)
    setAllTasks(remainingTasks)
  }

  function handleStartEditingTask(task) {
    setCurrentlyEditingTaskId(task.id)
    setEditedTaskTitle(task.title)
    setEditedTaskDescription(task.description)
    setEditedTaskStatus(task.status)
    setEditedTaskPriority(task.priority)
  }

  function handleSaveEditedTask(taskId) {
    const updatedTaskList = allTasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          title: editedTaskTitle,
          description: editedTaskDescription,
          status: editedTaskStatus,
          priority: editedTaskPriority
        }
      }
      return task
    })
    setAllTasks(updatedTaskList)
    setCurrentlyEditingTaskId(null)
  }

  function handleCancelEditingTask() {
    setCurrentlyEditingTaskId(null)
  }

  function handleAddNewTask(event) {
    event.preventDefault()
    if (newTaskTitle.trim() === "") {
      alert("Der Titel ist erforderlich")
      return
    }
    const newTaskObject = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      status: newTaskStatus,
      priority: newTaskPriority,
      createdAt: new Date().toISOString()
    }
    setAllTasks([...allTasks, newTaskObject])
    setNewTaskTitle("")
    setNewTaskDescription("")
    setNewTaskStatus("open")
    setNewTaskPriority("medium")
  }

  const statusDisplayLabels = {
    open: "Offen",
    in_progress: "In Bearbeitung",
    done: "Erledigt"
  }
  const priorityDisplayLabels = {
    low: "Niedrig",
    medium: "Mittel",
    high: "Hoch"
  }

  const filteredTaskList = allTasks.filter((task) => {
    const lowercaseSearchQuery = searchQueryText.toLowerCase()
    const titleMatchesSearch = task.title.toLowerCase().includes(lowercaseSearchQuery)
    const descriptionMatchesSearch = task.description.toLowerCase().includes(lowercaseSearchQuery)
    const matchesSelectedStatus = selectedStatusFilter === "all" || task.status === selectedStatusFilter
    const matchesSelectedPriority = selectedPriorityFilter === "all" || task.priority === selectedPriorityFilter
    return (titleMatchesSearch || descriptionMatchesSearch) && matchesSelectedStatus && matchesSelectedPriority
  })

  return (
    <div className="app-container">
      <h1>Task Board</h1>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Tasks durchsuchen..."
          value={searchQueryText}
          onChange={(e) => setSearchQueryText(e.target.value)}
        />
        <select value={selectedStatusFilter} onChange={(e) => setSelectedStatusFilter(e.target.value)}>
          <option value="all">Alle Status</option>
          <option value="open">Offen</option>
          <option value="in_progress">In Bearbeitung</option>
          <option value="done">Erledigt</option>
        </select>
        <select value={selectedPriorityFilter} onChange={(e) => setSelectedPriorityFilter(e.target.value)}>
          <option value="all">Alle Prioritäten</option>
          <option value="low">Niedrig</option>
          <option value="medium">Mittel</option>
          <option value="high">Hoch</option>
        </select>
      </div>

      <form className="task-form" onSubmit={handleAddNewTask}>
        <input
          type="text"
          placeholder="Task Titel"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Task Beschreibung"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />
        <select value={newTaskStatus} onChange={(e) => setNewTaskStatus(e.target.value)}>
          <option value="open">Offen</option>
          <option value="in_progress">In Bearbeitung</option>
          <option value="done">Erledigt</option>
        </select>
        <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)}>
          <option value="low">Niedrig</option>
          <option value="medium">Mittel</option>
          <option value="high">Hoch</option>
        </select>
        <button type="submit">Task hinzufügen</button>
      </form>

      <ul className="task-list">
        {filteredTaskList.map((task) => (
          <li key={task.id} className="task-card">
            {currentlyEditingTaskId === task.id ? (
              <div className="edit-form">
                <input value={editedTaskTitle} onChange={(e) => setEditedTaskTitle(e.target.value)} />
                <input value={editedTaskDescription} onChange={(e) => setEditedTaskDescription(e.target.value)} />
                <select value={editedTaskStatus} onChange={(e) => setEditedTaskStatus(e.target.value)}>
                  <option value="open">Offen</option>
                  <option value="in_progress">In Bearbeitung</option>
                  <option value="done">Erledigt</option>
                </select>
                <select value={editedTaskPriority} onChange={(e) => setEditedTaskPriority(e.target.value)}>
                  <option value="low">Niedrig</option>
                  <option value="medium">Mittel</option>
                  <option value="high">Hoch</option>
                </select>
                <div className="edit-form-actions">
                  <button className="save-btn" onClick={() => handleSaveEditedTask(task.id)}>Speichern</button>
                  <button className="cancel-btn" onClick={handleCancelEditingTask}>Abbrechen</button>
                </div>
              </div>
            ) : (
              <>
                <div className="task-title">{task.title}</div>
                {task.description && (
                  <div className="task-description">{task.description}</div>
                )}
                <div className="task-tags">
                  <span className={`badge status-${task.status}`}>{statusDisplayLabels[task.status]}</span>
                  <span className={`badge priority-${task.priority}`}>{priorityDisplayLabels[task.priority]}</span>
                </div>
                <div className="task-actions">
                  <button onClick={() => handleStartEditingTask(task)}>Bearbeiten</button>
                  <button className="delete-btn" onClick={() => handleDeleteTask(task.id)}>Löschen</button>
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
