import { isToday, format, isTomorrow, isYesterday } from "date-fns";
import { getMyApp, deleteMyApp } from "./storage.js";
import { initializeOpenDialog, initializeCloseDialog, makeElement } from "./displayhelper.js";

// Initializes dialogs x 6.
// Displays the Projects list.
// Displays the Task list for a project.
// Handles the interface for completion, editing, deleting of projects.
// Handles the interface for completion, editing, deleting of tasks.
// Handles the interface for completion, editing, deleting of subtasks.

export default class Display {
  constructor(myApp) {
    this.myApp = myApp;

    // Set up the Reset button
    this.initializeResetButton();

    // Select the project and task regions of the template.
    this.projectsList = document.querySelector(".projects__list");
    this.tasksList = document.querySelector(".tasks__list");

    // Set up create a project dialog
    this.projectDialog = document.querySelector(".project-dialog");
    this.projectForm = document.querySelector(".project-dialog__form");
    this.initializeProjectDialog();

    // Set up create a task dialog
    this.taskDialog = document.querySelector(".task-dialog");
    this.taskForm = document.querySelector(".task-dialog__form");
    this.initializeTaskDialog();

    // Set up create a subtask dialog
    this.subTaskDialog = document.querySelector(".subtask-dialog");
    this.subTaskForm = document.querySelector(".subtask-dialog__form");
    this.initializeSubTaskDialog();

    // Set up an edit project dialog
    this.editProjectDialog = document.querySelector(".edit-project-dialog");
    this.editProjectForm = document.querySelector(".edit-project-dialog__form");
    this.initializeEditProjectDialog();

    // Set up an edit task dialog
    this.editTaskDialog = document.querySelector(".edit-task-dialog");
    this.editTaskForm = document.querySelector(".edit-task-dialog__form");
    this.initializeEditTaskDialog();

    // Set up an edit subtask dialog
    this.editSubTaskDialog = document.querySelector(".edit-subtask-dialog");
    this.editSubTaskForm = document.querySelector(".edit-subtask-dialog__form");
    this.initializeEditSubTaskDialog();

    // Set up variables to track the current project, task, subtask allowing forms to
    // identify the project / task / subtask to update.
    this.currentProjectId = 1;
    this.currentTaskId = null;
    this.currentSubTaskId = null;
  }

  initializeResetButton() {
    const templateResetButton = document.querySelector(".nav__reset");
    templateResetButton.addEventListener("click", () => {
      deleteMyApp();
      this.myApp = getMyApp();
      this.displayProjects();
      this.displayTasks(1);
    })
  }

  // Dialog initialization

  initializeProjectDialog() {
    // Initialize open and close buttons for the dialog in the template and the form.
    initializeOpenDialog(this.projectDialog, ".projects__new-project-button");
    initializeCloseDialog(this.projectDialog, ".project-dialog__close");
    this.initializeProjectSubmitForm();
  }

