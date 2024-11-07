import { dialogHelper } from "./dialoghelper.js";

export default class ProjectInterface {
  constructor(myApp) {
    this.myApp = myApp;

    this.projectsList = document.querySelector(".projects__list");
    this.projectDialog = document.querySelector(".project-dialog");
    this.projectForm = document.querySelector(".project-dialog__form");
    this.initializeProjectDialog();

    this.editProjectDialog = document.querySelector(".edit-project-dialog");
    this.editProjectForm = document.querySelector(".edit-project-dialog__form");
    this.initializeEditProjectDialog();
  }

}