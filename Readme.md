# efuafinex-hair-api-server

## Test Run Server

To test run this server on your machine, follow these simple steps:

- Install necessary packages by running `npm install` or `yarn add` on your terminal
- Once packages are done installing, you can start the server by running `npm run dev`
- The server should be up and running. However, if you encounter any error relating to _nodemon_, simply run `npm i -g nodemon` on your terminal to install nodemon globally.

## API Endpoints

This api server is currently available on **/v1/**, hence every endpoints listed below should be appended to this version directory. For example `{host}/v1/auth/login` will be the right path for the login endpoint.

Listed below are the available groups of endpoints for you to test out:

- /auth endpoints
- /user endpoints

### /auth Endpoints

#### login

`/auth/login/` - POST - formData{ email, pass }

#### register

`/auth/register/` - POST - formData{ email, fullname, phone, pass, confirm_pass }

### /user Enpoints

#### update password

`/user/pass/` - PUT - formData{ pass, new_pass, confirm_pass }