  initializeProjectSubmitForm() {
    // When submitted, get the values from the form, reset the form and display the new project.
    this.projectForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const title = document.getElementById("newProjectTitle").value;
      this.myApp.projects.create(title);

      this.projectDialog.close();
      this.projectForm.reset();
      this.displayProjects();
    });
  }

  initializeTaskDialog() {
    initializeOpenDialog(this.taskDialog, ".tasks__new-task-button");
    initializeCloseDialog(this.taskDialog, ".task-dialog__close");
    this.initializeTaskSubmitForm();
  }

  initializeTaskSubmitForm() {
    this.taskForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const title = document.getElementById("newTaskTitle").value;
      const dueDate = document.getElementById("newTaskDueDate").value;
      const newTask = this.myApp.tasks.create(title, this.currentProjectId);
      if (newTask) newTask.update({ dueDate: dueDate });
      this.taskDialog.close();
      this.taskForm.reset();
      this.displayTasks(this.currentProjectId);
    });
  }

  initializeSubTaskDialog() {
    const closeButton = document.querySelector(".subtask-dialog__close");
    closeButton.addEventListener("click", () => {
      this.subTaskDialog.close();
      this.editTask(this.currentTaskId);
    });
    this.initializeSubTaskSubmitForm();
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

  initializeEditProjectDialog() {
    initializeCloseDialog(this.editProjectDialog, ".edit-project-dialog__close");
    this.initializeEditProjectSubmitForm();
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

  initializeEditTaskDialog() {
    initializeCloseDialog(this.editTaskDialog, ".edit-task-dialog__close");
    this.initializeEditTaskSubmitForm();
  }

  initializeEditTaskSubmitForm() {
    this.editTaskForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const title = document.getElementById("editTaskTitle").value;
      const description = document.getElementById("editTaskDescription").value;
      const dueDate = document.getElementById("editTaskDueDate").value;
      const projectId = Number(document.getElementById("editTaskProjectId").value);
      const templateTagCheckboxes = document.querySelectorAll('input[name="tags"]:checked');
      let tags = [];
      templateTagCheckboxes.forEach(checkbox => tags.push(checkbox.value));

      const editedTask = this.myApp.tasks.read(this.currentTaskId).update(
        {
          title: title,
          description: description,
          dueDate: dueDate,
          projectId: projectId,
          tags: tags
        });
      this.editTaskDialog.close();
      this.editTaskForm.reset();
      this.displayTasks(this.currentProjectId);
    })
  }

  initializeEditSubTaskDialog() {
    const closeButton = document.querySelector(".edit-subtask-dialog__close");
    closeButton.addEventListener("click", () => {
      this.editSubTaskDialog.close();
      this.editTask(this.currentTaskId);
    });
    this.initializeEditSubTaskSubmitForm();
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

  // Display the Projects pane

  displayProjects() {
    this.projectsList.innerHTML = "";
    const projects = this.myApp.projects.projectList;
    for (let i in projects) {
      const myDiv = makeElement("div", "projects__project");
      const myButton = makeElement("button", "projects__project__open", projects[i].title, () => this.displayTasks(projects[i].id));
      if (projects[i].completed) myButton.classList.add("completed");
      myDiv.appendChild(myButton);
      this.projectsList.appendChild(myDiv);
    }
  }

  // Display the Tasks pane

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
    const myDiv = makeElement("div", "tasks__project");

    let completeProjectButtonText;

    if (project.id == 1) {
      completeProjectButtonText = ":"
    } else if (project.completed) {
      completeProjectButtonText = ""
    } else completeProjectButtonText = "o";

    const myCompleteProjectButton = makeElement(
      "button",
      "tasks__project__complete",
      completeProjectButtonText,
      () => this.toggleCompleteProject(project.id)
    );
    if (project.completed) {
      myCompleteProjectButton.innerText = "";
      myCompleteProjectButton.classList.add("no-hover");
    }
    myDiv.appendChild(myCompleteProjectButton);

    const myEditProjectButton = makeElement("button", "tasks__project__edit", project.title, () => this.editProject(project));
    if (project.completed) myEditProjectButton.classList.add("completed");
    myDiv.appendChild(myEditProjectButton);

    const myDeleteProjectButton = makeElement(
      "button",
      "tasks__project__delete",
      project.id == 1 ? ":" : "x",
      () => this.deleteProject(project.id)
    );
    myDiv.appendChild(myDeleteProjectButton);

    return myDiv;
  }


  toggleCompleteProject(id) {
    this.myApp.completeProject(id);
    this.displayProjects();
    this.displayTasks(this.currentProjectId);
  }

  editProject(project) {
    if (project.id != 1) {
      document.getElementById("editProjectTitle").value = project.title;
      this.editProjectDialog.showModal();
    }
  }

  deleteProject(id) {
    this.myApp.deleteProject(id);
    this.displayProjects();
    this.currentProjectId = 1;
    this.displayTasks(this.currentProjectId);
  }

  makeTaskDiv(task) {
    const myDiv = makeElement("div", "tasks__task");

    const myCompleteTaskButton = makeElement("button", "tasks__task__complete", "o", () => this.toggleCompleteTask(task.id));
    myDiv.appendChild(myCompleteTaskButton);

    const myEditTaskButton = makeElement("button", "tasks__task__edit", "", () => {
      this.editTask(task.id)
    });
    if (task.completed) myEditTaskButton.classList.add("completed");
    if (task.priority()) myEditTaskButton.classList.add("priority");
    myEditTaskButton.innerHTML = `<span>${task.title}<span>`;
    if (task.dueDate) myEditTaskButton.innerHTML += `<br>${this.formatDate(new Date(task.dueDate))}`;
    if (task.hasSubTasks()) myEditTaskButton.innerHTML += ` | ${task.subTasksComplete()}/${task.subTasksCount()}`;
    myDiv.appendChild(myEditTaskButton);

    if (task.completed) {
      const myDeleteTaskButton = makeElement("button", "tasks__task__delete", "x", () => this.deleteTask(task.id));
      myDiv.appendChild(myDeleteTaskButton);
    }

    return myDiv;
  }

  // Helper functions triggered by clicking buttons in the task display.
  toggleCompleteTask(id) {
    this.myApp.tasks.read(id).toggleComplete();
    this.displayTasks(this.currentProjectId);
  }

  deleteTask(id) {
    this.myApp.tasks.delete(id);
    this.displayTasks(this.currentProjectId);
  }

  // When clicking a task, open a form to change its details and work with subtasks.
  editTask(id) {
    this.currentTaskId = id;
    const task = this.myApp.tasks.read(id);

    // Prefill the form with current task data.
    document.getElementById("editTaskTitle").value = task.title;
    document.getElementById("editTaskDueDate").value = task.dueDate;
    document.getElementById("editTaskDescription").value = task.description;

    // Populate the Project selector with project options.
    this.buildProjectSelect(task);

    // Populate the list of tags from the app.
    this.buildTags();

    // Build the interactive SubTasks section.
    this.buildSubTasks();

    this.editTaskDialog.showModal();
  }

  buildProjectSelect() {
    const templateProjectSelect = document.getElementById("editTaskProjectId");
    templateProjectSelect.innerHTML = "";

    const projectList = this.myApp.projects.projectList;
    for (let i in projectList) {
      if (!projectList[i].completed) {
        const myOption = document.createElement("option");
        myOption.setAttribute("value", projectList[i].id);
        myOption.innerText = (projectList[i].title);
        if (this.myApp.tasks.read(this.currentTaskId).projectId == projectList[i].id) {
          myOption.setAttribute("selected", "selected");
        }
        templateProjectSelect.appendChild(myOption);
      }
    }
  }

  buildTags() {
    const tags = this.myApp.tasks.tagList;
    const templateTags = document.querySelector(".edit-task-dialog__tags");
    templateTags.innerHTML = "";

    for (let i in tags) {
      const myTag = makeElement("div", "edit-task-dialog__tag");

      const myInput = document.createElement("input");
      myInput.setAttribute("type", "checkbox");
      myInput.setAttribute("name", "tags");
      myInput.setAttribute("id", `tags-${i}`);
      myInput.setAttribute("value", tags[i].tag);
      if (this.myApp.tasks.hasTag(this.currentTaskId, tags[i].tag)) myInput.checked = true;
      myTag.appendChild(myInput);

      const myLabel = document.createElement("label");
      myLabel.setAttribute("for", `tags-${i}`);
      myLabel.innerText = tags[i].tag;
      myTag.appendChild(myLabel);

      templateTags.appendChild(myTag);
    }
  }

  buildSubTasks() {
    const templateSubTasks = document.querySelector(".edit-task-dialog__subtasks");
    templateSubTasks.innerHTML = "";

    const task = this.myApp.tasks.read(this.currentTaskId);

    for (let i in task.subTasks) {
      const mySubtask = makeElement("div", "edit-task-dialog__subtask");

      const myCompleteSubTaskButton = makeElement("button", "edit-task-dialog__subtask__complete", "o", () => {
        task.toggleCompleteSubTask(task.subTasks[i].id);
        this.editTask(this.currentTaskId);
      });
      mySubtask.appendChild(myCompleteSubTaskButton);

      const myEditSubTaskButton = makeElement("button", "edit-task-dialog__subtask__edit", task.subTasks[i].title, () => { this.editSubTask(task.id, task.subTasks[i].id) });
      if (task.subTasks[i].completed) myEditSubTaskButton.classList.add("completed");
      mySubtask.appendChild(myEditSubTaskButton)

      if (task.subTasks[i].completed) {
        const myDeleteSubTaskButton = makeElement("button", "edit-task-dialog__subtask__delete", "x", () => {
          task.deleteSubTask(task.subTasks[i].id);
          this.editTask(this.currentTaskId);
        });
        mySubtask.appendChild(myDeleteSubTaskButton);
      }
      templateSubTasks.appendChild(mySubtask);
    }

    const myNewSubTaskButton = makeElement("button", "edit-task-dialog__subtasks__new-task-button", "+", () => { this.subTaskDialog.showModal() });
    myNewSubTaskButton.classList.add("btn");

    templateSubTasks.appendChild(myNewSubTaskButton);
  }


  editSubTask(taskId, subTaskId) {
    this.currentSubTaskId = subTaskId;
    const task = this.myApp.tasks.read(taskId);

    document.getElementById("editSubTaskTitle").value = task.findSubTask(subTaskId).title;
    this.editSubTaskDialog.showModal();
  }

  formatDate(date) {
    let formattedDate;
    if (isToday(date)) { formattedDate = "Today" } else
      if (isTomorrow(date)) { formattedDate = "Tomorrow" } else
        if (isYesterday(date)) { formattedDate = "Yesterday" } else
          formattedDate = format(date, 'MMM d, y');
    return formattedDate;
  }
}