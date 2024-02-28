const chat = document.getElementById("chat");
const userInput = document.getElementById("user-input");
const API_KEY = "your API KEY";

async function sendMessage() {
  const userMessage = userInput.value.trim();
  if (userMessage === "") return;

  appendMessage("user", userMessage);
  await getBotResponse([{ role: "user", content: userMessage }]);
  userInput.value = "";
}

function appendMessage(sender, message) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add(`${sender}-message`);
  console.log("Message:", message);
  const code = message.replace(
    /```([\s\S]+?)```/g,
    '<div><pre><code class="code-green">$1</code></pre></div>'
  );
  const preElement = document.createElement("pre");
  const codeElement = document.createElement("code");

  codeElement.classList.add("code-green");
  codeElement.textContent = code;

  preElement.appendChild(codeElement);
  messageDiv.appendChild(preElement);

  chat.appendChild(messageDiv);
  chat.scrollTop = chat.scrollHeight;
}

async function getBotResponse(userMessages) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: "gpt-3.5-turbo", messages: userMessages }),
  });

  if (!response.ok) {
    console.error("Error:", response.status);
    return;
  }

  const responseData = await response.json();
  console.log(responseData);

  if (responseData.choices && responseData.choices.length > 0) {
    const botMessage = responseData.choices[0].message.content;
    appendMessage("bot", botMessage);
  } else {
    console.error("No response from the bot");
  }
}
document
  .querySelector(".chat-container")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    document.querySelector("#user-input").value = "";
  });
