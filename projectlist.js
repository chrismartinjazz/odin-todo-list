export default class ProjectList {
  constructor() {
    this.nextID = 1;
    this.projects = [];
    this.create("inbox");
  }

  create(title) {
    if (this.projectTitles().includes(title)) return false;

    const newProject = { id: this.nextID, title: title, completed: false }
    this.nextID++;
    this.projects.push(newProject);
    return newProject;
  }

  read(id) {
    return this.projects.filter(project => { return project.id === id })[0] || false;
  }

  update(id, title) {
    this.read(id).title = title;
    return this.read(id);
  }

  delete(id) {
    const index = this.projects.findIndex(project => project.id === id);
    if (index === -1) return false;

    this.projects.splice(index, 1);
    return true;
  }

  toggleComplete(id) {
    return this.read(id).completed = !this.read(id).completed;
  }

  projectTitles() {
    const titleList = [];
    this.projects.map(project => {
      if (!titleList.includes(project.title)) {
        titleList.push(project.title)
      }
    });
    return titleList;
  }
}