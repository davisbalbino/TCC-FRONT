export class RightContent {
    constructor() {
        this.categories = ["Eletrônicos", "Vestuário", "Livros", "Esportes", "Casa"];
        this.products = this.generateRandomProducts(20); // Gera 20 produtos aleatórios
        this.filteredProducts = [...this.products]; // Inicialmente todos os produtos
        this.createContent();
        this.setupListeners();
    }

    // Função para gerar produtos aleatórios
    generateRandomProducts(quantity) {
        const randomProducts = [];
        for (let i = 0; i < quantity; i++) {
            const category = this.categories[Math.floor(Math.random() * this.categories.length)];
            const price = (Math.random() * 100).toFixed(2); // Preço entre 0 e 100 reais
            const popularity = Math.floor(Math.random() * 100); // Popularidade entre 0 e 100
            const name = `Produto ${i + 1}`;
            randomProducts.push({ name, category, price, popularity });
        }
        return randomProducts;
    }

    createContent() {
        const rightContent = document.querySelector("#right-content");

        // Carrossel de promoções
        const carousel = document.createElement("div");
        carousel.id = "carouselContainer";

        this.promoImages = ["promo1.png", "promo2.jpg", "promo3.jpg"]; // Lista de imagens
        this.currentIndex = 0; // Índice inicial

        this.promoImages.forEach((image, index) => {
            const img = document.createElement("img");
            img.src = `./components/rightContent/images/${image}`;
            img.alt = `Promoção ${index + 1}`;
            img.className = index === 0 ? "active" : ""; // Define a primeira imagem como ativa
            carousel.appendChild(img);
        });

        rightContent.appendChild(carousel);

        // Lista de produtos
        this.productList = document.createElement("div");
        this.productList.id = "productList";

        this.updateProductList();
        rightContent.appendChild(this.productList);

        this.addCss("rigthContent");

        this.startCarousel(); // Inicia a troca automática
    }

    startCarousel() {
        const carouselImages = document.querySelectorAll("#carouselContainer img");
        setInterval(() => {
            // Remove a classe ativa da imagem atual
            carouselImages[this.currentIndex].classList.remove("active");
            carouselImages[this.currentIndex].classList.add("exiting");

            // Atualiza o índice
            this.currentIndex = (this.currentIndex + 1) % this.promoImages.length;

            // Define a próxima imagem como ativa
            carouselImages[this.currentIndex].classList.remove("exiting");
            carouselImages[this.currentIndex].classList.add("active");
        }, 3000); // Troca a imagem a cada 3 segundos
    }

    setupListeners() {
        // Listener para pesquisa
        document.addEventListener("searchQuery", (event) => {
            const query = event.detail;
            this.filteredProducts = this.products.filter((product) =>
                product.name.toLowerCase().includes(query)
            );
            this.updateProductList();
        });

        // Listener para classificação
        document.addEventListener("filterBy", (event) => {
            const key = event.detail;
            this.filteredProducts.sort((a, b) => a[key] - b[key]); // Ordena os produtos
            this.updateProductList();
        });

        // Listener para filtrar por categoria
        document.addEventListener("filterCategory", (event) => {
            const category = event.detail;
            this.filteredProducts = this.products.filter(
                (product) => product.category === category
            );
            this.updateProductList();
        });
    }

    updateProductList() {
        this.productList.innerHTML = ""; // Limpa a lista atual

        this.filteredProducts.forEach((product) => {
            const productItem = document.createElement("div");
            productItem.textContent = `${product.name} - Categoria: ${product.category} - Preço: R$${product.price} - Popularidade: ${product.popularity}`;
            productItem.className = "productItem";
            this.productList.appendChild(productItem);
        });
    }
    addCss(nomeCss) {
        const folhaDeEstilo = document.createElement("link");
        folhaDeEstilo.rel = "stylesheet";
        // Ajuste o caminho conforme a estrutura do seu projeto
        folhaDeEstilo.href = `./components/rightContent/css/${nomeCss}.css`;
        document.head.appendChild(folhaDeEstilo);
    }

    updateEmotionResult(emotion) {
        const productList = document.querySelector("#productList");
        if (emotion === "Positivo") {
            productList.style.gridTemplateColumns = "repeat(auto-fit, minmax(200px, 1fr))"; // Layout mais espaçado
            productList.style.backgroundColor = "#E8F5E9"; // Verde suave
            productList.style.transition = "all 0.5s ease";
        } else {
            productList.style.gridTemplateColumns = "repeat(auto-fit, minmax(150px, 1fr))"; // Layout mais compacto
            productList.style.backgroundColor = "#FFEBEE"; // Vermelho suave
            productList.style.transition = "all 0.5s ease";
        }
    }
}