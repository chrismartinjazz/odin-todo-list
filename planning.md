# Planning for Todo List website

## Spec

- Dynamically create Todo objects (factories or constructors / classes)
- Properties must include:
  - title
  - description
  - dueDate
  - priority
- Brainstorm additional properties. E.g. notes, checklist, priority level.
- Projects - lists of todos.
  - Users can allocate a project on creation of Todo.
  - New todo goes into a default project (Inbox) if not allocated an existing project
  - Users can create new projects
  - Users can delete projects (todos all go back into Inbox)
  - A todo can have only one project.
- Application and DOM are separate.
- Use npm date-fns to manipulate dates and times.
- use [localStorage] <https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API> to store data on user's computer.
  - Data may not be persistent, so handle not finding data.
  - Note that this uses JSON.
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
- Build localStorage.

### UI

- Build modal to add a todo.
- Build page to show todos within a project - mark complete, edit, delete
- Build page to show a list of projects - mark complete, edit, delete
- Build home / landing page

## Investigating any.do

When adding a task, just add the 'title'.

When editing a task, can:

- change the 'notes'
- assign it to a 'list' (project)
- add 'tags'. I'll do a Priority tag system.
- add 'subtasks'. These are a genuine checklist - just a title and complete or not, and can delete once complete. I like this.
- attachments (I won't do this).
- add a reminder (I won't do this).

Todo object structure:

- string title
- string description
- string project
- datetime duedate
- boolean completed
- array subtasks
  - string title
  - boolean completed

I know it should have created and modified datetime but keep it simple.

This will be a JSON object. Make it a single JSON for the whole package. So, an array of all the todo objects.

Will need a wrapper to convert the objects to json.
