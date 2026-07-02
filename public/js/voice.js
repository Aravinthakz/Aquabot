document.addEventListener("DOMContentLoaded", () => {
  const micBtn = document.getElementById("micBtn");
  const chatInput = document.getElementById("chatInput");

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let listening = false;
  let voiceReplyEnabled = false;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      listening = true;
      micBtn.classList.add("listening");
      voiceReplyEnabled = true;
    };
    recognition.onend = () => {
      listening = false;
      micBtn.classList.remove("listening");
    };
    recognition.onerror = () => {
      listening = false;
      micBtn.classList.remove("listening");
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      chatInput.value = transcript;
      window.AquaChat.sendMessage(transcript);
    };

    micBtn.addEventListener("click", () => {
      if (listening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    });
  } else {
    micBtn.style.display = "none";
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    const clean = text.replace(/\*\*/g, "").replace(/[•]/g, "");
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = "en-IN";
    utter.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  window.AquaVoice = {
    speak,
    speakEnabled: () => voiceReplyEnabled
  };
});
