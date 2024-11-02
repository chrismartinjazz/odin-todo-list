import Task from "./task.js";

export default class Tasks {
  constructor(properties = {}) {
    this.nextID = properties["nextID"] || 1;
    this.taskList = properties["taskList"] || [];
  }

  create(title = '', projectId = 1) {
    const task = new Task({ id: this.nextID, projectId: projectId, title: title });
    this.taskList.push(task);
    this.nextID++;
    return task;
  }

  read(id) {
    return this.taskList.filter(task => { return task.id === id })[0];
  }

  delete(id) {
    const index = this.taskList.findIndex(task => task.id === id);
    if (index === -1) return false;

    this.taskList.splice(index, 1);
    return true;
  }

  move(id, projectId) {
    return this.read(id).update({ projectId: projectId });
  }

  tasksInProject(projectId) {
    return this.taskList.filter(task => task.projectId === projectId);
  }
}