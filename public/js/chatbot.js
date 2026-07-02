document.addEventListener("DOMContentLoaded", () => {
  const chatWindow = document.getElementById("chatWindow");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const depthFill = document.getElementById("depthGaugeFill");
  const chips = document.querySelectorAll(".chip");

  function addMessage(text, sender) {
    const div = document.createElement("div");
    div.className = `msg ${sender}`;
    const label = document.createElement("span");
    label.className = "msg-label";
    label.textContent = sender === "bot" ? "AquaBot" : "You";
    div.appendChild(label);
    div.appendChild(document.createTextNode(text));
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return div;
  }

  async function sendMessage(text) {
    if (!text.trim()) return;
    addMessage(text, "user");
    chatInput.value = "";

    const thinking = addMessage("…", "bot");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      thinking.lastChild.textContent = data.reply;

      if (data.district) {
        animateGauge(data.district);
      }

      if (window.AquaVoice && window.AquaVoice.speakEnabled()) {
        window.AquaVoice.speak(data.reply);
      }
    } catch (err) {
      thinking.lastChild.textContent = "Connection error — is the AquaBot server running?";
    }
  }

  async function animateGauge(districtId) {
    try {
      const res = await fetch(`/api/districts/${districtId}`);
      const data = await res.json();
      const pct = Math.min(100, Math.round((data.district.depthToWaterM / 20) * 100));
      depthFill.style.height = `${100 - pct}%`;
      depthFill.style.background = data.meta.color;
    } catch (e) { /* non-critical */ }
  }

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage(chatInput.value);
  });

  chips.forEach(chip => {
    chip.addEventListener("click", () => sendMessage(chip.dataset.q));
  });

  window.AquaChat = { sendMessage, addMessage };
});
