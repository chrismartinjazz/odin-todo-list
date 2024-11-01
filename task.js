export default class Task {
  constructor(id, projectId = 1, title) {
    this.id = id;
    this.projectId = projectId;
    this.title = title;
    this.description = null;
    this.priority = null;
    this.dueDate = null;
    this.completed = false;
    this.subTasks = [];
    this.nextID = 1;
  }

  update(properties) {
    this.projectId = properties["projectId"] || this.projectId;
    this.title = properties["title"] || this.title;
    this.description = properties["description"] || this.description;
    this.priority = properties["priority"] || this.priority;
    this.dueDate = properties["dueDate"] || this.dueDate;
    this.completed = properties["completed"] || this.completed;
    return this;
  }

  toggleComplete() {
    this.completed = !this.completed;
  }

  createSubTask(title) {
    const subTask = {
      id: this.nextID,
      title: title,
      completed: false
    };
    this.nextID++;
    this.subTasks.push(subTask);
    return this;
  }

  updateSubTask(id, title) {
    this.findSubTask(id).title = title;
  }

  deleteSubTask(id) {
    const index = this.subTasks.findIndex(subTask => subTask.id === id);
    if (index === -1) return false;

    this.subTasks.splice(index, 1);
    return true;
  }

  findSubTask(id) {
    return this.subTasks.filter(subTask => { return subTask.id === id })[0];
  }

  toggleSubTaskComplete(id) {
    return this.findSubTask(id).completed = !this.findSubTask(id).completed;
  }

  completeAllSubTasks() {
    return this.subTasks.map(task => task.completed = true);
  }
}