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

  changeMenu(emotion) {
    console.log('entrei aqui')
    this.removeCssStyle();

    this.capturePhotos(15)

    if (emotion) {
      this.addCss('mainMenu1')
    } else {
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

  capturePhotos(quantity) {
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

              // Converte a imagem para base64
              const photoBase64 = canvas.toDataURL('image/png').split(',')[1];

              // Envia a imagem em base64 para a API
              this.sendToAPI(photoBase64);

              photoCount++;
              setTimeout(capturePhoto, 500); // Captura uma nova foto a cada 500ms
            } else {
              // Para o stream da câmera após capturar todas as fotos
              stream.getTracks().forEach((track) => track.stop());
              console.log("Captura concluída!");
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
    // Substitua pela URL da sua API
    const url = "http://127.0.0.1:5000/api/analyze_emotion";

    const payload = {
        image: base64Image, // Envia o base64 no corpo
        fileName: `foto_${Date.now()}.png` // Nome para referência (opcional)
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload) // Serializa o JSON
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // Lê a resposta JSON
        } else {
            console.error("Falha no envio:", response.status);
            return null; // Retorna nulo em caso de erro
        }
    })
    .then(data => {
        if (data && data.emotion) {
            // Imprime a emoção retornada no console
            console.log("Emoção detectada:", data.emotion);
        } else {
            console.warn("Nenhuma emoção retornada pela API.");
        }
    })
    .catch(error => {
        console.error("Erro ao enviar a imagem ou processar resposta:", error);
    });
}
}
