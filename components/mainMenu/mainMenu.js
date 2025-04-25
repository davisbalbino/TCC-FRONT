export class MainMenu {
  constructor() {
    this.createMenu();
    this.addCss("mainMenu");
  }

  createMenu() {
    const menuContainer = document.createElement("div");
    menuContainer.id = "menuContainer";

    // Título estilizado do menu
    const title = document.createElement("h2");
    title.textContent = "Explore Categorias";
    title.id = "menuTitle";
    menuContainer.appendChild(title);

    // Container para os cards
    const cardContainer = document.createElement("div");
    cardContainer.id = "cardContainer";

    // Define as categorias
    const categories = [
      { name: "Eletrônicos", icon: "💻" },
      { name: "Vestuário", icon: "👗" },
      { name: "Livros", icon: "📚" },
      { name: "Esportes", icon: "⚽" },
      { name: "Casa", icon: "🏠" },
    ];

    categories.forEach((category) => {
      const card = document.createElement("div");
      card.className = "categoryCard";

      // Ícone da categoria
      const icon = document.createElement("span");
      icon.className = "categoryIcon";
      icon.textContent = category.icon;
      card.appendChild(icon);

      // Nome da categoria
      const categoryName = document.createElement("p");
      categoryName.className = "categoryName";
      categoryName.textContent = category.name;
      card.appendChild(categoryName);

      // Adiciona evento para filtro
      card.addEventListener("click", () => {
        const customEvent = new CustomEvent("filterCategory", { detail: category.name });
        document.dispatchEvent(customEvent);
      });

      cardContainer.appendChild(card);
    });

    menuContainer.appendChild(cardContainer);
    document.querySelector("#top-content").appendChild(menuContainer);
  }

  addCss(nomeCss) {
    const folhaDeEstilo = document.createElement("link");
    folhaDeEstilo.rel = "stylesheet";
    folhaDeEstilo.href = `./components/mainMenu/css/${nomeCss}.css`; // Caminho ajustado
    document.head.appendChild(folhaDeEstilo);
  }

  updateEmotionResult(emotion) {
    console.log(emotion)
    const menuContainer = document.querySelector("#menuContainer");
  
    // Lista de estilos para emoções negativas
    const negativeStyles = [
      { backgroundColor: "#FFCDD2", borderRadius: "0", boxShadow: "0 4px 8px rgba(244, 67, 54, 0.3)" },
      { backgroundColor: "#F8BBD0", borderRadius: "15px", boxShadow: "0 6px 10px rgba(233, 30, 99, 0.3)" },
      { backgroundColor: "#E1BEE7", borderRadius: "30px", boxShadow: "0 8px 12px rgba(156, 39, 176, 0.3)" },
      { backgroundColor: "#BBDEFB", borderRadius: "50px", boxShadow: "0 10px 14px rgba(33, 150, 243, 0.3)" },
      { backgroundColor: "#C5CAE9", borderRadius: "10px", boxShadow: "0 4px 6px rgba(63, 81, 181, 0.3)" },
    ];
  
    // Armazena o índice atual do estilo
    if (!this.currentNegativeStyleIndex) {
      this.currentNegativeStyleIndex = 0;
    }
  
    if (emotion === "Positivo") {
      // Mantém o estado atual para emoções positivas
      menuContainer.style.backgroundColor = "#C8E6C9"; // Verde suave
      menuContainer.style.transition = "background-color 0.5s ease, border-radius 0.5s ease, box-shadow 0.5s ease";
    } else {
      // Aplica o próximo estilo da lista
      const style = negativeStyles[this.currentNegativeStyleIndex];
      menuContainer.style.backgroundColor = style.backgroundColor;
      menuContainer.style.borderRadius = style.borderRadius;
      menuContainer.style.boxShadow = style.boxShadow;
      menuContainer.style.transition = "background-color 0.5s ease, border-radius 0.5s ease, box-shadow 0.5s ease";
  
      // Atualiza o índice para o próximo estilo
      this.currentNegativeStyleIndex = (this.currentNegativeStyleIndex + 1) % negativeStyles.length;
    }
  }
}