import { MainMenu } from "./components/mainMenu/mainMenu.js";

document.addEventListener('DOMContentLoaded', () => {
    const mainMenu = new MainMenu()

    document.getElementById('menuSwitch').addEventListener('change', (event) => {
        const valor = event.target.checked;  
        mainMenu.changeMenu(valor);
    });
    

});
