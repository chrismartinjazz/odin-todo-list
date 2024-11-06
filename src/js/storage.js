import Application from "./application.js";
import Tasks from "./tasks.js";
import Projects from "./projects.js";
import Task from "./task.js";

export function storeMyApp(myApp) {
  return localStorage.setItem("myApp", JSON.stringify(myApp));
}

export function getMyApp() {
  let newApp = JSON.parse(localStorage.getItem("myApp"));

  // Convert the list of tasks to Task objects.
  const newTaskList = [];
  for (let task in newApp.tasks.taskList) {
    const newTask = new Task(newApp.tasks.taskList[task]);
    newTaskList.push(newTask);
  }

  // Copy all properties to new object.
  Object.assign(newApp.tasks.taskList, newTaskList);
  newApp.tasks = new Tasks(newApp.tasks);
  newApp.projects = new Projects(newApp.projects);
  newApp = new Application(newApp);

  return newApp;
}

export function deleteMyApp() {
  return localStorage.removeItem("myApp");
}