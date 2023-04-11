const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/task-manager", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
  slNo: Number,
  taskName: String,
  startDate: String,
  endDate: String,
  priority: String,
});

const Task = mongoose.model("Task", taskSchema);

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.json(newTask);
});

app.put("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const updatedTask = req.body;
  await Task.findByIdAndUpdate(taskId, updatedTask);
  res.json(updatedTask);
});

app.delete("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  await Task.findByIdAndDelete(taskId);
  res.json({ message: `Task ${taskId} deleted` });
});

app.get("/tasks/:taskId/status", (req, res) => {
  const { taskId } = req.params;
  const task = getTaskById(taskId);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  app.get("/tasks", (req, res) => {
    const searchTerm = req.query.searchTerm.toLowerCase();
    const searchFilter = req.query.searchFilter.toLowerCase();
    const filteredTasks = tasks.filter((task) =>
      task[searchFilter].toLowerCase().includes(searchTerm)
    );
    res.json(filteredTasks);
  });
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
