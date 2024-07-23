let html5QrcodeScanner;

function startScanning() {
  html5QrcodeScanner = new Html5Qrcode("reader");
  html5QrcodeScanner.start(
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
    }
  ).catch(err => {
    console.error("Error starting the scanner: ", err);
  });
}

function stopScanning() {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.stop().then(ignore => {
      html5QrcodeScanner.clear();
    }).catch(err => {
      console.error("Error stopping the scanner: ", err);
    });
  }
}

window.addEventListener('load', (e) => {
  startScanning();
});
