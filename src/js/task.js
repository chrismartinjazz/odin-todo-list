// Hold the details of a task and manage subtasks.
export default class Task {
  constructor(properties = {}) {
    this.update(properties);
  }

  update(properties) {
    this.id = properties["id"] || this.id;
    this.projectId = properties["projectId"] || this.projectId || 1;
    this.title = properties["title"] || this.title || null;
    this.description = properties["description"] || this.description || null;
    this.tags = properties["tags"] || this.tags || [];
    this.dueDate = properties["dueDate"] || this.dueDate || null;
    this.completed = properties["completed"] || this.completed || false;
    this.subTasks = properties["subTasks"] || this.subTasks || [];
    this.nextID = properties["nextID"] || this.nextID || 1;
    document.dispatchEvent(new Event('stateChanged'));
    return this;
  }

  toggleComplete() {
    const returnValue = (this.completed = !this.completed);
    document.dispatchEvent(new Event('stateChanged'));
    return returnValue;
  }

  createSubTask(title) {
    if (title == "") return false;

    const subTask = {
      id: this.nextID,
      title: title,
      completed: false
    };
    this.nextID++;
    this.subTasks.push(subTask);
    document.dispatchEvent(new Event('stateChanged'));
    return this;
  }

  updateSubTask(id, title) {
    const returnValue = this.findSubTask(id).title = title;
    document.dispatchEvent(new Event('stateChanged'));
    return returnValue;
  }

  deleteSubTask(id) {
    const index = this.subTasks.findIndex(subTask => subTask.id === id);
    if (index === -1) return false;

    this.subTasks.splice(index, 1);
    document.dispatchEvent(new Event('stateChanged'));
    return true;
  }

  findSubTask(id) {
    return this.subTasks.filter(subTask => { return subTask.id === id })[0];
  }

  hasSubTasks() {
    return this.subTasks.length > 0;
  }

  subTasksComplete() {
    return this.subTasks.filter(subTask => subTask.completed).length;
  }

  subTasksCount() {
    return this.subTasks.length;
  }

  toggleCompleteSubTask(id) {
    const returnValue = (this.findSubTask(id).completed = !this.findSubTask(id).completed);
    document.dispatchEvent(new Event('stateChanged'));
    return returnValue;
  }

  completeAllSubTasks() {
    const returnValue = this.subTasks.map(task => task.completed = true);
    document.dispatchEvent(new Event('stateChanged'));
    return returnValue;
  }
}