```mermaid
flowchart TD
    U[User] -->|Message| FE[React Frontend]

    FE -->|POST /api/chat/messages/stream| HC[Hono Controller]

    HC --> CS[Chat Service]

    CS --> R[Router Agent]
    R --> D{Agent Decision}

    D -->|Support| SA[Support Agent]
    D -->|Order| OA[Order Agent]
    D -->|Billing| BA[Billing Agent]

    SA --> ST[Support Tools]
    OA --> OT[Order Tools]
    BA --> BT[Billing Tools]

    ST --> DB[(PostgreSQL)]
    OT --> DB
    BT --> DB

    DB --> ST
    DB --> OT
    DB --> BT

    ST --> SA
    OT --> OA
    BT --> BA

    SA --> CS
    OA --> CS
    BA --> CS

    CS --> LLM[LLM Renderer]

    LLM -->|Token Stream| HC
    HC -->|Streaming Response| FE

    FE -->|Render Tokens| U
