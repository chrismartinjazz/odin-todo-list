import { formatDistance, subDays } from "date-fns";

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

    this.subTaskDialog = document.querySelector(".subtask-dialog");
    this.subTaskForm = document.querySelector(".subtask-dialog__form");
    this.initializeSubTaskDialog();

    this.editProjectDialog = document.querySelector(".edit-project-dialog");
    this.editProjectForm = document.querySelector(".edit-project-dialog__form");
    this.initializeEditProjectDialog();

    this.editTaskDialog = document.querySelector(".edit-task-dialog");
    this.editTaskForm = document.querySelector(".edit-task-dialog__form");
    this.initializeEditTaskDialog();

    this.editSubTaskDialog = document.querySelector(".edit-subtask-dialog");
    this.editSubTaskForm = document.querySelector(".edit-subtask-dialog__form");
    this.initializeEditSubTaskDialog();

    this.currentProjectId = 1;
    this.currentTaskId = null;
    this.currentSubTaskId = null;
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
    document.getElementById("editTaskDueDate").value = task.dueDate;
    const subTasks = document.querySelector(".edit-task-dialog__subtasks");
    subTasks.innerHTML = "";

    const myDiv = document.createElement("div");
    myDiv.classList.add("edit-task-dialog__subtask")
    for (let i in task.subTasks) {
      const mySubtask = document.createElement("div");

      const myCompleteSubTaskButton = document.createElement("button");
      myCompleteSubTaskButton.classList.add("edit-task-dialog__subtask__complete")
      myCompleteSubTaskButton.innerText = "o";
      myCompleteSubTaskButton.addEventListener("click", () => {
        task.toggleCompleteSubTask(task.subTasks[i].id);
        this.editTask(id);
      });
      mySubtask.appendChild(myCompleteSubTaskButton);

      const myEditSubTaskButton = document.createElement("button")
      myEditSubTaskButton.classList.add("edit-task-dialog__subtask__edit")
      if (task.subTasks[i].completed) myEditSubTaskButton.classList.add("completed");
      myEditSubTaskButton.innerText = task.subTasks[i].title;
      myEditSubTaskButton.addEventListener("click", () => {
        this.editSubTask(task.id, task.subTasks[i].id);
      });
      mySubtask.appendChild(myEditSubTaskButton)

      if (task.subTasks[i].completed) {
        const myDeleteSubTaskButton = document.createElement("button");
        myDeleteSubTaskButton.classList.add("edit-task-dialog__subtask__delete")
        myDeleteSubTaskButton.innerText = "x";
        myDeleteSubTaskButton.addEventListener("click", () => {
          task.deleteSubTask(task.subTasks[i].id);
          this.editTask(id);
        });
        mySubtask.appendChild(myDeleteSubTaskButton);
      }

      myDiv.appendChild(mySubtask);
    }

    const myNewSubTaskButton = document.createElement("button");
    myNewSubTaskButton.classList.add("btn", "subtasks__new_task_button");
    myNewSubTaskButton.innerText = "+";
    myNewSubTaskButton.addEventListener("click", () => {
      this.subTaskDialog.showModal();
    })
    myDiv.appendChild(myNewSubTaskButton);

    subTasks.appendChild(myDiv);
    this.editTaskDialog.showModal();
  }

  editSubTask(taskId, subTaskId) {
    this.currentSubTaskId = subTaskId;
    const task = this.myApp.tasks.read(taskId);

    document.getElementById("editSubTaskTitle").value = task.findSubTask(subTaskId).title;
    this.editSubTaskDialog.showModal();
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
  initializeSubTaskDialog() {
    this.initializeCloseDialog(this.subTaskDialog, ".subtask-dialog__close");
    this.initializeSubTaskSubmitForm();
  }

  initializeEditProjectDialog() {
    this.initializeCloseDialog(this.editProjectDialog, ".edit-project-dialog__close");
    this.initializeEditProjectSubmitForm();
  }

  initializeEditTaskDialog() {
    this.initializeCloseDialog(this.editTaskDialog, ".edit-task-dialog__close");
    this.initializeEditTaskSubmitForm();
  }

  initializeEditSubTaskDialog() {
    this.initializeCloseDialog(this.editSubTaskDialog, ".edit-subtask-dialog__close");
    this.initializeEditSubTaskSubmitForm();
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
      const dueDate = document.getElementById("newTaskDueDate").value;
      const newTask = this.myApp.tasks.create(title, this.currentProjectId);
      newTask.update({ dueDate: dueDate });
      console.log(dueDate);
      console.log(newTask);
      this.taskDialog.close();
      this.taskForm.reset();
      this.displayTasks(this.currentProjectId);
    });
  }

  initializeSubTaskSubmitForm() {
    this.subTaskForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const title = document.getElementById("newSubTaskTitle").value;
      this.myApp.tasks.read(this.currentTaskId).createSubTask(title);
      this.subTaskDialog.close();
      this.subTaskForm.reset();
      this.editTask(this.currentTaskId);
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
      const dueDate = document.getElementById("editTaskDueDate").value;
      const editedTask = this.myApp.tasks.read(this.currentTaskId).update({ title: title, dueDate: dueDate })
      this.editTaskDialog.close();
      this.editTaskForm.reset();
      this.displayTasks(this.currentProjectId);
    })
  }

  initializeEditSubTaskSubmitForm() {
    this.editSubTaskForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const title = document.getElementById("editSubTaskTitle").value;
      this.myApp.tasks.read(this.currentTaskId).updateSubTask(this.currentSubTaskId, title);
      this.editSubTaskDialog.close();
      this.editSubTaskForm.reset();
      this.editTask(this.currentTaskId);
    })
  }
}

