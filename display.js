export default class Display {
  constructor(myApp) {
    this.myApp = myApp;

    this.projectsList = document.querySelector(".projects__list");
    this.projectDialog = document.querySelector(".project-dialog");
    this.projectForm = document.querySelector(".project-dialog__form");
    this.initializeProjectDialog();

    this.tasksList = document.querySelector(".tasks__list");
    this.taskDialog = document.querySelector(".task-dialog");
    this.taskForm = document.querySelector(".task-dialog__form");
    this.initializeTaskDialog();

    this.editProjectDialog = document.querySelector(".edit-project-dialog");
    this.editProjectForm = document.querySelector(".edit-project-dialog__form");
    this.initializeEditProjectDialog();

    this.editTaskDialog = document.querySelector(".edit-task-dialog");
    this.editTaskForm = document.querySelector(".edit-task-dialog__form");
    this.initializeEditTaskDialog();



    this.currentProjectId = 1;
    this.currentTaskId = null;
  }

  displayProjects() {
    this.projectsList.innerHTML = "";
    const projects = this.myApp.projects.projectList;
    for (let i in projects) {
      const myDiv = document.createElement("div");
      myDiv.classList.add("projects__project");

      const myButton = document.createElement("button");
      myButton.classList.add("projects__project__open");
      if (projects[i].completed) myButton.classList.add("completed");
      myButton.innerText = projects[i].title;
      myButton.addEventListener("click", () => {
        this.displayTasks(projects[i].id)
      });

      myDiv.appendChild(myButton);
      this.projectsList.appendChild(myDiv);

    }
  }

  displayTasks(projectId) {
    this.tasksList.innerHTML = "";
    const project = this.myApp.projects.read(projectId);
    const tasks = this.myApp.tasks.tasksInProject(projectId);

    // Add the project as a heading.
    const myProjectDiv = this.makeProjectDiv(project);
    this.tasksList.appendChild(myProjectDiv);

    // Add each task as a button.
    for (let i in tasks) {
      const myTaskDiv = this.makeTaskDiv(tasks[i]);
      this.tasksList.appendChild(myTaskDiv);
    }

    // Update the current projectId.
    this.currentProjectId = projectId;
  }

  makeProjectDiv(project) {
    const myDiv = document.createElement("div");
    myDiv.classList.add("tasks__project");

    const myCompleteProjectButton = document.createElement("button");
    myCompleteProjectButton.classList.add("tasks__project__complete")
    myCompleteProjectButton.innerText = "o";
    myCompleteProjectButton.addEventListener("click", () => {
      this.toggleCompleteProject(project.id);
    });
    myDiv.appendChild(myCompleteProjectButton);

    const myEditProjectButton = document.createElement("button");
    myEditProjectButton.classList.add("tasks__project__edit")
    if (project.completed) myEditProjectButton.classList.add("completed");
    myEditProjectButton.innerText = project.title;
    myEditProjectButton.addEventListener("click", () => {
      this.editProject(project);
    })
    myDiv.appendChild(myEditProjectButton);

    const myDeleteProjectButton = document.createElement("button");
    myDeleteProjectButton.classList.add("tasks__project__delete");
    myDeleteProjectButton.innerText = "x";
    myDeleteProjectButton.addEventListener("click", () => {
      this.deleteProject(project.id);
    })
    myDiv.appendChild(myDeleteProjectButton);

    return myDiv;
  }

  toggleCompleteProject(id) {
    this.myApp.projects.toggleComplete(id);
    this.displayProjects();
    this.displayTasks(this.currentProjectId);
  }

  editProject(project) {
    document.getElementById("editProjectTitle").value = project.title;
    this.editProjectDialog.showModal();
  }

  deleteProject(id) {
    this.myApp.deleteProject(id);
    this.displayProjects();
    this.currentProjectId = 1;
    this.displayTasks(this.currentProjectId);
  }

  makeTaskDiv(task) {
    const myDiv = document.createElement("div");
    myDiv.classList.add("tasks__task");

    const myCompleteTaskButton = document.createElement("button");
    myCompleteTaskButton.classList.add("tasks__task__complete")
    myCompleteTaskButton.innerText = "o";
    myCompleteTaskButton.addEventListener("click", () => {
      this.toggleCompleteTask(task.id);
    });
    myDiv.appendChild(myCompleteTaskButton);

    const myEditTaskButton = document.createElement("button");
    myEditTaskButton.classList.add("tasks__task__edit")
    if (task.completed) myEditTaskButton.classList.add("completed");
    myEditTaskButton.innerText = task.title;
    myEditTaskButton.addEventListener("click", () => {
      this.editTask(task.id);
    });
    myDiv.appendChild(myEditTaskButton);

    if (task.completed) {
      const myDeleteTaskButton = document.createElement("button");
      myDeleteTaskButton.classList.add("tasks__task__delete")
      myDeleteTaskButton.innerText = "x";
      myDeleteTaskButton.addEventListener("click", () => {
        this.deleteTask(task.id);
      });
      myDiv.appendChild(myDeleteTaskButton);
    }

    return myDiv;
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

  initializeEditProjectDialog() {
    this.initializeCloseDialog(this.editProjectDialog, ".edit-project-dialog__close");
    this.initializeEditProjectSubmitForm();
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

  initializeEditProjectSubmitForm() {
    this.editProjectForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const title = document.getElementById("editProjectTitle").value;
      const editedProject = this.myApp.projects.update(this.currentProjectId, title);
      this.editProjectDialog.close();
      this.editProjectForm.reset();
      this.displayProjects();
      this.displayTasks(this.currentProjectId);
    })
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

