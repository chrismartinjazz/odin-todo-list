export function initializeOpenDialog(dialog, openButtonSelector) {
  const openButton = document.querySelector(openButtonSelector);
  openButton.addEventListener("click", () => {
    dialog.showModal();
  });
}

export function initializeCloseDialog(dialog, closeButtonSelector) {
  const closeButton = document.querySelector(closeButtonSelector);
  closeButton.addEventListener("click", () => {
    dialog.close();
  });
}

export function makeElement(htmlTag = "div", cssClass, text, onClickFunction) {
  const myElement = document.createElement(htmlTag);
  if (cssClass) myElement.classList.add(cssClass);
  if (text) myElement.innerText = text;
  if (onClickFunction) {
    myElement.addEventListener("click", onClickFunction);
  };
  return myElement;
}