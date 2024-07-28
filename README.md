# Retail Checkout System

## Overview
The Retail Checkout System is a comprehensive solution designed to manage bills, loyalty cards, and store articles within a retail environment. 

The backend is built using Spring Boot with JPA/Hibernate for database interactions, secured with JWT tokens, and containerized with Docker. 

The frontend is developed using React.

## Endpoints
### Store Articles

GET /store-articles - Retrieves all store articles (Requires cashier:read authority)

GET /store-articles/{serialNumber} - Retrieves a store article by its serial number (Requires cashier:read authority)

### Loyalty Card

PUT /loyalty-card/redeem - Redeems points from a loyalty card (Requires cashier:update authority)

GET /loyalty-card/points - Gets available points on a loyalty card (Requires cashier:read authority)

### Bill

POST /bill - Saves a new bill (Requires cashier:create authority)

GET /bill - Retrieves all bills associated with the current user (Requires cashier:read authority)

GET /bill/{billId} - Retrieves a specific bill by its ID (Requires cashier:read authority)

DELETE /bill/{billId} - Cancels a bill (Requires cashier:delete authority)

POST /bill/{billId}/refund/{articleId} - Refunds a specific article in a bill (Requires cashier:update authority)

### Authentication

POST /auth/authenticate - Authenticates a user with provided credentials

POST /auth/logout - Logs out the currently authenticated user
