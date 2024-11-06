import Task from "./task.js";

export default class Tasks {
  constructor(properties = {}) {
    this.nextID = properties["nextID"] || 1;
    this.taskList = properties["taskList"] || [];
    this.tagList = properties["tagList"] || [{ tag: "priority", colorCode: "#FFFF00" }];
  }

  create(title = '', projectId = 1) {
    if (title == "") return false;

    const task = new Task({ id: this.nextID, projectId: projectId, title: title });
    this.taskList.push(task);
    this.nextID++;
    document.dispatchEvent(new Event('stateChanged'));
    return task;
  }

  read(id) {
    return this.taskList.filter(task => { return task.id === id })[0];
  }

  delete(id) {
    const index = this.taskList.findIndex(task => task.id === id);
    if (index === -1) return false;

    this.taskList.splice(index, 1);
    document.dispatchEvent(new Event('stateChanged'));
    return true;
  }

  move(id, projectId) {
    const returnValue = this.read(id).update({ projectId: projectId });
    document.dispatchEvent(new Event('stateChanged'));
    return returnValue;
  }

  tasksInProject(projectId) {
    return this.taskList.filter(task => task.projectId === projectId);
  }

  hasTag(id, tag) {
    return (this.read(id).tags.includes(tag));
  }

  addTag(id, tag) {
    if (this.hasTag(id, tag)) return false;

    if (!this.tagList.find(item => item.tag == "priority")) this.tagList.push({ tag: tag });
    return this.read(id).tags.push(tag);
  }

  removeTag(id, tag) {
    if (!this.hasTag(id, tag)) return false;

    return this.read(id).tags.splice(this.read(id).tags.indexOf(tag), 1);
  }
}