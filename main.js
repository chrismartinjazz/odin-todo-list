class TaskList {
  constructor() {
    this.nextID = 1;
    this.tasks = [];
  }

  create(title) {
    const task = new Task(this.nextID, title);
    this.tasks.push(task);
    this.nextID++;
    return task;
  }

  read(id) {
    return this.find(id);
  }

  update(id, properties) {
    return this.find(id).update(properties);
  }

  delete(id) {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) return false;

    this.tasks.splice(index, 1);
    return true;
  }

  project(projectName) {
    return this.tasks.filter(task => task.project === projectName);
  }

  find(id) {
    return this.tasks.filter(task => { return task.id === id })[0];
  }
}

class Task {
  constructor(id, title) {
    this.id = id;
    this.title = title;
    this.description = null;
    this.project = 'inbox';
    this.dueDate = null;
    this.completed = false;
    this.subTasks = [];
    this.nextID = 1;
  }

  update(properties) {
    this.title = properties["title"] || this.title;
    this.description = properties["description"] || this.description;
    this.project = properties["project"] || this.project;
    this.dueDate = properties["dueDate"] || this.dueDate;
    return this;
  }

  toggleComplete() {
    this.completed = !this.completed;
  }

  createSubTask(title) {
    subTask = {
      id: this.nextID,
      title: title,
      completed: false
    };
    this.nextID++;
    this.subTasks.push(subTask);
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
    this.findSubTask(id).completed = !this.findSubTask(id).completed;
  }
}

// Testing list functionality

const myTasks = new TaskList();
console.log(myTasks.create("test task 1"));
console.log(myTasks.update(1, { description: "It's testable" }));
console.log(myTasks.create("test task 2"));
console.log(myTasks.read(1).title);
console.log(myTasks.read(2).title);
console.log(myTasks.delete(1));
console.log(myTasks.project('inbox'));
console.log(myTasks.project('nope'));
console.log(myTasks.tasks);