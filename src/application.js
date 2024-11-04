import Tasks from "./tasks.js"
import Projects from "./projects.js"
import { storeMyApp } from "./storage.js";

export default class Application {
  constructor(properties = {}) {
    this.tasks = properties["tasks"] || new Tasks();
    this.projects = properties["projects"] || new Projects();

    document.addEventListener('stateChanged', () => storeMyApp(this));
  }

  completeProject(projectId) {
    if (projectId == 1) return false;
    if (this.projects.read(projectId).complete) return false;

    this.tasks.tasksInProject(projectId).map(task => task.update({ completed: true }));
    this.projects.toggleComplete(projectId);
    return true;
  }

  deleteProject(projectId) {
    this.tasks.tasksInProject(projectId).map(task => task.projectId = 1);
    return this.projects.delete(projectId);
  }

  testSuperFunction() {
    console.log("testSuperFunction");
  }
}