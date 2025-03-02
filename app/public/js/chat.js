document.addEventListener('DOMContentLoaded', () => {
    const chatItemsContainer = document.querySelector('.chat-items');
    const chatTabsContainer = document.getElementById('chat-tabs');
    const chatMessagesContainer = document.getElementById('chat-messages');
    const userSearchInput = document.getElementById('user-search');
    const autocompleteResults = document.getElementById('autocomplete-results');
    const chatSortSelect = document.getElementById('chat-sort');
    const chatInput = document.getElementById('chat-input');
    const menuToggle = document.getElementById('menu-toggle');
    const chatMenuContent = document.querySelector('.chat-menu .menu-content');
    const logoutBtn = document.getElementById('logout-btn');
    const settingsBtn = document.getElementById('settings-btn');

    let currentChatId = null;
    const socket = new WebSocket('wss://example.com/api/v1/conversations');

    socket.addEventListener('open', () => {
        console.log("WebSocket connected");
    });

    socket.addEventListener('message', (event) => {
        try {
            const msg = JSON.parse(event.data);
            if (msg.chatId === currentChatId && msg.sender === 'received') {
                appendMessage(msg);
            }
        } catch (e) {
            console.error("Error parsing WebSocket message", e);
        }
    });

    function getJwtToken() {
        return localStorage.getItem("jwt_token");
    }

    function sendMessage(chatId, message) {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ chatId, message }));
            appendMessage({ sender: 'sent', content: message, time: new Date().toLocaleTimeString() });
            chatInput.value = '';
        } else {
            console.error("WebSocket not open");
        }
    }

    function appendMessage(msg) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', msg.sender === 'sent' ? 'sent' : 'received');
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        contentDiv.textContent = msg.content;
        const timeDiv = document.createElement('div');
        timeDiv.classList.add('message-time');
        timeDiv.textContent = msg.time;
        msgDiv.appendChild(contentDiv);
        msgDiv.appendChild(timeDiv);
        chatMessagesContainer.appendChild(msgDiv);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    function setActiveChatTab(chat) {
        const tabs = document.querySelectorAll('.chat-tab');
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.chatId === chat.id.toString());
        });
    }

    function checkSecurityCode() {
        const jwt = getJwtToken();
        if (!jwt) {
            alert("Session expired. Please log in again.");
            window.location.href = "/login";
            return;
        }

        fetch("/api/v1/check-session", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + jwt,
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (!data.verified) {
                    showSecurityModal();
                }
            })
            .catch(error => console.error("Error checking session:", error));
    }

    function showSecurityModal() {
        const modal = document.createElement("div");
        modal.id = "security-modal";
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <h2>Security Code Required</h2>
                <p>Enter your PIN or security code to access the chat.</p>
                <input type="password" id="security-code" placeholder="Enter code" maxlength="10" autofocus>
                <button id="verify-btn">Verify</button>
            </div>
        `;
        document.body.appendChild(modal);
        document.body.classList.add("modal-active");

        document.getElementById("verify-btn").addEventListener("click", verifySecurityCode);
        document.getElementById("security-code").addEventListener("keypress", (e) => {
            if (e.key === "Enter") verifySecurityCode();
        });
    }

    function verifySecurityCode() {
        const code = document.getElementById("security-code").value;
        if (!code) return;

        fetch("/api/v1/verify-pin", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + getJwtToken(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ security_code: code })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "Security code verified") {
                    closeSecurityModal();
                } else {
                    alert("Invalid security code");
                }
            })
            .catch(error => console.error("Verification error:", error));
    }

    function closeSecurityModal() {
        document.getElementById("security-modal").remove();
        document.body.classList.remove("modal-active");
    }

    menuToggle.addEventListener('click', () => {
        chatMenuContent.classList.toggle('visible');
    });

    logoutBtn.addEventListener('click', () => {
        alert('Wylogowano');
        localStorage.removeItem("jwt_token");
        window.location.href = "/login";
    });

    settingsBtn.addEventListener('click', () => {
        alert('Otwieranie ustawień');
    });

    checkSecurityCode();
});
