import Task from "./task.js";
import ProjectList from "./projectlist.js"

export default class TaskList {
  constructor() {
    this.nextID = 1;
    this.tasks = [];
    this.projects = new ProjectList()
  }

  create(projectId = 1, title = '') {
    const task = new Task(this.nextID, projectId, title);
    this.tasks.push(task);
    this.nextID++;
    return task;
  }

  read(id) {
    return this.tasks.filter(task => { return task.id === id })[0];
  }

  delete(id) {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) return false;

    this.tasks.splice(index, 1);
    return true;
  }

  projectTasks(projectId) {
    return this.tasks.filter(task => task.projectId === projectId);
  }

  projectDelete(projectId) {
    this.projectTasks().map(task => task.projectId = 1);
    return this.projects.delete(projectId);
  }
}