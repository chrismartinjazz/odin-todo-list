# odin-todo-list

Made for The Odin Project.

A todo-list app using localStorage for data.

* Max. 5MB of data
* Persistent across sessions
* Intended for demonstration rather than practical use

## Features

* Add Projects, Tasks, and Subtasks
* Description, due date and priority flag for tasks
* Task shows due date and count of subtasks complete / total
* Priority tasks are highlighted
* Complete and delete projects and tasks
* Completing a project completes all tasks in the project
* Deleting a project deletes any completed tasks, and returns incomplete tasks to the inbox

## Code

* Classes for:
  * Display
  * Application
  * Projects
  * Tasks
  * Task
* Local storage updated every time any app data is changed using event handling.
* Module 'displayhelper' with functions to open and close dialogs, make elements.
