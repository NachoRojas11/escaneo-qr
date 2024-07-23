let html5QrCode;

document.getElementById("start-button").addEventListener("click", () => {
  startScanning();
});

document.getElementById("stop-button").addEventListener("click", () => {
  stopScanning();
});

function startScanning() {
  html5QrCode = new Html5Qrcode("reader");
  html5QrCode.start(
    { facingMode: "environment" },
    {
      fps: 10, // Sets the framerate to 10 frames per second
      qrbox: { width: 250, height: 250 } // Sets the dimensions of the scanning box
    },
    qrCodeMessage => {
      Swal.fire("Código QR escaneado!", qrCodeMessage, "success");
      stopScanning();
    },
    errorMessage => {
      // Parse error, ignore it
      console.error("QR Code no detectado: ", errorMessage);
    }
  ).catch(err => {
    console.error("Error al iniciar el escáner: ", err);
  });
}

function stopScanning() {
  if (html5QrCode) {
    html5QrCode.stop().then(ignore => {
      html5QrCode.clear();
    }).catch(err => {
      console.error("Error al detener el escáner: ", err);
    });
  }
}
