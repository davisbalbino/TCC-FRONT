import { MainMenu } from "./components/mainMenu/mainMenu.js";

document.addEventListener('DOMContentLoaded', () => {
    const mainMenu = new MainMenu();

    document.addEventListener('click', (event) => {
        const clickedElement = event.target;
        const itemId = clickedElement.id; 
        
        if (itemId) {
            console.log(`ID do item clicado: ${itemId}`);
            mainMenu.changeMenu(itemId); // Se desejar usar o ID para modificar o menu
        }
    });
});

