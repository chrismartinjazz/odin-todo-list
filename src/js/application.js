import Tasks from "./tasks.js"
import Projects from "./projects.js"
import { storeMyApp } from "./storage.js";

// Hold projects and tasks, handle completion and deletion of projects.
export default class Application {
  /*
    All constructors use consistent format:
    constructor(properties = {}) {
      this.property1 = properties["property1"] || default value;
      this.property2 = properties["property2"] || default value;
      ...
    }
    This allows rebuilding of these objects from JSON strings: localStorage.js: getMyApp()
  */
  constructor(properties = {}) {
    this.tasks = properties["tasks"] || new Tasks();
    this.projects = properties["projects"] || new Projects();

    // Listen for a signal 'stateChanged' to trigger storage of updated data in localStorage.
    // This event is triggered manually every time app data is changed by a function.
    document.addEventListener('stateChanged', () => storeMyApp(this));
  }

  // Project operations involve both projects and tasks, so are managed by the application.

  // Set all tasks in a project to be complete. Leave subtask status as is. Set the project to be complete.
  completeProject(projectId) {
    if (projectId == 1) return false;
    if (this.projects.completed(projectId)) return false;

    this.tasks.tasksInProject(projectId).map(task => task.update({ completed: true }));
    this.projects.toggleComplete(projectId);
    return true;
  }

  // Move all incomplete tasks in the project to the Inbox project.
  // Delete completed tasks.
  deleteProject(projectId) {
    const projectTasks = this.tasks.tasksInProject(projectId);
    for (let i in projectTasks) {
      if (!projectTasks[i].completed) {
        console.log("Incomplete");
        this.tasks.move(projectTasks[i].id, 1);
      }
      else {
        console.log("Complete");
        (this.tasks.delete(projectTasks[i].id))
      };
    };
    return this.projects.delete(projectId);
  }
}