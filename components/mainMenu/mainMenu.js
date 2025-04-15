export class MainMenu {
  constructor() {
    this.createMenu();
  }

  createMenu() {
    const menu = document.createElement("div");
    menu.id = "menuContainer";

    const botoes = ["Início", "Sobre", "Contato"];
    botoes.forEach((nome) => {
      const botao = document.createElement("button");
      botao.textContent = nome;

      botao.addEventListener("click", () => {
        alert(`Você clicou no botão: ${nome}`);
      });

      menu.appendChild(botao);
    });
    
    document.querySelector("#left-content").appendChild(menu);

    this.changeMenu(true)
  
  }

  changeMenu(emotion){
    this.removeCssStyle();
    if (emotion) {
        this.addCss('mainMenu1')
    }else{
        this.addCss('mainMenu2')
    }
  }

  removeCssStyle() {
    const cssStyles = ["mainMenu1.css", "mainMenu2.css"]; // Nomes dos arquivos CSS

    let folhasEstilo = document.querySelectorAll('link[rel="stylesheet"]');

    folhasEstilo.forEach((folha) => {
      cssStyles.forEach((nomeCss) => {
        if (folha.href.includes(nomeCss)) {
          folha.remove();
        }
      });
    });
  }

  addCss(nomeCss) {
    const folhaDeEstilo = document.createElement("link");
    folhaDeEstilo.rel = "stylesheet";
    folhaDeEstilo.href = `./components/mainMenu/css/${nomeCss}.css`; 
    document.head.appendChild(folhaDeEstilo);
  }
}
