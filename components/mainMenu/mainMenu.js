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
    const menuContainer = document.querySelector("#menuContainer");
    const title = document.querySelector("#menuTitle");
    const cards = document.querySelectorAll(".categoryCard");
  
    // Lista de estilos para emoções negativas
    const negativeStyles = [
      {
        container: { backgroundColor: "#FFCDD2", borderRadius: "0", boxShadow: "0 4px 8px rgba(244, 67, 54, 0.3)" },
        title: { fontSize: "20px", color: "#FF1744", letterSpacing: "1px" },
        card: { backgroundColor: "#FFEBEE", borderRadius: "0", boxShadow: "0 2px 4px rgba(244, 67, 54, 0.3)" },
      },
      {
        container: { backgroundColor: "#F8BBD0", borderRadius: "15px", boxShadow: "0 6px 10px rgba(233, 30, 99, 0.3)" },
        title: { fontSize: "22px", color: "#E91E63", letterSpacing: "1.5px" },
        card: { backgroundColor: "#FCE4EC", borderRadius: "10px", boxShadow: "0 4px 6px rgba(233, 30, 99, 0.3)" },
      },
      {
        container: { backgroundColor: "#E1BEE7", borderRadius: "30px", boxShadow: "0 8px 12px rgba(156, 39, 176, 0.3)" },
        title: { fontSize: "24px", color: "#9C27B0", letterSpacing: "2px" },
        card: { backgroundColor: "#EDE7F6", borderRadius: "20px", boxShadow: "0 6px 8px rgba(156, 39, 176, 0.3)" },
      },
      {
        container: { backgroundColor: "#BBDEFB", borderRadius: "50px", boxShadow: "0 10px 14px rgba(33, 150, 243, 0.3)" },
        title: { fontSize: "26px", color: "#2196F3", letterSpacing: "2.5px" },
        card: { backgroundColor: "#E3F2FD", borderRadius: "25px", boxShadow: "0 8px 12px rgba(33, 150, 243, 0.3)" },
      },
    ];
  
    // Armazena o índice atual do estilo
    if (!this.currentNegativeStyleIndex) {
      this.currentNegativeStyleIndex = 0;
    }
  
    if (emotion === "Positivo") {
      // Mantém o estado atual para emoções positivas
      menuContainer.style.backgroundColor = "#C8E6C9"; // Verde suave
      menuContainer.style.transition = "all 0.5s ease";
      title.style.color = "#4CAF50";
      cards.forEach((card) => {
        card.style.backgroundColor = "#E8F5E9"; // Verde claro
        card.style.transition = "all 0.5s ease";
      });
    } else {
      // Aplica o próximo estilo da lista
      const style = negativeStyles[this.currentNegativeStyleIndex];
      menuContainer.style.backgroundColor = style.container.backgroundColor;
      menuContainer.style.borderRadius = style.container.borderRadius;
      menuContainer.style.boxShadow = style.container.boxShadow;
      menuContainer.style.transition = "all 0.5s ease";
  
      title.style.fontSize = style.title.fontSize;
      title.style.color = style.title.color;
      title.style.letterSpacing = style.title.letterSpacing;
      title.style.transition = "all 0.5s ease";
  
      cards.forEach((card) => {
        card.style.backgroundColor = style.card.backgroundColor;
        card.style.borderRadius = style.card.borderRadius;
        card.style.boxShadow = style.card.boxShadow;
        card.style.transition = "all 0.5s ease";
      });
  
      // Atualiza o índice para o próximo estilo
      this.currentNegativeStyleIndex = (this.currentNegativeStyleIndex + 1) % negativeStyles.length;
    }
  }
}