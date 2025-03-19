document.addEventListener('DOMContentLoaded', () => {
    function getJwtToken() {
        return localStorage.getItem("jwt_token");
    }

    function logoutUser() {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    }

    function checkSecurityCode() {
        const jwt = getJwtToken();
        if (!jwt) {
            logoutUser();
            return;
        }
        fetch("/api/v1/check-session", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + jwt,
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (response.status === 401) {
                    logoutUser();
                    return null;
                }
                return response.json();
            })
            .then(data => {
                if (data && !data.verified) {
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
            .then(response => {
                if (response.status === 401) {
                    logoutUser();
                    return null;
                }
                return response.json();
            })
            .then(data => {
                if (data && data.status === "Security code verified") {
                    closeSecurityModal();
                } else {
                    alert("Invalid security code");
                }
            })
            .catch(error => console.error("Verification error:", error));
    }

    function closeSecurityModal() {
        const modal = document.getElementById("security-modal");
        if (modal) {
            modal.remove();
            document.body.classList.remove("modal-active");
        }
    }

    // Chat funkcjonalność
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
    const sampleUsers = [
        { id: "e6a95b24-5e2e-4af4-a01d-2c3b6a3e9b8f", name: "kasienka1989", avatar: "123e4567-e89b-12d3-a456-426614174000.jpg" },
        { id: "f7c8d9e0-1234-5678-9abc-def123456789", name: "olek_1234", avatar: "" },
        { id: "a1b2c3d4-e5f6-7890-abcd-ef0123456789", name: "testuser", avatar: "223e4567-e89b-12d3-a456-426614174001.png" }
    ];

    // const socket = new WebSocket('wss://example.com/api/v1/conversations');
    // socket.addEventListener('open', () => {
    //     console.log("WebSocket connected");
    // });
    // socket.addEventListener('message', (event) => {
    //     try {
    //         const msg = JSON.parse(event.data);
    //         if (msg.chatId === currentChatId && msg.sender === 'received') {
    //             appendMessage(msg);
    //         }
    //     } catch (e) {
    //         console.error("Error parsing WebSocket message", e);
    //     }
    // });

    function sendMessage(chatId, message) {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ chatId, message }));
            appendMessage({ sender: 'sent', content: message, time: new Date().toLocaleTimeString() });
            chatInput.value = '';
        } else {
            console.error("WebSocket not open");
        }
    }

    async function loadChats() {
        // try {
        //     const response = await fetch('/api/v1/conversations');
        //     if (!response.ok) throw new Error('Network response was not ok');
        //     const data = await response.json();
        //     renderChatList(data);
        // } catch (error) {
        //     console.error('Error loading conversations:', error);
        // }
    }

    async function searchChats(query) {
        // try {
        //     const response = await fetch(`/api/v1/conversations/search?query=${encodeURIComponent(query)}`);
        //     if (!response.ok) throw new Error('Network response was not ok');
        //     const data = await response.json();
        //     renderChatList(data);
        // } catch (error) {
        //     console.error('Error searching conversations:', error);
        // }
    }

    async function loadConversation(chatId) {
        // try {
        //     const response = await fetch(`/api/v1/conversations/${chatId}`);
        //     if (!response.ok) throw new Error('Network response was not ok');
        //     const data = await response.json();
        //     renderConversation(data);
        // } catch (error) {
        //     console.error('Error loading conversation:', error);
        // }
    }

    function renderChatList(chats) {
        chatItemsContainer.innerHTML = '';
        chatTabsContainer.innerHTML = '';
        chats.forEach(chat => {
            const li = document.createElement('li');
            li.classList.add('chat-item', chat.type === 'group' ? 'group' : 'private');
            li.dataset.chatId = chat.id;
            const avatarDiv = document.createElement('div');
            avatarDiv.classList.add('chat-avatar');
            if (chat.type === 'group') {
                avatarDiv.classList.add('group-icon');
                avatarDiv.textContent = '👥';
            } else {
                if (chat.avatar) {
                    const img = document.createElement('img');
                    img.src = `/users/avatar/${chat.avatar}`;
                    img.alt = 'Avatar';
                    img.onerror = function() {
                        this.parentNode.textContent = '👤';
                    };
                    avatarDiv.appendChild(img);
                } else {
                    avatarDiv.textContent = '👤';
                }
            }
            const infoDiv = document.createElement('div');
            infoDiv.classList.add('chat-info');
            const nameSpan = document.createElement('span');
            nameSpan.classList.add('chat-name');
            nameSpan.textContent = chat.name;
            const lastSpan = document.createElement('span');
            lastSpan.classList.add('chat-last');
            lastSpan.textContent = chat.last_message || '';
            infoDiv.appendChild(nameSpan);
            infoDiv.appendChild(lastSpan);
            li.appendChild(avatarDiv);
            li.appendChild(infoDiv);
            li.addEventListener('click', () => {
                currentChatId = chat.id;
                loadConversation(chat.id);
                setActiveChatTab(chat);
            });
            chatItemsContainer.appendChild(li);

            const tab = document.createElement('li');
            tab.classList.add('chat-tab');
            tab.dataset.chatId = chat.id;
            tab.textContent = chat.name;
            tab.addEventListener('click', () => {
                currentChatId = chat.id;
                loadConversation(chat.id);
                setActiveChatTab(chat);
            });
            chatTabsContainer.appendChild(tab);
        });
        if (chats.length > 0 && !currentChatId) {
            currentChatId = chats[0].id;
            loadConversation(currentChatId);
            setActiveChatTab(chats[0]);
        }
    }

    function renderConversation(conversation) {
        chatMessagesContainer.innerHTML = '';
        conversation.messages.forEach(msg => appendMessage(msg));
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

    userSearchInput.addEventListener('input', () => {
        const query = userSearchInput.value.trim().toLowerCase();
        if (query.length >= 3) {
            renderAutocomplete(query);
        } else {
            autocompleteResults.innerHTML = '';
            autocompleteResults.style.display = 'none';
            loadChats();
        }
    });

    function renderAutocomplete(query) {
        autocompleteResults.innerHTML = '';
        const filtered = sampleUsers.filter(user => user.name.toLowerCase().includes(query));
        autocompleteResults.style.display = filtered.length > 0 ? 'block' : 'none';
        filtered.forEach(user => {
            const div = document.createElement('div');
            div.classList.add('autocomplete-item');
            if (user.avatar) {
                const img = document.createElement('img');
                img.src = `/users/avatar/${user.avatar}`;
                img.alt = 'Avatar';
                img.onerror = function() {
                    const defaultIcon = document.createElement('span');
                    defaultIcon.textContent = '👤';
                    this.replaceWith(defaultIcon);
                };
                div.appendChild(img);
            } else {
                const spanIcon = document.createElement('span');
                spanIcon.textContent = '👤';
                div.appendChild(spanIcon);
            }
            const span = document.createElement('span');
            span.textContent = user.name;
            div.appendChild(span);

            div.addEventListener('click', () => {
                currentChatId = user.id;
                loadConversation(user.id);
                setActiveChatTab(user);
                autocompleteResults.innerHTML = '';
                autocompleteResults.style.display = 'none';
                userSearchInput.value = '';
            });
            autocompleteResults.appendChild(div);
        });
    }

    document.addEventListener('click', (e) => {
        if (!userSearchInput.contains(e.target) && !autocompleteResults.contains(e.target)) {
            autocompleteResults.innerHTML = '';
            autocompleteResults.style.display = 'none';
        }
    });

    chatSortSelect.addEventListener('change', () => {
        // const sortBy = chatSortSelect.value;
        // fetch(`/api/v1/conversations?sort=${sortBy}`)
        //     .then(response => response.json())
        //     .then(data => renderChatList(data))
        //     .catch(error => console.error('Error sorting conversations:', error));
    });

    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        const maxHeight = 80;
        chatInput.style.height = Math.min(chatInput.scrollHeight, maxHeight) + 'px';
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (currentChatId && chatInput.value.trim().length > 0) {
                sendMessage(currentChatId, chatInput.value.trim());
            }
        }
    });

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

    loadChats();
    checkSecurityCode();
});
