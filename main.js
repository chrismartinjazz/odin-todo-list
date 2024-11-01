import TaskList from "./tasklist.js";

function storeMyTasks(myTasks) {
  localStorage.setItem("myTasks", JSON.stringify(myTasks));
}

function getMyTasks() {
  return JSON.parse(localStorage.getItem("myTasks"));
}

function deleteMyTasks() {
  return localStorage.removeItem("myTasks");
}

deleteMyTasks(); // For testing, delete localStorage
let myTasks;

if (!localStorage.getItem("myTasks")) {
  myTasks = new TaskList();
  storeMyTasks(myTasks);
} else {
  myTasks = getMyTasks();
}

console.log(myTasks);
myTasks = getMyTasks(); // For testing.
console.log(myTasks);


// Test Local Storage
// myTasks.create('test task 1');
// myTasks.create('test task 2');


// Testing!

/*
// Test the creation and manipulation of tasks
// Create a task with default project
myTasks.create("Test task 1");
myTasks.create("Test task 2");
myTasks.create("Test task 3");
// Update a task
myTasks.read(1).update({ title: "Updated title", description: "Here's a description", priority: 1, dueDate: "2024-11-10" });
// Add a subTask
myTasks.read(1).createSubTask("subtask 1");
myTasks.read(1).createSubTask("subtask 2");
myTasks.read(1).createSubTask("subtask 3");
// Update a subTask
myTasks.read(1).updateSubTask(1, "updated title");
myTasks.read(1).toggleSubTaskComplete(2);
// Delete a subTask
myTasks.read(1).deleteSubTask(3);
// read a task by Id
console.log(myTasks.read(1).title);
// read a subTask by Id
console.log(myTasks.read(1).findSubTask(2).title);
// Delete a task
myTasks.delete(1);
console.log(myTasks);
*/

/*
// Test the creation and manipulation of projects
// Create a project
myTasks.projects.create("home");
// Update a project's title
myTasks.projects.update(2, "homies");
// Retrieve a project by id
console.log(myTasks.projects.read(2));
// Create a task with a default project
myTasks.create("default project 1");
myTasks.create("default project 2");
myTasks.create("default project 3");
// Create a task with another project
myTasks.create("specific project 1", 2)
myTasks.create("specific project 2", 2)
myTasks.create("specific project 3", 2)
// Retrieve the tasks from a project by projectId
console.log(myTasks.projectTasks(1));
// Move a task to another project
console.log(myTasks.move(1, 2));
console.log(myTasks.projectTasks(1));
// Complete the first task of each project
myTasks.projectTasks(1)[0].toggleComplete
myTasks.projectTasks(2)[0].toggleComplete
// Mark a project as complete (completes all tasks)
console.log(myTasks.projectComplete(1)); // false - cannot complete Inbox
myTasks.projectComplete(2);
console.log(myTasks.projectTasks(2));
console.log(myTasks.projects.read(2));
// Delete a project - moves all tasks to the Inbox
console.log(myTasks.projects.projectTitles());
console.log(myTasks.projectDelete(1)); // false - cannot delete inbox
myTasks.projectDelete(2);
console.log(myTasks.projects.projectTitles());
*/



// console.table(myTasks);

