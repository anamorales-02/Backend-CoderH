const socket = io();

let currentUser = "";

async function initializeChat() {
  const { value: username } = await Swal.fire({
    title: "Welcome to the Chat",
    input: "text",
    inputLabel: "Choose a Username",
    inputValue: "",
    showCancelButton: false,
    inputValidator: (value) => {
      if (!value) {
        return "Please enter a valid username.";
      }
    },
  });

  if (username) {
    currentUser = username;
    Swal.fire(`Your username is set to: ${currentUser}`);
  } else {
    Swal.fire(`You didn't enter a username.`);
  }
}

initializeChat();

const chatInput = document.getElementById("chat-input");
const messageContainer = document.getElementById("message-container");

chatInput.addEventListener("keyup", ({ key }) => {
  if (key === "Enter") {
    const messageText = chatInput.value;
    if (messageText.trim() !== "") {
      const message = { text: messageText, user: currentUser };
      socket.emit("newMessage", message);
      chatInput.value = "";
    }
  }
});

socket.on("messageHistory", (messages) => {
  let messagesHTML = "";

  messages.forEach((message) => {
    messagesHTML += `
      <div class="message">
        <b>${message.user}:</b><br>${message.text}<br>
      </div>`;
  });

  messageContainer.innerHTML = messagesHTML;
});
