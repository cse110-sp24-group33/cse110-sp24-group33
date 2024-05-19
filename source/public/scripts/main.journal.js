document.addEventListener("DOMContentLoaded", function () {
    // Select the modal and various buttons
    const taskModal = document.getElementById("task-modal");
    const btn = document.querySelector(".new-task");
    const saveBtn = document.querySelector(".save-task");
    const cancelBtn = document.querySelector(".cancel-task");
    const deleteBtnModal = document.querySelector(".delete-task");
    const taskContainer = document.getElementById("task-container");

    // Initialize editingIndex to -1 to indicate no task is being edited
    let editingIndex = -1;

    // Show the modal when the "New Task" button is clicked
    btn.onclick = function () {
      editingIndex = -1; // Reset editing index when adding a new task
      taskModal.style.display = "block"; // Show the modal
      clearModalFields(); // Clear any existing data in the modal fields
    }

    // Hide the modal if the user clicks outside of it
    window.onclick = function (event) {
      if (event.target == modal) {
        taskModal.style.display = "none";
      }
    }

    // Save the task when the "Save" button is clicked
    saveBtn.onclick = function () {
      // Get task details from modal input fields
      const taskDesc = document.getElementById("task-desc").value;
      const taskType = document.getElementById("task-type").value;
      const taskProject = document.getElementById("task-project").value;

      // Retrieve existing tasks from local storage or initialize as empty array
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

      if (editingIndex >= 0) {
        // If editing an existing task, update its details
        tasks[editingIndex] = {
          name: taskDesc,
          type_tag: taskType,
          project_tag: taskProject,
          completed: tasks[editingIndex].completed // Preserve the completed status
        };
      } else {
        // If adding a new task, create a new task object and add to the tasks array
        const task = {
          name: taskDesc,
          type_tag: taskType,
          project_tag: taskProject,
          completed: false // New tasks are not completed by default
        };
        tasks.push(task);
      }

      // Save the updated tasks array to local storage
      localStorage.setItem("tasks", JSON.stringify(tasks));

      // Refresh the displayed tasks and hide the modal
      displayTasks();
      taskModal.style.display = "none";
    }

    // Hide the modal when the "Cancel" button is clicked
    cancelBtn.onclick = function () {
        taskModal.style.display = "none";
    }

    // Delete the current task when the "Delete" button in the modal is clicked
    deleteBtnModal.onclick = function () {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      if (editingIndex >= 0) {
        // Remove the task at the editingIndex from the tasks array
        tasks.splice(editingIndex, 1);
        // Save the updated tasks array to local storage
        localStorage.setItem("tasks", JSON.stringify(tasks));
        // Refresh the displayed tasks and hide the modal
        displayTasks();
        taskModal.style.display = "none";
      }
    }

    // Function to display tasks from local storage
    function displayTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      taskContainer.innerHTML = ""; // Clear the current task display
      tasks.forEach(function (task, index) {
        // Create a new task item element
        const taskElement = document.createElement("div");
        taskElement.className = "task-item";
        taskElement.innerHTML = `
          <label for="task-${index}">Task ${index + 1}: ${task.name}, Type: ${task.type_tag}, Project: ${task.project_tag}</label>
          <button class="edit-task" data-index="${index}">Edit</button>
        `;
        taskContainer.appendChild(taskElement); // Append the new task item to the container

        // Add event listener to the edit button to edit the task
        const editButton = taskElement.querySelector(".edit-task");
        editButton.addEventListener('click', function () {
          editingIndex = parseInt(this.getAttribute('data-index')); // Set editing index to the task's index
          const task = tasks[editingIndex]; // Retrieve task details
          document.getElementById("task-desc").value = task.name;
          document.getElementById("task-type").value = task.type_tag;
          document.getElementById("task-project").value = task.project_tag;
          taskModal.style.display = "block"; // Show the modal for editing
        });
      });
    }

    // Function to clear the input fields in the modal
    function clearModalFields() {
      document.getElementById("task-desc").value = "";
      document.getElementById("task-type").value = "type-tag1";
      document.getElementById("task-project").value = "project-tag1";
    }

    // Initial display of tasks when the page loads
    displayTasks();
});
