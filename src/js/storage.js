import Application from "./application.js";
import Tasks from "./tasks.js";
import Projects from "./projects.js";
import Task from "./task.js";

export function storeMyApp(myApp) {
  return localStorage.setItem("myApp", JSON.stringify(myApp));
}

// Rebuild the myApp object from localStorage data, including all nested objects.
export function getMyApp() {
  // Read the localStorage data into a new App object.
  if (localStorage.getItem("myApp")) {
    let newApp = JSON.parse(localStorage.getItem("myApp"));

    // Convert the list of tasks in the App object to Task objects.
    const newTaskList = [];
    for (let task in newApp.tasks.taskList) {
      const newTask = new Task(newApp.tasks.taskList[task]);
      newTaskList.push(newTask);
    }

    // Replace the tasks in newApp with Task objects, and rebuild the
    // "Tasks" and "Projects" in newApp with new objects.
    Object.assign(newApp.tasks.taskList, newTaskList);
    newApp.tasks = new Tasks(newApp.tasks);
    newApp.projects = new Projects(newApp.projects);
    newApp = new Application(newApp);

    return newApp;
  } else {
    return new Application();
  }
}

export function deleteMyApp() {
  return localStorage.removeItem("myApp");
}