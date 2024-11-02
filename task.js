export default class Task {
  constructor(properties = {}) {
    this.update(properties);
  }

  update(properties) {
    this.id = properties["id"] || this.id;
    this.projectId = properties["projectId"] || this.projectId || 1;
    this.title = properties["title"] || this.title || null;
    this.description = properties["description"] || this.description || null;
    this.priority = properties["priority"] || this.priority || null;
    this.dueDate = properties["dueDate"] || this.dueDate || null;
    this.completed = properties["completed"] || this.completed || false;
    this.subTasks = properties["subTasks"] || this.subTasks || [];
    this.nextID = properties["nextID"] || this.nextID || 1;
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