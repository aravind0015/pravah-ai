```mermaid

erDiagram
    USER {
        string id PK
        string email
        datetime createdAt
    }

    CONVERSATION {
        string id PK
        string userId FK
        datetime createdAt
    }

    MESSAGE {
        string id PK
        string conversationId FK
        enum role
        string content
        datetime createdAt
    }

    ORDER {
        string id PK
        string userId FK
        string status
        float total
        datetime createdAt
    }

    PAYMENT {
        string id PK
        string orderId FK
        string status
        float amount
        datetime createdAt
    }

    INVOICE {
        string id PK
        string paymentId FK
        string url
        datetime createdAt
    }

    USER ||--o{ CONVERSATION : has
    CONVERSATION ||--o{ MESSAGE : contains

    USER ||--o{ ORDER : places
    ORDER ||--o{ PAYMENT : has
    PAYMENT ||--|| INVOICE : generates
