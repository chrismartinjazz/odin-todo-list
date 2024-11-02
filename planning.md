# Planning for Todo List website

## Spec

- DONE Dynamically create Todo objects (factories or constructors / classes)
- DONE Properties must include:
  - DONE title
  - DONE description
  - DONE dueDate
  - DONE priority
- DONE Brainstorm additional properties. E.g. notes, checklist, priority level.
- DONE Projects - lists of todos.
  - DONE Users can allocate a project on creation of Todo.
  - DONE New todo goes into a default project (Inbox) if not allocated an existing project
  - DONE Users can create new projects
  - DONE Users can delete projects (todos all go back into Inbox)
  - DONE A todo can have only one project.
- Application and DOM are separate.
- Use npm date-fns to manipulate dates and times.
- DONE use [localStorage] <https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API> to store data on user's computer.
  - DONE Data may not be persistent, so handle not finding data.
  - DONE Note that this uses JSON.
- Note - not clear if needs to be served through JavaScript like previous project, or if should be html templates.

UI is able to:

- View all projects (Home?)
- View all todos in each project (title, duedate, priority affects color?)
- Expand a single todo to see/edit its details (in a modal)
- Delete a todo

I have already created something inspired by Todoist, so I will look instead at any.do as it isn't Mac only and has a free tier.

## Key steps

### Application

- DONE Determine object / class structure for Todos and Todo list.
- DONE Build interfaces to create todos and test in the console.
- DONE Build localStorage.

### UI

- Build modal to add a todo.
- Build page to show todos within a project - mark complete, edit, delete
- Build page to show a list of projects - mark complete, edit, delete
- Build home / landing page

OK going over this in some more detail.

On landing at home page the user sees just the list of their projects in the middle of the screen. This list has a + button next to the header.

```txt
+-----------------------+
|Projects           +   |
|-----------------------|
|Inbox                  |
.                       .
.                       .
```

If click the plus button, get a big modal:

```txt
      +-----------------+
      |Add a project    |
      |                 |
      |        Continue |
      +-----------------+
```

Once submitted, go to the project view for the new project. Also get to project view by clicking on one of the buttons.

Here we have a title, a list of tasks (empty for new project) and down the bottom a button for + Add task

```txt
+-----------------------------------+
| Project Title                     |
|-----------------------------------|
| O Task 3                          |
|   Nov 15, 2024 | 0/3              |
| O Task 2                          |
|   Nov 28, 2024                    |
| O Task 1                          |
.                                   .
.                                   .
|-----------------------------------|
| + Add task                        |
+-----------------------------------+
```

The tasks are sorted in order of due date, most recent at the top.
The second line of the task shows the due date if it has one, and the status of subtasks (completed / count).
If click Add Task, opens the modal form to add / edit a task.
If click the circle, the task is marked complete, crossed out. An X button appears next to it. Click that and it is deleted.

Click on the body of the task and it opens a dialog to view and edit (combined) the task. Can change the Notes, add Subtasks, etc.

```txt
+-------------------------+
|Task title               |
|                         |
|Description              |
|                         |
|Subtasks                 |
|O Subtask 1              |
|O Subtask 2              |
|O Subtask 3              |
|O Add a new subtask      |
|                         |
+-------------------------+
```

Click on the O next to a Subtask to mark it complete, click on the X to delete it.

## Investigating any.do

When adding a task, just add the 'title'.

When editing a task, can:

- change the 'notes'
- assign it to a 'list' (project)
- add 'tags'. I'll do a Priority tag system (level 1, 2).
- add 'subtasks'. These are a genuine checklist - just a title and complete or not, and can delete once complete. I like this.
- attachments (I won't do this).
- add a reminder (I won't do this).

DONE Todo object structure:

- string title
- string description
- string project
- datetime duedate
- boolean completed
- array subtasks
  - string title
  - boolean completed

DONE I know it should have created and modified datetime but keep it simple.

DONE This will be a JSON object. Make it a single JSON for the whole package. So, an array of all the todo objects.

DONE Will need a wrapper to convert the objects to json.
