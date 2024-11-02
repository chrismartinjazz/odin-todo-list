export default class Display {
  constructor(myApp) {
    this.myApp = myApp;
    this.projectsList = document.querySelector(".projects__list");
    this.projectDialog = document.querySelector(".project-dialog");
    this.projectForm = document.querySelector(".project-dialog__form");
    this.tasksList = document.querySelector(".tasks__list");
    this.initializeProjectDialog();
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
    const tasks = this.myApp.tasks.tasksInProject(projectId);
    for (let i in tasks) {
      const myButton = document.createElement("button");
      myButton.innerText = tasks[i].title;
      this.tasksList.appendChild(myButton);

    }
  }

  initializeProjectDialog() {
    this.initializeOpenClose(this.projectDialog, ".projects__new-project-button", ".project-dialog__close");
    this.initializeProjectSubmitForm();
  }

  initializeOpenClose(dialog, openButtonSelector, closeButtonSelector) {
    const openButton = document.querySelector(openButtonSelector);
    const closeButton = document.querySelector(closeButtonSelector);
    openButton.addEventListener("click", () => {
      dialog.showModal();
    });

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
}

