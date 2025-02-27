 let mediaRecorder;
    let audioChunks = [];
    
    // Voice Recording
    async function startRecording() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      
      mediaRecorder.ondataavailable = e => {
        audioChunks.push(e.data);
      }
    }
    
    function stopRecording() {
      mediaRecorder.stop();
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        document.getElementById('audioPreview').src = audioUrl;
        
        // Convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          document.getElementById('voiceInput').value = reader.result;
        }
      }
    }

    // Photo Handling
    document.getElementById('fotoInput').addEventListener('change', function(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        document.getElementById('fotoHidden').value = reader.result;
      }
    });

    // Form Submission
   document.getElementById('myForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const sayang = this.sayang.value;
  const kekurangan = this.kekurangan.value;
  const kesan = this.kesan.value;
  const voiceFile = this.voice.files[0];
  const fotoFile = this.foto.files[0];

  if (!voiceFile || !fotoFile) {
    alert('Please select both voice and photo files.');
    return;
  }

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  try {
    const voiceBase64 = await getBase64(voiceFile);
    const fotoBase64 = await getBase64(fotoFile);

    const formData = {
      sayang,
      kekurangan,
      kesan,
      voice: voiceBase64,
      foto: fotoBase64
    };

    const response = await fetch('https://script.google.com/macros/s/AKfycbw5Qcq-_DG4COxn1JDP1SIgIjhHx6QgXJ9vPkd4wp2N-NwqtJyKNG_1NACiy2h8VKvN-w/exec', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      alert('Data berhasil dikirim!');
      this.reset();
    } else {
      alert('Failed to send data.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while sending data.');
  }
});