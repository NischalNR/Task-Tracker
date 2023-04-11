import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App({ onDelete }) {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showTaskEdit, setShowTaskEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleClick = (_id) => {
    setShowTaskEdit(true);
    setTaskName(tasks[_id].taskName);
    setStartDate(tasks[_id].startDate);
    setEndDate(tasks[_id].endDate);
    setPriority(tasks[_id].priority);
  };

  const showToastAddMessage = () => {
    toast.success("Task add Successfully", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const showToastEditMessage = () => {
    toast.success("Task Edit Successfully", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const getStatus = (startDate, endDate) => {
    const currentDate = new Date();
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);

    if (currentDate < sDate) {
      return "Not yet";
    } else if (currentDate >= sDate && currentDate <= eDate) {
      return "In progress";
    } else {
      return "Completed";
    }
  };

  function handleTaskNameChange(event) {
    setTaskName(event.target.value);
    //console.log(taskName);
  }

  function handleStartDateChange(event) {
    setStartDate(event.target.value);
    //console.log(startDate);
  }

  function handleEndDateChange(event) {
    setEndDate(event.target.value);
    //console.log(endDate);
  }

  function handlePriorityChange(event) {
    setPriority(event.target.value);
    //console.log(priority);
  }

  let handleUpdate = async (e) => {
    e.preventDefault();
    let payload = { taskName };
    await axios.put(`http://localhost:5000/tasks/`, payload);
  };

  const handleDelete = (taskId) => {
    axios.delete(`http://localhost:5000/tasks/${taskId}`).then(() => {
      setTasks(tasks.filter((task) => task._id !== taskId));
    });
  };

  function handleSubmit(event) {
    event.preventDefault();
    if (taskName.trim() === "") {
      return;
    }
    const taskData = {
      taskName: taskName,
      startDate: startDate,
      endDate: endDate,
      priority: priority,
    };
    axios
      .post("http://localhost:5000/tasks", taskData)
      .then((response) => {
        console.log("Task added:", response.data);
        setTasks([...tasks, response.data]);
        setTaskName("");
        setStartDate("");
        setEndDate("");
        setPriority("");
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
    console.log(taskData);
    window.location.assign("#");
  }

  useEffect(() => {
    const getTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error(err.message);
      }
    };

    getTasks();
  }, []);

  const PerPage = 10;
  const indexOfLastRecord = currentPage * PerPage;
  const indexOfFirstRecord = indexOfLastRecord - PerPage;
  const currentTasks = tasks.slice(indexOfFirstRecord, indexOfLastRecord);

  const handlePrevClick = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextClick = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleSearch = (event) => {
    const filteredTasks = tasks.filter(
      (task) =>
        task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.priority.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setTasks(filteredTasks);
  };

  return (
    <>
      <h1 id="heading">TASK TRACER</h1>
      <form onSubmit={handleSubmit}>
        <div className="firstdiv">
          <label className="label">
            Task Name :
            <input
              placeholder="Task Name"
              className="felid"
              type="text"
              value={taskName}
              onChange={handleTaskNameChange}
            />
          </label>
          <label className="label">
            Priority :
            <select
              className="priority"
              value={priority}
              onChange={handlePriorityChange}
            >
              <option value="">Select Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>
        <br />
        <div className="seconddiv">
          <label className="label2">
            Start Date :
            <input
              className="felid"
              type="datetime-local"
              value={startDate}
              onChange={handleStartDateChange}
            />
          </label>
          <label className="label2">
            End Date :
            <input
              className="felid"
              type="datetime-local"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </label>
        </div>
        <br />
        <br />
        <div className="add">
          <button
            className="addbutton"
            type="submit"
            onClick={showToastAddMessage}
          >
            <b>Add task</b>
          </button>
          <button
            className="updatebutton"
            type="submit"
            onClick={showToastEditMessage}
            onChange={handleUpdate}
          >
            <b>Update task</b>
          </button>
          <ToastContainer />
        </div>
        <br />
        <div className="searchbox">
          <label>
            Search :
            <input
              className="felid"
              type="text"
              placeholder="Search tasks"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
          <button className="filter" onClick={handleSearch}>
            <b>Filter</b>
          </button>
        </div>
      </form>
      <div className="table">
        <table className="lookup">
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Task Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.map((task, index) => (
              <tr key={task._id}>
                <td>{index + 1} </td>
                <td>{task.taskName}</td>
                <td>{task.startDate}</td>
                <td>{task.endDate}</td>
                <td>{task.priority}</td>
                <td>
                  <p> {getStatus(task.startDate, task.endDate)}</p>
                </td>
                <td>
                  {getStatus(task.startDate, task.endDate) === "Not yet" && (
                    <div className="action">
                      <button
                        className="editbutton"
                        onClick={() => {
                          handleClick(index);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="deletebutton"
                        onClick={() => {
                          let result = prompt(
                            `Are you sure you want to delete the ${task.taskName}?`
                          );
                          if (result === "yes") {
                            handleDelete(task._id);
                            toast.error("Task Delete Successfully");
                          } else {
                            window.alert("OK thank you Resume!");
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  {getStatus(task.startDate, task.endDate) ===
                    "In progress" && (
                    <div>
                      <button
                        className="deletebutton"
                        onClick={() => {
                          let result = prompt(
                            `Are you sure you want to delete the ${task.taskName}?`
                          );
                          if (result === "yes") {
                            handleDelete(task._id);
                            toast.error("DELETED");
                          } else {
                            window.alert("OK thank you Resume!");
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  {getStatus(task.startDate, task.endDate) === "Completed" && (
                    <div></div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div />
        <div className="pagebuttons">
          <button
            className="prevbutton"
            onClick={handlePrevClick}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <button
            className="nextbutton"
            onClick={handleNextClick}
            disabled={indexOfLastRecord >= tasks.length}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
