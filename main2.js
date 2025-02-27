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
      
      const formData = {
        sayang: this.sayang.value,
        kekurangan: this.kekurangan.value,
        kesan: this.kesan.value,
        kata: this.kata.value,
        voice: this.voice.value,
        foto: this.foto.value
      };

      const response = await fetch('https://script.google.com/macros/s/AKfycbw5Qcq-_DG4COxn1JDP1SIgIjhHx6QgXJ9vPkd4wp2N-NwqtJyKNG_1NACiy2h8VKvN-w/exec', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      if(response.ok) {
        alert('Data berhasil dikirim!');
        this.reset();
      }
    });