export default class Display {
  constructor(myApp) {
    this.myApp = myApp;

    this.projectsList = document.querySelector(".projects__list");
    this.projectDialog = document.querySelector(".project-dialog");
    this.projectForm = document.querySelector(".project-dialog__form");

    this.tasksList = document.querySelector(".tasks__list");
    this.taskDialog = document.querySelector(".task-dialog");
    this.taskForm = document.querySelector(".task-dialog__form");

    this.editTaskDialog = document.querySelector(".edit-task-dialog");
    this.editTaskForm = document.querySelector(".edit-task-dialog__form");

    this.initializeProjectDialog();
    this.initializeTaskDialog();
    this.initializeEditTaskDialog();

    this.currentProjectId = 1;
    this.currentTaskId = null;
  }

  displayProjects() {
    this.projectsList.innerHTML = "";
    const projects = this.myApp.projects.projectList;
    for (let i in projects) {
      const myButton = document.createElement("button");
      myButton.innerText = projects[i].title;
      myButton.addEventListener("click", () => {
        this.displayTasks(projects[i].id)
      });

      this.projectsList.appendChild(myButton);
    }
  }

  displayTasks(projectId) {
    this.tasksList.innerHTML = "";

    // Add the project title as a heading.
    const myHeading = document.createElement("h3");
    myHeading.innerText = this.myApp.projects.read(projectId).title;
    this.tasksList.appendChild(myHeading);

    // Add each task as a button. Add event so click on button to edit task.
    // TODO - add a button on the left to tick the task off, and a button on the right to delete the task.
    const tasks = this.myApp.tasks.tasksInProject(projectId);
    for (let i in tasks) {
      const myDiv = document.createElement("div");
      myDiv.classList.add("tasks__task");
      if (tasks[i].completed) myDiv.classList.add("completed");

      const myCompleteTaskButton = document.createElement("button");
      myCompleteTaskButton.innerText = "o";
      myCompleteTaskButton.addEventListener("click", () => {
        this.toggleCompleteTask(tasks[i].id);
      });

      const myEditTaskButton = document.createElement("button");
      myEditTaskButton.innerText = tasks[i].title;
      myEditTaskButton.addEventListener("click", () => {
        this.editTask(tasks[i].id);
      });

      const myDeleteTaskButton = document.createElement("button");
      myDeleteTaskButton.innerText = "x";
      myDeleteTaskButton.addEventListener("click", () => {
        this.deleteTask(tasks[i].id);
      });


      myDiv.appendChild(myCompleteTaskButton);
      myDiv.appendChild(myEditTaskButton);
      myDiv.appendChild(myDeleteTaskButton);
      this.tasksList.appendChild(myDiv);
    }

    // Update the current projectId.
    this.currentProjectId = projectId;
  }

  editTask(id) {
    this.currentTaskId = id;
    const task = this.myApp.tasks.read(id);

    document.getElementById("editTaskTitle").value = task.title;
    this.editTaskDialog.showModal();
  }

  toggleCompleteTask(id) {
    this.myApp.tasks.read(id).toggleComplete();
    this.displayTasks(this.currentProjectId);
  }

  deleteTask(id) {
    this.myApp.tasks.delete(id);
    this.displayTasks(this.currentProjectId);
  }

  initializeProjectDialog() {
    this.initializeOpenDialog(this.projectDialog, ".projects__new-project-button");
    this.initializeCloseDialog(this.projectDialog, ".project-dialog__close");
    this.initializeProjectSubmitForm();
  }

  initializeTaskDialog() {
    this.initializeOpenDialog(this.taskDialog, ".tasks__new-task-button");
    this.initializeCloseDialog(this.taskDialog, ".task-dialog__close");
    this.initializeTaskSubmitForm();
  }

  initializeEditTaskDialog() {
    this.initializeCloseDialog(this.editTaskDialog, ".edit-task-dialog__close");
    this.initializeEditTaskSubmitForm();
  }

  initializeOpenDialog(dialog, openButtonSelector) {
    const openButton = document.querySelector(openButtonSelector);
    openButton.addEventListener("click", () => {
      dialog.showModal();
    });
  }

  initializeCloseDialog(dialog, closeButtonSelector) {
    const closeButton = document.querySelector(closeButtonSelector);
    closeButton.addEventListener("click", () => {
      dialog.close();
    });
  }

  initializeProjectSubmitForm() {
    this.projectForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const title = document.getElementById("newProjectTitle").value;
      const newProject = this.myApp.projects.create(title);
      this.projectDialog.close();
      this.projectForm.reset();
      this.displayProjects();
    });
  }

  initializeTaskSubmitForm() {
    this.taskForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const title = document.getElementById("newTaskTitle").value;
      const newTask = this.myApp.tasks.create(title, this.currentProjectId);
      this.taskDialog.close();
      this.taskForm.reset();
      this.displayTasks(this.currentProjectId);
    });
  }

  initializeEditTaskSubmitForm() {
    this.editTaskForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const title = document.getElementById("editTaskTitle").value;
      const editedTask = this.myApp.tasks.read(this.currentTaskId).update({ title: title })
      this.editTaskDialog.close();
      this.editTaskForm.reset();
      this.displayTasks(this.currentProjectId);
    })
  }
}

