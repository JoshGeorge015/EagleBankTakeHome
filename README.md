# EagleBankTakeHome

EagleBankTakeHome is a Node.js/Express backend for a simple banking application. It provides RESTful APIs for user management, account operations, and transaction processing, with JWT-based authentication and MongoDB for data storage.

## Features
- User registration, login, and profile management
- Account creation, retrieval, update, and deletion
- Transaction creation and history
- JWT authentication and authorization
- Unit and integration tests (Jest, Supertest, mongodb-memory-server)
- API documentation (Swagger)

## Project Structure

```
eagle-bank/
  app.js                # Express app setup
  server.js             # Entry point
  controllers/          # Route handlers (User, Account, Transaction)
  models/               # Mongoose models
  routes/               # Express routers
  middleware/           # Custom middleware (auth, error handling)
  test/                 # Unit and integration tests
  ...
```

## Setup

1. **Clone the repo:**
	```sh
	git clone <repo-url>
	cd EagleBankTakeHome/eagle-bank
	```
2. **Install dependencies:**
	```sh
	npm i
	```
3. **Set up environment variables:**
	Create a `.env` file with:
	```env
	MONGO_URI=mongodb://localhost:27017/eaglebank
	JWT_SECRET=INSERTYOURJWTSECRETHERE
	PORT=3000
	```
4. **Run the server:**
	```sh
	npm run start
	```

## API Documentation

Run the Swagger generator:
```sh
node swagger.js
```
Then open `swagger-output.json` with a Swagger UI tool.

## Testing

Run all tests (unit and integration):
```sh
npm test
```
Tests use Jest, Supertest, and mongodb-memory-server for isolated DB testing.

## Architecture

- See `eaglebank_ArchitectureDiagram.png` and `eaglebank_ERDiagram.png` for system and data design.
- Controllers handle business logic, models define schemas, routes map endpoints, and middleware manages auth and errors.
- Models hold the MongooseDb Schemas used, with foriegn keys to facilitate linking between different entities(see `eaglebank_ERDiagram.png`).
- Routes for different methods of the API held within routes folder, with middleware logic to handle authentication.

Addditional Notes
As part of the test, an OpenAPI spec was meant to be provided showcasing the different scenarios. This was inaccessible - see ![Error Message](<Screenshot 2025-08-20 185615.png>). Thus, Swagger Docs and Postman collection were added to demonstrate the API Spec. 
In addition, further improvements to the system include handling account creation to be added to the transaction history as a new transaction, with checks for only one to be allowed per account for audit logging. Another such improvement could be during the setup of an account with a 0 balance or unknown balance, however for the current scenarios it has been assumed to only allow account creation with a min balance greater than 0.

## License

MIT