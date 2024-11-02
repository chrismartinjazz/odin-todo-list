export default class Projects {
  constructor(properties = {}) {
    this.nextID = properties["nextID"] || 1;
    this.projectList = properties["projectList"] || [];
    this.create("inbox");
  }

  create(title) {
    if (this.projectTitles().includes(title)) return false;

    const newProject = { id: this.nextID, title: title, completed: false }
    this.nextID++;
    this.projectList.push(newProject);
    return newProject;
  }

  read(id) {
    return this.projectList.filter(project => { return project.id === id })[0] || false;
  }

  update(id, title) {
    if (id == 1) return false;

    this.read(id).title = title;
    return this.read(id);
  }

  delete(id) {
    if (id == 1) return false;

    const index = this.projectList.findIndex(project => project.id === id);
    if (index === -1) return false;

    this.projectList.splice(index, 1);
    return true;
  }

  toggleComplete(id) {
    if (id == 1) return false;

    return this.read(id).completed = !this.read(id).completed;
  }

  projectTitles() {
    const titleList = [];
    this.projectList.map(project => {
      if (!titleList.includes(project.title)) {
        titleList.push(project.title)
      }
    });
    return titleList;
  }
}