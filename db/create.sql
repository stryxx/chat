SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE TABLE users
(
    id                    CHAR(36) PRIMARY KEY,
    email                 VARCHAR(255) NOT NULL UNIQUE,
    username              VARCHAR(50)  NOT NULL UNIQUE,
    password              TEXT         NOT NULL,
    public_key            TEXT         NOT NULL,
    encrypted_private_key TEXT         NOT NULL,
    encrypted_master_key  TEXT         NOT NULL,
    created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversations
(
    id         CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    type       ENUM ('private', 'group') NOT NULL,
    created_at TIMESTAMP            DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversation_members
(
    conversation_id            CHAR(36) NOT NULL,
    user_id                    CHAR(36) NOT NULL,
    encrypted_conversation_key TEXT     NOT NULL,

    PRIMARY KEY (conversation_id, user_id),
    FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE messages
(
    id                    CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    conversation_id       CHAR(36) NOT NULL,
    sender_id             CHAR(36) NOT NULL,
    encrypted_message     TEXT     NOT NULL,
    encrypted_message_key TEXT     NOT NULL,
    created_at            TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE user_keys
(
    id         CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id    CHAR(36) NOT NULL,
    public_key TEXT     NOT NULL,
    created_at TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
