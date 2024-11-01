import Task from "./task.js";
import ProjectList from "./projectlist.js"

export default class TaskList {
  constructor() {
    this.nextID = 1;
    this.tasks = [];
    this.projects = new ProjectList()
  }

  create(title = '', projectId = 1) {
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

  move(id, projectId) {
    return this.read(id).update({ projectId: projectId });
  }

  projectTasks(projectId) {
    return this.tasks.filter(task => task.projectId === projectId);
  }

  projectComplete(projectId) {
    if (projectId == 1) return false;
    if (this.projects.read(projectId).complete) return false;

    this.projectTasks(projectId).map(task => task.update({ completed: true }));
    this.projects.toggleComplete(projectId);
    return true;
  }

  projectDelete(projectId) {
    this.projectTasks(projectId).map(task => task.projectId = 1);
    return this.projects.delete(projectId);
  }

}