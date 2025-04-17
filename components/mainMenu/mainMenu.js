export class MainMenu {
  constructor() {
    // Armazena os resultados das análises
    this.emotionResults = [];
    // Quantidade de fotos a processar
    this.photosToProcess = 15;
    this.createMenu();
  }

  createMenu() {
    // Cria o container principal do menu
    const menuContainer = document.createElement("div");
    menuContainer.id = "menuContainer";

    // Cria o botão de toggle que exibirá/ocultará o conteúdo do menu
    const toggleButton = document.createElement("button");
    toggleButton.id = "menuToggle";
    toggleButton.textContent = "☰ Menu";
    menuContainer.appendChild(toggleButton);

    // Cria o container para os itens do menu
    const menuContent = document.createElement("nav");
    menuContent.id = "menuContent";
    menuContent.style.display = "none"; // inicia oculto

    // Define os nomes dos botões do menu
    const botoes = ["Início", "Sobre", "Contato", "Pag1", "Pag2"];
    botoes.forEach((nome) => {
      const botao = document.createElement("button");
      botao.textContent = nome;
      botao.classList.add("menuButton");

      botao.addEventListener("click", () => {
        alert(`Você clicou no botão: ${nome}`);
      });

      menuContent.appendChild(botao);
    });

    // Adiciona o conteúdo (itens) ao container principal
    menuContainer.appendChild(menuContent);

    // Insere o menu na área desejada da página
    document.querySelector("#top-content").appendChild(menuContainer);

    // Lógica para alternar a exibição do menu
    toggleButton.addEventListener("click", () => {
      if (menuContent.style.display === "none" || menuContent.style.display === "") {
        menuContent.style.display = "flex"; // Exibe em formato flex (horizontal por padrão)
      } else {
        menuContent.style.display = "none"; // Oculta o menu
      }
    });

    // Aplica o estilo inicial
    this.addCss("mainMenu1");
  }

  removeCssStyle() {
    const cssStyles = ["mainMenu1.css", "mainMenu2.css"]; // Nomes dos arquivos CSS a remover
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
    // Ajuste o caminho conforme a estrutura do seu projeto
    folhaDeEstilo.href = `./components/mainMenu/css/${nomeCss}.css`;
    document.head.appendChild(folhaDeEstilo);
  }

  capturePhotos(quantity) {
    this.emotionResults = [];
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        const videoElement = document.createElement('video');
        videoElement.srcObject = stream;
        videoElement.play();

        videoElement.onloadedmetadata = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          let photoCount = 0;
          const capturePhoto = () => {
            
            
            if (photoCount < quantity) {
              canvas.width = videoElement.videoWidth;
              canvas.height = videoElement.videoHeight;
              context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

              // Converte a imagem para base64 (removendo o header)
              const photoBase64 = canvas.toDataURL('image/png').split(',')[1];

              // Envia a imagem para a API
              this.sendToAPI(photoBase64);
              photoCount++;
              // Captura uma nova foto a cada 500ms
              setTimeout(capturePhoto, 500);
            } else {
              // Para o stream da câmera após capturar todas as fotos
              stream.getTracks().forEach((track) => track.stop());
              console.log("Captura concluída!");
              // Aguarda alguns segundos para que as respostas pendentes sejam processadas 
              // e então processa os resultados com o que foi recebido.
              setTimeout(() => this.processEmotionResults(), 2000);
            }
          };
          capturePhoto();
        };
      })
      .catch((error) => {
        console.error("Erro ao acessar a câmera:", error);
      });
  }

  sendToAPI(base64Image) {
    const url = "http://127.0.0.1:5000/api/analyze_emotion";

    const payload = {
      image: base64Image,
      fileName: `foto_${Date.now()}.png`
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("Falha no envio:", response.status);
          return null;
        }
      })
      .then(data => {
        if (data && data.emotion !== undefined) {
          // Considera a emoção como número (1 ou 0)
          const emotionValue = Number(data.emotion);
          console.log("Emoção detectada:", emotionValue);

          // Armazena o resultado
          this.emotionResults.push(emotionValue);
          // Não verifica mais se a quantidade chegou; 
          // o processamento final ocorrerá ao fim da captura.
        } else {
          console.warn("Nenhuma emoção retornada pela API.");
        }
      })
      .catch(error => {
        console.error("Erro ao enviar a imagem ou processar resposta:", error);
      });
  }

  processEmotionResults() {
    // Calcula a quantidade total, positivas e negativas
    const total = this.emotionResults.length;
    const positiveCount = this.emotionResults.filter(val => val === 0).length;
    const negativeCount = total - positiveCount;

    console.log(`Resultados: Positivo ${positiveCount}, Negativo ${negativeCount}`);

    // Remove estilos CSS anteriores (se desejar)

    // Altera o menu de acordo com a maioria
    if (positiveCount >= negativeCount) {
      console.log('entrei no primeiro')
      // Se a maioria for positiva, aplica o estilo para "positividade"
      document.querySelector("#menuToggle").style.backgroundColor = "#4CAF50"; // Verde
      document.querySelector("#menuContent").style.backgroundColor = "#4CAF50"; // Verde

    } else {
      console.log('entrei no segundo')

      // Se a maioria for negativa ou se houver poucos dados, aplica o estilo para "negatividade"
      document.querySelector("#menuToggle").style.backgroundColor = "#F44336"; // Vermelho
      document.querySelector("#menuContent").style.backgroundColor = "#F44336"; // Verde

    }
  }
}