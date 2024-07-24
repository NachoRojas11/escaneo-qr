window.addEventListener('load', async () => {
    const lectorCodigo = new ZXing.BrowserMultiFormatReader(); // Utilizamos BrowserMultiFormatReader para soportar múltiples formatos
    const elementoVistaPrevia = document.getElementById('vista-previa');
    const elementoResultado = document.getElementById('resultado');
    const selectDispositivos = document.getElementById('dispositivos-entrada-video');

    async function obtenerDispositivosEntradaVideo() {
        try {
            // Obtener todos los dispositivos de medios disponibles
            const dispositivos = await navigator.mediaDevices.enumerateDevices();
            
            // Filtrar solo los dispositivos de entrada de video
            const dispositivosEntradaVideo = dispositivos.filter(dispositivo => dispositivo.kind === 'videoinput');
            
            // Agregar las opciones de dispositivos al select
            selectDispositivos.innerHTML = ''; // Limpiar las opciones previas
            dispositivosEntradaVideo.forEach((dispositivo, indice) => {
                const option = document.createElement('option');
                option.value = dispositivo.deviceId;
                option.text = dispositivo.label || `Cámara ${indice + 1}`;
                selectDispositivos.appendChild(option);
            });

            // Iniciar escaneo con el primer dispositivo disponible por defecto
            if (dispositivosEntradaVideo.length > 0) {
                iniciarEscaneo(dispositivosEntradaVideo[0].deviceId);
            }
        } catch (error) {
            console.error('Error al enumerar dispositivos:', error);
        }
    }

    async function iniciarEscaneo(deviceId) {
        lectorCodigo.reset();
        try {
            await lectorCodigo.decodeFromVideoDevice(deviceId, 'vista-previa', (resultado, error) => {
                if (resultado) {
                    if (resultado.text.startsWith('http')) {
                        window.location.href = resultado.text;
                    } else if (/^\d+$/.test(resultado.text)) { // Verificar si el contenido es numérico
                        elementoResultado.textContent = `Código de barras: ${resultado.text}`;
                    } else {
                        elementoResultado.textContent = `Contenido: ${resultado.text}`;
                    }
                }
                if (error && !(error instanceof ZXing.NotFoundException)) {
                    console.error(error);
                }
            });
        } catch (error) {
            console.error('Error al iniciar el escaneo:', error);
        }
    }

    // Solicitar permiso para acceder a la cámara
    try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        await obtenerDispositivosEntradaVideo();
    } catch (error) {
        console.error('Error al obtener permisos de la cámara:', error);
    }

    // Manejar el cambio de selección de dispositivo
    selectDispositivos.addEventListener('change', (event) => {
        const deviceId = event.target.value;
        iniciarEscaneo(deviceId);
    });
});
