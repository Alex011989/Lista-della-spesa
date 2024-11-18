document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.getElementById("addButton");
  const itemInput = document.getElementById("itemInput");
  const activeList = document.getElementById("activeList");
  const removedList = document.getElementById("removedList");
  const resetButton = document.getElementById("resetButton");

  // Inizializza la lista caricando dal LocalStorage
  initializeLists();

  // Aggiungi un nuovo alimento alla lista attiva
  addButton.addEventListener("click", () => {
    const itemText = itemInput.value.trim();
    if (itemText === "") return;

    addItemToList(itemText, activeList, "Elimina", moveToRemoved);
    itemInput.value = ""; // Resetta l'input
    saveListsToStorage();
  });

  // Pulsante RESET
  resetButton.addEventListener("click", () => {
    activeList.innerHTML = ""; // Cancella la lista attiva
    removedList.innerHTML = ""; // Cancella la lista eliminati
    localStorage.clear(); // Pulisci LocalStorage
  });

  // Crea un elemento nella lista
  function addItemToList(text, list, buttonText, buttonAction) {
    const listItem = document.createElement("li");

    const label = document.createElement("span");
    label.textContent = text;

    const button = document.createElement("button");
    button.textContent = buttonText;
    button.className = "moveButton";

    button.addEventListener("click", () => {
      buttonAction(listItem, label.textContent);
      saveListsToStorage();
    });

    listItem.appendChild(label);
    listItem.appendChild(button);
    list.appendChild(listItem);
  }

  // Sposta un elemento nella lista eliminati
  function moveToRemoved(item, text) {
    activeList.removeChild(item);
    addItemToList(text, removedList, "Ripristina", moveToActive);
    item.classList.add("completed");
    saveListsToStorage();
  }

  // Sposta un elemento nella lista attiva
  function moveToActive(item, text) {
    removedList.removeChild(item);
    addItemToList(text, activeList, "Elimina", moveToRemoved);
    item.classList.remove("completed");
    saveListsToStorage();
  }

  // Salva le liste nel LocalStorage
  function saveListsToStorage() {
    const activeItems = Array.from(activeList.children).map(item =>
      item.querySelector("span").textContent
    );
    const removedItems = Array.from(removedList.children).map(item =>
      item.querySelector("span").textContent
    );

    localStorage.setItem("activeList", JSON.stringify(activeItems));
    localStorage.setItem("removedList", JSON.stringify(removedItems));
  }

  // Carica le liste dal LocalStorage
  function initializeLists() {
    const activeItems = JSON.parse(localStorage.getItem("activeList")) || [];
    const removedItems = JSON.parse(localStorage.getItem("removedList")) || [];

    activeItems.forEach(text =>
      addItemToList(text, activeList, "Elimina", moveToRemoved)
    );

    removedItems.forEach(text =>
      addItemToList(text, removedList, "Ripristina", moveToActive)
    );
  }
});
