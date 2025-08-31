# URL Shortener

A fast and reliable URL shortening service built with TypeScript, Express, MongoDB, and Redis.

## Features

- 🔗 Shorten long URLs with custom short codes
- ⚡ Fast redirects with Redis caching
- 📊 Built-in logging and error handling
- 🛡️ Input validation with Zod
- 🔄 tRPC API support
- 📱 RESTful API endpoints

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (with Mongoose)
- **Cache**: Redis
- **API**: tRPC + REST
- **Validation**: Zod
- **Logging**: Winston

## Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd url-shortner
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:

   ```env
   PORT=3001
   MONGO_URI=mongodb://localhost:27017/urlshortener
   REDIS_URL=redis://localhost:6379
   REDIS_SHORTNER_KEY=url_shortner_counter
   BASE_URL=http://localhost:3001
   ```

4. **Start MongoDB and Redis**

   ```bash
   # MongoDB
   mongod

   # Redis
   redis-server
   ```

5. **Run the application**

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Usage

### Create Short URL

```bash
# Using tRPC
POST /trpc/url.create
{
  "originalUrl": "https://example.com/very-long-url"
}

# Response
{
  "shortUrl": "abc123",
  "originalUrl": "https://example.com/very-long-url"
}
```

### Access Short URL

```bash
# Redirect to original URL
GET /:shortUrl
```

### Get Original URL

```bash
# Using tRPC
GET /trpc/url.getOriginalUrl?input={"shortUrl":"abc123"}
```

## Project Structure

```bash
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── models/          # Database models
├── repositories/    # Data access layer
├── services/        # Business logic
├── routers/         # API routes (REST & tRPC)
├── utils/           # Utility functions
├── validators/      # Input validation
└── middlewares/     # Express middlewares
```

## License

ISC
