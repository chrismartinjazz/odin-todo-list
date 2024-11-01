import TaskList from "./tasklist.js";

const myTasks = new TaskList();

console.log(myTasks);

const testTask = myTasks.create("test task 1");
testTask.update({ description: "It's testable", dueDate: "2024-11-7", priority: 1 });
testTask.createSubTask("Is it testable?");
testTask.createSubTask("It is");
testTask.toggleSubTaskComplete(2);
testTask.deleteSubTask(1);



console.log(testTask);
console.log(myTasks);

const testOutput = JSON.stringify(myTasks);
console.log(testOutput);

// console.log(myTasks.create("test task 2"));
// console.log(myTasks.read(1).title);
// console.log(myTasks.read(2).title);
// console.log(myTasks.delete(1));
// console.log(myTasks.project('inbox'));
// console.log(myTasks.project('nope'));
// console.log(myTasks.tasks);