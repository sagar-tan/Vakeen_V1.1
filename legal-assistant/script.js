document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatHistory = document.getElementById('chat-history');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const sidebarBtns = document.querySelectorAll('.sidebar-btn');
    
    // API endpoint - make it dynamic based on current window location
    const BASE_URL = window.location.origin;
    const API_URL = `${BASE_URL}/api/query`;
    
    // Current active mode
    let currentMode = 'custom-query';

    // Initialize
    initializeApp();

    function initializeApp() {
        // Set event listeners
        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleUserMessage();
            }
        });

        sendBtn.addEventListener('click', handleUserMessage);

        // Sidebar button events
        sidebarBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                sidebarBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Set current mode based on button id
                currentMode = btn.id.replace('-btn', '');
                
                // Handle mode change
                handleModeChange(currentMode);
            });
        });

        // Set Custom Query as the default active mode
        document.getElementById('custom-query-btn').classList.add('active');
    }

    function handleModeChange(mode) {
        // Clear chat history
        clearChatHistory();
        
        // Add appropriate welcome message based on mode
        let welcomeMessage = '';
        switch(mode) {
            case 'new-chat':
                welcomeMessage = "What legal assistance do you need today?";
                break;
            case 'history':
                welcomeMessage = "Here are your previous conversations:";
                fetchChatHistory();
                return; // Skip adding a welcome message, as the history will be fetched
            case 'create-docs':
                welcomeMessage = "What type of legal document would you like to create?";
                break;
            case 'analyse-docs':
                welcomeMessage = "Please upload or describe the legal document you'd like me to analyze.";
                break;
            case 'custom-query':
                welcomeMessage = "Feel free to ask me any legal question, and I'll do my best to assist you.";
                break;
            default:
                welcomeMessage = "How can I assist you with your legal needs today?";
        }
        
        // Add assistant message
        addAssistantMessage(welcomeMessage);
    }

    function handleUserMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addUserMessage(message);
        
        // Clear input
        userInput.value = '';
        
        // Process query based on current mode
        processQuery(message, currentMode);
    }

    function processQuery(message, mode) {
        // Show typing indicator
        showTypingIndicator();
        
        // Make API request to the backend
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: message, mode: mode })
        })
        .then(response => response.json())
        .then(data => {
            // Remove typing indicator
            removeTypingIndicator();
            
            // Handle the response based on the mode
            if (mode === 'history') {
                displayChatHistoryList(data.response);
            } else {
                // Add assistant message
                addAssistantMessage(data.response);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            removeTypingIndicator();
            addAssistantMessage("I'm sorry, there was an error processing your request. Please ensure the server is running and try again.");
        });
    }

    function fetchChatHistory() {
        // Show typing indicator
        showTypingIndicator();
        
        // Make API request to fetch chat history
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mode: 'history' })
        })
        .then(response => response.json())
        .then(data => {
            // Remove typing indicator
            removeTypingIndicator();
            
            // Display chat history
            if (data.response && data.response.history) {
                displayChatHistoryList(data.response);
            } else {
                addAssistantMessage("No chat history found.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            removeTypingIndicator();
            addAssistantMessage("I'm sorry, there was an error connecting to the server. Please ensure the server is running at " + BASE_URL);
        });
    }

    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', 'user');
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${formatMessage(message)}</p>
            </div>
        `;
        chatHistory.appendChild(messageElement);
        scrollToBottom();
    }

    function addAssistantMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', 'assistant');
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${formatMessage(message)}</p>
            </div>
        `;
        chatHistory.appendChild(messageElement);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('chat-message', 'assistant', 'typing-indicator');
        typingIndicator.innerHTML = `
            <div class="message-content">
                <p>Typing<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></p>
            </div>
        `;
        chatHistory.appendChild(typingIndicator);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    function clearChatHistory() {
        chatHistory.innerHTML = '';
    }

    function displayChatHistoryList(data) {
        // Create history items
        const historyHTML = data.history.map(item => 
            `<div class="history-item" data-id="${item.id}">
                <p><strong>${item.date}</strong>: ${item.topic}</p>
            </div>`
        ).join('');
        
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', 'assistant');
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${data.message}</p>
                <div class="history-list">
                    ${historyHTML}
                </div>
            </div>
        `;
        chatHistory.appendChild(messageElement);
        
        // Add event listeners to history items
        const historyItems = document.querySelectorAll('.history-item');
        historyItems.forEach(item => {
            item.addEventListener('click', () => {
                const id = item.getAttribute('data-id');
                // In a real app, you would fetch the conversation with this ID
                clearChatHistory();
                addAssistantMessage(`You selected conversation #${id}. In a real application, this would load the specific conversation.`);
            });
        });
        
        scrollToBottom();
    }

    function formatMessage(message) {
        // Replace line breaks with <br> tags
        return typeof message === 'string' ? message.replace(/\n/g, '<br>') : message;
    }

    function scrollToBottom() {
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
}); 