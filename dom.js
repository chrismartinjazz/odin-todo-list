export function displayProjects(projectList) {
  const myProjectsList = document.querySelector(".projects__list");
  for (let i in projectList) {
    const myButton = document.createElement("button");
    myButton.innerText = projectList[i].title;
    myButton.addEventListener("click", () => {
      openProject(projectList[i].id)
    });

    myProjectsList.appendChild(myButton);
  }


}