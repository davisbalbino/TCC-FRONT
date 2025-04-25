import { MainMenu } from "./components/mainMenu/mainMenu.js";
import { RightContent } from "./components/rightContent/rightContent.js";
import { LeftMenu } from "./components/leftMenu/leftMenu.js";
import { Footer } from "./components/footer/footer.js";

document.addEventListener('DOMContentLoaded', () => {
    const mainMenu = new MainMenu();
    const rightContent = new RightContent();
    const leftMenu = new LeftMenu();
    const footer = new Footer();

    // Função para capturar fotos e processar emoções
    const capturePhotos = (quantity, callback) => {
        const emotionResults = [];
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
    
                            // Envia a imagem para API
                            sendToAPI(photoBase64).then((emotion) => {
                                emotionResults.push(emotion);
                            });
    
                            photoCount++;
                            setTimeout(capturePhoto, 500); // Captura nova foto a cada 500ms
                        } else {
                            stream.getTracks().forEach((track) => track.stop());
                            console.log("Captura concluída!");
    
                            // Processa os resultados após captura
                            const total = emotionResults.length;
                            const positiveCount = emotionResults.filter(val => val === 0).length;
                            const negativeCount = total - positiveCount;
    
                            const finalEmotion = positiveCount >= negativeCount ? "Positivo" : "Negativo";
                            console.log(`Resultado final: ${finalEmotion}`);
    
                            if (callback) callback(finalEmotion); // Chama o callback com a emoção
                        }
                    };
    
                    capturePhoto();
                };
            })
            .catch((error) => {
                console.error("Erro ao acessar a câmera:", error);
            });
    };
    
    const sendToAPI = (base64Image) => {
        const url = "http://127.0.0.1:5000/api/analyze_emotion"; // URL fornecida
    
        const payload = {
            image: base64Image,
            fileName: `foto_${Date.now()}.png`
        };
    
        return fetch(url, {
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
                // Retorna a emoção como número (0 ou 1)
                return Number(data.emotion);
            } else {
                console.warn("Nenhuma emoção retornada pela API.");
                return null;
            }
        })
        .catch(error => {
            console.error("Erro ao enviar a imagem ou processar resposta:", error);
            return null;
        });
    };

    // Evento de clique global para capturar emoções nas divs principais
    document.addEventListener('click', (event) => {
        const clickedElement = event.target;
        const parentSection = clickedElement.closest('section'); // Verifica a div principal

        if (parentSection) {
            const sectionId = parentSection.id;
            console.log(`Interagindo com: ${sectionId}`);

            // Captura fotos e processa emoções
            capturePhotos(15, (emotionValue) => {
                if (sectionId === 'top-content') {
                    console.log(`Emoção no MainMenu: ${emotionValue}`);
                    mainMenu.updateEmotionResult(emotionValue);
                } else if (sectionId === 'right-content') {
                    console.log(`Emoção no RightContent: ${emotionValue}`);
                    rightContent.updateEmotionResult(emotionValue);
                } else if (sectionId === 'left-content') {
                    console.log(`Emoção no LeftMenu: ${emotionValue}`);
                    leftMenu.updateEmotionResult(emotionValue);
                } else if (sectionId === 'bottom-content') {
                    console.log(`Emoção no Footer: ${emotionValue}`);
                    footer.updateEmotionResult(emotionValue);
                }
            });
        }
    });
});