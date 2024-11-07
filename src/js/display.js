import { isToday, format, isTomorrow, isYesterday } from "date-fns";

// Initializes dialogs x 6.
// Displays the Projects list.
// Displays the Task list for a project.
// Handles the interface for completion, editing, deleting of projects.
// Handles the interface for completion, editing, deleting of tasks.
// Handles the interface for completion, editing, deleting of subtasks.

export default class Display {
  constructor(myApp) {
    this.myApp = myApp;

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

  // Helper functions for dialog initialization.
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

  initializeProjectDialog() {
    // Initialize open and close buttons for the dialog in the template and the form.
    this.initializeOpenDialog(this.projectDialog, ".projects__new-project-button");
    this.initializeCloseDialog(this.projectDialog, ".project-dialog__close");
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
    this.initializeOpenDialog(this.taskDialog, ".tasks__new-task-button");
    this.initializeCloseDialog(this.taskDialog, ".task-dialog__close");
    this.initializeTaskSubmitForm();
  }

  initializeTaskSubmitForm() {
    this.taskForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const title = document.getElementById("newTaskTitle").value;
      const dueDate = document.getElementById("newTaskDueDate").value;
      const newTask = this.myApp.tasks.create(title, this.currentProjectId);
      newTask.update({ dueDate: dueDate });
      this.taskDialog.close();
      this.taskForm.reset();
      this.displayTasks(this.currentProjectId);
    });
  }

  initializeSubTaskDialog() {
    this.initializeCloseDialog(this.subTaskDialog, ".subtask-dialog__close");
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
    this.initializeCloseDialog(this.editProjectDialog, ".edit-project-dialog__close");
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
    this.initializeCloseDialog(this.editTaskDialog, ".edit-task-dialog__close");
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
    this.initializeCloseDialog(this.editSubTaskDialog, ".edit-subtask-dialog__close");
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
  // ========================================================================

  makeElement(htmlTag = "div", cssClass, text, onClickFunction) {
    const myElement = document.createElement(htmlTag);
    if (cssClass) myElement.classList.add(cssClass);
    if (text) myElement.innerText = text;
    if (onClickFunction) {
      myElement.addEventListener("click", onClickFunction);
    };
    return myElement;
  }

  displayProjects() {
    this.projectsList.innerHTML = "";
    const projects = this.myApp.projects.projectList;
    for (let i in projects) {
      const myDiv = this.makeElement("div", "projects__project");
      const myButton = this.makeElement("button", "projects__project__open", projects[i].title, () => this.displayTasks(projects[i].id));
      myDiv.appendChild(myButton);
      this.projectsList.appendChild(myDiv);
    }
  }

  // ========================================================================

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

    const myCompleteProjectButton = this.makeElement("button", "tasks__project__complete", "o", () => this.toggleCompleteProject(project.id));
    myDiv.appendChild(myCompleteProjectButton);

    const myEditProjectButton = this.makeElement("button", "tasks__project__edit", project.title, () => this.editProject(project));
    if (project.completed) myEditProjectButton.classList.add("completed");
    myDiv.appendChild(myEditProjectButton);

    const myDeleteProjectButton = this.makeElement("button", "tasks__project__delete", "x", () => this.deleteProject(project.id));
    myDiv.appendChild(myDeleteProjectButton);

    return myDiv;
  }


  toggleCompleteProject(id) {
    this.myApp.completeProject(id);
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

    const myCompleteTaskButton = this.makeElement("button", "tasks__task__complete", "o", () => this.toggleCompleteTask(task.id));
    myDiv.appendChild(myCompleteTaskButton);

    const myEditTaskButton = this.makeElement("button", "tasks__task__edit", "", () => this.editTask(task.id));
    if (task.completed) myEditTaskButton.classList.add("completed");
    myEditTaskButton.innerHTML = `<span>${task.title}<span>`;
    if (task.dueDate) myEditTaskButton.innerHTML += `<br>${this.formatDate(new Date(task.dueDate))}`;
    if (task.hasSubTasks()) myEditTaskButton.innerHTML += ` | ${task.subTasksComplete()}/${task.subTasksCount()}`;
    myDiv.appendChild(myEditTaskButton);

    if (task.completed) {
      const myDeleteTaskButton = this.makeElement("button", "tasks__task__delete", "x", () => this.deleteTask(task.id));
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

    // Populate the Project selector with project options. TODO - move to own function
    const projectSelect = document.getElementById("editTaskProjectId");
    projectSelect.innerHTML = "";

    const projectList = this.myApp.projects.projectList;
    for (let i in projectList) {
      if (!projectList[i].completed) {
        const myOption = document.createElement("option");
        myOption.setAttribute("value", projectList[i].id);
        myOption.innerText = (projectList[i].title);
        if (task.projectId == projectList[i].id) {
          myOption.setAttribute("selected", "selected");
        }
        projectSelect.appendChild(myOption);
      }
    }

    // Populate the list of tags from the app. TODO - move to own function
    const tags = this.myApp.tasks.tagList;
    const templateTags = document.querySelector(".edit-task-dialog__tags");
    templateTags.innerHTML = "";

    for (let i in tags) {
      const myTag = document.createElement("div");
      myTag.classList.add("edit-task-dialog__tag");

      const myInput = document.createElement("input");
      myInput.setAttribute("type", "checkbox");
      myInput.setAttribute("name", "tags");
      myInput.setAttribute("value", tags[i].tag);
      if (this.myApp.tasks.hasTag(this.currentTaskId, tags[i].tag)) myInput.checked = true;
      myTag.appendChild(myInput);

      const myLabel = document.createElement("label");
      myLabel.setAttribute("for", "tags");
      myLabel.innerText = tags[i].tag;
      myTag.appendChild(myLabel);

      templateTags.appendChild(myTag);
    }

    // Build the interactive SubTasks section. TODO - move to own function
    const templateSubTasks = document.querySelector(".edit-task-dialog__subtasks");
    templateSubTasks.innerHTML = "";

    const myDiv = document.createElement("div");
    myDiv.classList.add("edit-task-dialog__subtask")
    for (let i in task.subTasks) {
      const mySubtask = document.createElement("div");

      // TODO - move to own function
      const myCompleteSubTaskButton = document.createElement("button");
      myCompleteSubTaskButton.classList.add("edit-task-dialog__subtask__complete")
      myCompleteSubTaskButton.innerText = "o";
      myCompleteSubTaskButton.addEventListener("click", () => {
        task.toggleCompleteSubTask(task.subTasks[i].id);
        this.editTask(id);
      });
      mySubtask.appendChild(myCompleteSubTaskButton);

      // TODO - move to own function
      const myEditSubTaskButton = document.createElement("button")
      myEditSubTaskButton.classList.add("edit-task-dialog__subtask__edit")
      if (task.subTasks[i].completed) myEditSubTaskButton.classList.add("completed");
      myEditSubTaskButton.innerText = task.subTasks[i].title;
      myEditSubTaskButton.addEventListener("click", () => {
        this.editSubTask(task.id, task.subTasks[i].id);
      });
      mySubtask.appendChild(myEditSubTaskButton)

      // TODO - move to own function
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

    // TODO - move to own function
    const myNewSubTaskButton = document.createElement("button");
    myNewSubTaskButton.classList.add("btn", "subtasks__new_task_button");
    myNewSubTaskButton.innerText = "+";
    myNewSubTaskButton.addEventListener("click", () => {
      this.subTaskDialog.showModal();
    })
    myDiv.appendChild(myNewSubTaskButton);

    templateSubTasks.appendChild(myDiv);
    this.editTaskDialog.showModal();
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