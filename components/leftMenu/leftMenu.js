export class LeftMenu {
  constructor() {
    this.createMenu();
    this.addCss("leftMenu");
  }

  createMenu() {
    const leftContent = document.querySelector("#left-content");

    const menuContainer = document.createElement("div");
    menuContainer.id = "leftMenuContainer";

    // Título do menu
    const title = document.createElement("h3");
    title.textContent = "Classificar";
    menuContainer.appendChild(title);

    // Filtros de classificação
    const filters = [
      { name: "Preço", key: "price" },
      { name: "Popularidade", key: "popularity" },
    ];

    filters.forEach((filter) => {
      const filterButton = document.createElement("button");
      filterButton.textContent = `Classificar por: ${filter.name}`;
      menuContainer.appendChild(filterButton);

      filterButton.addEventListener("click", () => {
        const customEvent = new CustomEvent("filterBy", { detail: filter.key });
        document.dispatchEvent(customEvent);
      });
    });

    leftContent.appendChild(menuContainer);
  }

  addCss(nomeCss) {
    const folhaDeEstilo = document.createElement("link");
    folhaDeEstilo.rel = "stylesheet";
    folhaDeEstilo.href = `./components/leftMenu/css/${nomeCss}.css`; // Caminho ajustado
    document.head.appendChild(folhaDeEstilo);
  }

  updateEmotionResult(emotion) {
    const leftMenu = document.querySelector("#leftMenuContainer");
    if (emotion === "Positivo") {
      leftMenu.style.backgroundColor = "#C8E6C9"; // Verde suave
      leftMenu.style.boxShadow = "0 4px 8px rgba(76, 175, 80, 0.3)";
      leftMenu.style.transition = "background-color 0.5s ease, box-shadow 0.5s ease";
    } else {
      leftMenu.style.backgroundColor = "#FFCDD2"; // Vermelho suave
      leftMenu.style.boxShadow = "0 4px 8px rgba(244, 67, 54, 0.3)";
      leftMenu.style.transition = "background-color 0.5s ease, box-shadow 0.5s ease";
    }
  }
}