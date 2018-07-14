# JWT Basic with Cookies to store tokens and CSRF Protection -

1. Setup
  - create a .env file with the following values:
    1. JWT_SECRET=[pick your secret, doesn't matter]
  - Have mongo running
  - npm i
  - npm start (runs in nodemon dev mode)
  - simple front end [https://localhost:8080](https://localhost:8080) <- Notice HTTPS and not HTTP, this is to be able to use secure cookies only even in dev mode
  - the certs folder is not sensitive data, as this will only be used for local development
  
2. Dev Notes:


3. TODO
  ``` 
  [ ] Find a way to make this reusable / installable from npm
  ```