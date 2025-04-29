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
        const photoBase64Array = [];
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
                            photoBase64Array.push(photoBase64); // Adiciona a foto ao array

                            photoCount++;
                            setTimeout(capturePhoto, 500); // Captura nova foto a cada 500ms
                        } else {
                            stream.getTracks().forEach((track) => track.stop());
                            console.log("Captura concluída!");

                            // Envia todas as fotos para a API
                            sendToAPI(photoBase64Array).then((emotionResults) => {
                                const total = emotionResults.length;
                                const positiveCount = emotionResults.filter(val => val === 0).length;
                                const negativeCount = total - positiveCount;

                                const finalEmotion = positiveCount >= negativeCount ? "Positivo" : "Negativo";
                                console.log(`Resultado final: ${finalEmotion}`);

                                if (callback) callback(finalEmotion); // Chama o callback com a emoção final
                            });
                        }
                    };

                    capturePhoto();
                };
            })
            .catch((error) => {
                console.error("Erro ao acessar a câmera:", error);
            });
    };

    const sendToAPI = (base64ImagesArray) => {
        const url = "http://127.0.0.1:5000/api/analyze_emotion"; // URL fornecida

        const payload = {
            images: base64ImagesArray, // Envia o array de imagens
            fileNamePrefix: `foto_${Date.now()}`
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
            if (data && Array.isArray(data.emotions)) {
                // Retorna as emoções como array
                return data.emotions.map(emotion => Number(emotion)); // Converte para números (0 ou 1)
            } else {
                console.warn("Nenhuma emoção retornada pela API.");
                return [];
            }
        })
        .catch(error => {
            console.error("Erro ao enviar as imagens ou processar resposta:", error);
            return [];
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