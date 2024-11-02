import Application from "./application.js";
import Tasks from "./tasks.js";
import Projects from "./projects.js";
import Task from "./task.js";

function storeMyApp(myApp) {
  localStorage.setItem("myApp", JSON.stringify(myApp));
}

function getMyApp() {
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

function deleteMyApp() {
  return localStorage.removeItem("myApp");
}

// deleteMyApp(); // For testing, delete localStorage
let myApp;

if (!localStorage.getItem("myApp")) {
  myApp = new Application();
  storeMyApp(myApp);
} else {
  myApp = getMyApp();
}

// Testing!

/*
// Test the creation and manipulation of tasks
// Create a task with default project
myApp.tasks.create("Test task 1");
myApp.tasks.create("Test task 2");
myApp.tasks.create("Test task 3");
// Update a task
myApp.tasks.read(1).update({ title: "Updated title", description: "Here's a description", priority: 1, dueDate: "2024-11-10" });
// Add a subTask
myApp.tasks.read(1).createSubTask("subtask 1");
myApp.tasks.read(1).createSubTask("subtask 2");
myApp.tasks.read(1).createSubTask("subtask 3");
// Update a subTask
myApp.tasks.read(1).updateSubTask(1, "updated title");
myApp.tasks.read(1).toggleSubTaskComplete(2);
// Delete a subTask
myApp.tasks.read(1).deleteSubTask(3);
// read a task by Id
console.log(myApp.tasks.read(1).title, ": Updated title");
// read a subTask by Id
console.log(myApp.tasks.read(1).findSubTask(2).title, ": subtask 2");
// Delete a task
myApp.tasks.delete(1);
console.log(myApp.tasks, ": 2 tasks in Array");
*/

/*
// Test the creation and manipulation of projects
// Create a project
console.log(myApp.projects.create("home").title, ": home");;

// Update a project's title
myApp.projects.update(2, "homies");
// Retrieve a project by id
console.log(myApp.projects.read(2).title, ": homies");
// Create a task with a default project
myApp.tasks.create("default project 1");
myApp.tasks.create("default project 2");
myApp.tasks.create("default project 3");
// Create a task with another project
myApp.tasks.create("specific project 1", 2)
console.log(myApp.tasks.read(4).projectId, "2")
console.log(myApp.tasks.read(4).title, ": specific project 1")
myApp.tasks.create("specific project 2", 2)
myApp.tasks.create("specific project 3", 2)
// Retrieve the tasks from a project by projectId
console.log(myApp.tasks.tasksInProject(1), ": 3 Tasks");
// Move a task to another project
console.log(myApp.tasks.move(1, 2).projectId, ': 2');
console.log(myApp.tasks.tasksInProject(1), ': 2 tasks');
// Complete the first task of each project
myApp.tasks.read(1).toggleComplete();
console.log(myApp.tasks.read(1).completed, ": true");
// Mark a project as complete (completes all tasks)
console.log(myApp.completeProject(1), ": false - cannot complete Inbox");
myApp.completeProject(2);
console.log(myApp.tasks.tasksInProject(2).map(task => task.completed), ": 4 tasks, all completed (true)");
console.log(myApp.projects.read(2).title, ": homies - project still exists");
// Delete a project - moves all tasks to the Inbox
console.log(myApp.projects.projectTitles(), ": 'inbox', 'homies'");
console.log(myApp.deleteProject(1), ": false - cannot delete inbox");
myApp.deleteProject(2);
console.log(myApp.projects.projectTitles(), ": inbox");
// console.table(myApp);
*/


// Test the conversion function
// Convert myApp to a JSON string and parse back into an object.
// const string = JSON.stringify(myApp);
// myApp = getMyApp(string);
// console.log(myApp);
