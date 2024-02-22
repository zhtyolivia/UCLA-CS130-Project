
# Backend File Structure

```
/backend
  /node_modules
  /src
    /api
      /controllers
      /middlewares
      /routes
    /config
    /models
    /services
    /utils
  /tests
  server.js (或 app.js)
  package.json
  .env (或其他环境配置文件)
```

/api: Holds routes, controllers, and middleware. These define how to receive and respond to HTTP requests.
/config: Configuration files and constants, such as database configurations.
/models: Data models or database schema definitions (e.g., using Mongoose to define MongoDB schemas).
/services: The business logic layer, usually containing code that interacts with the database.
/utils: Utility functions, such as date processing, encryption tools, etc.
/tests: Contains test scripts.
server.js or app.js: The application entry file, configuring the server and middleware.
