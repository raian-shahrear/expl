# Exploring World Server

### Technology used:
- To design this project, here is used Modular pattern with some tech like Typescript, Node.js, Express.js, Mongoose, ZOD validator and JWT Authenticator/Authorizer.
- AAmarPay payment system implemented, applicable for verifying user.

### How to start:
1. First install some required npm packages like express, mongoose, typescript, cors, prettier, eslint etc. and then initialize them.
2. Create modules for users/auth, post, category and comments with their interface, model, validation, service, controller and route.
3. To run the server, command is: `npm run start:dev` (development mode) || `npm run start:prod` (production mode)
4. To set the environment by following `.env.example` file.
5. Also follow the package.json file for more info like npm package or commands.

### Live link:
https://exploring-world-server.vercel.app

### Features of the application:
1. Anyone can register as user, default admin will change the role if needed,
2. Valid user can login.
3. Admin can create and update category from the dashboard.
4. Admin can delete post and comment from the dashboard.
5. Admin can update user role also check user status and graph from the dashboard.
6. Anyone or admin can see the post and comment.
7. User can create, update and delete post and comment.
8. User or admin can change password from the dashboard profile.
9. Payment system implemented to verify an user.
10. Validation, Authentication and Authorization are properly used.

### Configuration
1. Create a `.env` file in the root directory of the project.
2. Add necessary configuration variables in the `.env` file.
   Example:
   ```bash
    NODE_ENV=development
    PORT=5000
    DATABASE_URL=mongodb_url
    BCRYPT_SALT_ROUNDS=any_numeric_value
    JWT_ACCESS_SECRET=secret
    JWT_ACCESS_EXPIRES_IN=time
    JWT_REFRESH_SECRET=secret
    JWT_REFRESH_EXPIRES_IN=time
    SERVER_URL=live_or_local_url
    FRONTEND_URL=live_or_local_url
    STORE_ID=aamarpay_store_id
    SIGNATURE_KEY=aamarpay_signature_key
    PAYMENT_URL=aamarpay_payment_url
    PAYMENT_VERIFY_URL=aamarpay_payment_verify_url
   ```
3. Then the `.env` file needs to be connected with the `config` file.
   ```js
   import dotenv from 'dotenv';
   import path from 'path';
   dotenv.config({ path: path.join(process.cwd(), '.env') });
   export default {
     NODE_ENV: process.env.NODE_ENV,
     port: process.env.PORT,
     db_url: process.env.DATABASE_URL,
     bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
     jwt_access_secret: process.env.JWT_ACCESS_SECRET,
     jwt_access_expire_in: process.env.JWT_ACCESS_EXPIRES_IN,
     jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
     jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRES_IN,
     server_url: process.env.SERVER_URL,
     frontend_url: process.env.FRONTEND_URL,
     store_id: process.env.STORE_ID,
     signature_key: process.env.SIGNATURE_KEY,
     payment_url: process.env.PAYMENT_URL,
     payment_verify_url: process.env.PAYMENT_VERIFY_URL,
   };
   ```

### Important Login credentials:
##### Admin:
- email: admin@example.com
- password: password@1234
##### Demo User:
- email: jhon24@example.com
- password: password@1234
