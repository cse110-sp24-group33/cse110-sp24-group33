document.addEventListener("DOMContentLoaded", function () {
    // Select the modal and various buttons
    const taskModal = document.getElementById("task-modal");
    const newBtn = document.querySelector(".new-task");
    const saveBtn = document.querySelector(".save-task");
    const cancelBtn = document.querySelector(".cancel-task");
    const deleteBtnModal = document.querySelector(".delete-task");
    const taskContainer = document.getElementById("task-container");
    const prevDayBtn = document.querySelector("#date button:first-child");
    const nextDayBtn = document.querySelector("#date button:last-child");
    const dateDisplay = document.querySelector("#date h2");

    // Function to get the current date in "Month Day, Year" format
    function getCurrentDate() {
        const today = new Date();
        return today.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }

    // Function to change the date and update tasks
    function changeDate(offset) {
        const currentDate = new Date(dateDisplay.textContent);
        const newDate = new Date(currentDate.setDate(currentDate.getDate() + offset));
        const newDateString = newDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        dateDisplay.textContent = newDateString;
        localStorage.setItem("currentDate", newDateString);
        displayTasks();
    }

    // Event listeners for the previous and next day buttons
    prevDayBtn.addEventListener("click", function () {
        changeDate(-1);
    });

    nextDayBtn.addEventListener("click", function () {
        changeDate(1);
    });

    // Initialize editingIndex to -1 to indicate no task is being edited
    let editingIndex = -1;

    // Show the modal when the "New Task" button is clicked
    newBtn.onclick = function () {
        editingIndex = -1; // Reset editing index when adding a new task
        taskModal.style.display = "block"; // Show the modal
        clearModalFields(); // Clear any existing data in the modal fields
    }

    // Hide the modal if the user clicks outside of it
    window.onclick = function (event) {
        if (event.target === taskModal) {
            taskModal.style.display = "none";
        }
    }

    // Save the task when the "Save" button is clicked
    saveBtn.onclick = function () {
        // Get task details from modal input fields
        const taskDesc = document.getElementById("task-desc").value;
        const taskType = document.getElementById("task-type").value;
        const taskProject = document.getElementById("task-project").value;

        // Retrieve existing tasks for the current date from local storage or initialize as empty array
        const currentDate = dateDisplay.textContent;
        const entry = JSON.parse(localStorage.getItem(`entry-${currentDate}`)) || { date: currentDate, text_entry: "", tasks: [], sentiment: "" };
        const tasks = entry.tasks || [];

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

        // Update the tasks array in the entry
        entry.tasks = tasks;

        // Save the updated entry to local storage
        localStorage.setItem(`entry-${currentDate}`, JSON.stringify(entry));

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
        const currentDate = dateDisplay.textContent;
        const entry = JSON.parse(localStorage.getItem(`entry-${currentDate}`)) || { date: currentDate, text_entry: "", tasks: [], sentiment: "" };
        const tasks = entry.tasks || [];
        if (editingIndex >= 0) {
            // Remove the task at the editingIndex from the tasks array
            tasks.splice(editingIndex, 1);
            // Update the tasks array in the entry
            entry.tasks = tasks;
            // Save the updated entry to local storage
            localStorage.setItem(`entry-${currentDate}`, JSON.stringify(entry));
            // Refresh the displayed tasks and hide the modal
            displayTasks();
            taskModal.style.display = "none";
        }
    }

    // Function to display tasks from local storage
    function displayTasks() {
        const currentDate = dateDisplay.textContent;
        const entry = JSON.parse(localStorage.getItem(`entry-${currentDate}`)) || { date: currentDate, text_entry: "", tasks: [], sentiment: "" };
        const tasks = entry.tasks || [];
        taskContainer.innerHTML = ""; // Clear the current task display

        tasks.forEach(function (task, index) {
            // Create a new task item element
            const taskElement = document.createElement("div");
            taskElement.className = "task-item";

            // Create the checkbox element
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `task-${index}`;
            checkbox.checked = task.completed;

            // Create the task name label
            const nameLabel = document.createElement("label");
            nameLabel.id = `taskDesc-${index}`;
            nameLabel.textContent = `Task Description: ${task.name}`;

            // Create the task type tag label
            const typeTagLabel = document.createElement("label");
            typeTagLabel.id = `taskTypeTag-${index}`;
            typeTagLabel.textContent = `Type: ${task.type_tag}`;

            // Create the task project tag label
            const projTagLabel = document.createElement("label");
            projTagLabel.id = `taskProjTag-${index}`;
            projTagLabel.textContent = `Project: ${task.project_tag}`;

            // Create the edit button
            const editButton = document.createElement("button");
            editButton.className = "edit-task";
            editButton.textContent = "Edit";
            editButton.setAttribute("data-index", index);

            // Append the elements to the task item
            taskElement.appendChild(checkbox);
            taskElement.appendChild(nameLabel);
            taskElement.appendChild(typeTagLabel);
            taskElement.appendChild(projTagLabel);
            taskElement.appendChild(editButton);

            // Append the task item to the task container
            taskContainer.appendChild(taskElement);

            // Add event listener to the checkbox to update the task's completed status
            checkbox.addEventListener('change', function () {
                tasks[index].completed = this.checked; // Update completed status
                entry.tasks = tasks; // Update the tasks array in the entry
                localStorage.setItem(`entry-${currentDate}`, JSON.stringify(entry)); // Save updated entry to local storage
            });

            // Add event listener to the edit button to edit the task
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

    // Retrieve the last displayed date from local storage or default to the current date
    const storedDate = localStorage.getItem("currentDate") || getCurrentDate();
    dateDisplay.textContent = storedDate;

    // Initial display of tasks when the page loads
    displayTasks();
});