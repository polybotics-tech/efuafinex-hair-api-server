# efuafinex-hair-api-server

## Test Run Server

To test run this server on your machine, follow these simple steps:

- Install necessary packages by running `npm install` or `yarn add` on your terminal
- Once packages are done installing, you can start the server by running `npm run dev`
- The server should be up and running. However, if you encounter any error relating to _nodemon_, simply run `npm i -g nodemon` on your terminal to install nodemon globally.

## API Endpoints

This api server is currently available on **/v1/**, hence every endpoints listed below should be appended to this version directory. For example `{host}/v1/auth/login` will be the right path for the login endpoint.

Listed below are the available groups of endpoints for you to test out:

- /auth/ endpoints
- /user/ endpoints
- /package/ endpoint
- /deposit/ endpoint

### /auth/ Endpoints

These endpoints handle most of the authentication activities, like registering a new user account, logging in an existing user when the correct credentials are passed, as well as returning the required _access token_ on a successful request operation.

#### Login Existing User

`/auth/login/` - POST - _json{ email, pass }_

#### Register New User

`/auth/register/` - POST - _json{ email, fullname, phone, pass, confirm_pass }_

#### Generate OTP For Email Verification

`auth/verify/` - POST - _json{ user_id }_

#### Verify OTP

`auth/otp/` - POST - _json{ otp, user_id }_

#### Verify Email From Forgot Password Request

`auth/forgot/` - POST - _json{ email }_

#### Reset Password From Forgot Password

`auth/reset/` - PUT - _json{ new_pass, confirm_pass }_ - **(token required)**

#### Re-validate User Token

`/auth/revalidate` - GET - **(token required)**

### /user/ Enpoints

The _/user/_ endpoints are mainly used to update user details and preferences. However, a used must have already gotten an _access token_ from any of the _/auth/_ endpoints, before operations can be allowed.

#### Update User Account

`/user/account/` - PUT - _json{ fullname, phone }_ - **(token required)**

#### Update User Password

`/user/pass/` - PUT - _json{ pass, new_pass, confirm_pass }_ - **(token required)**

#### Update User Notifcation Preference

`/user/notify/` - PUT - _json{ push_notify, email_notify }_ - **(token required)**

#### Update User Profile Thumbnail

`/user/thumbnail/` - PUT - _formData{ file }_ - **(token required)**

### /package/ Enpoints

#### Create New Package

`/package/` - POST - _json{ title, description, is_defined, target_amount, auto_complete, fixed_deadline, deadline, duration, has_photo, photo }_ - **(token required)**

#### Fetch Single Package

`/package/:package_id` - GET - **(token required)**

#### Fetch Multiple User Packages

`/package/` - GET - _query{?page, ?sort}_ - **(token required)**

#### Mark Package As Completed

`/package/completed/:package_id` - PUT - **(token required)**

### /deposit/ Enpoints

#### Fund A Package

`/deposit/:package_id` - POST - _json{ amount }_ - **(token required)**

#### Verify Transaction Ref

`/deposit/verify/:transaction_ref` - GET - **(token required)**

#### Fetch Deposit Record Details

`/deposit/:transaction_ref` - GET - **(token required)**

#### Fetch Multiple Deposit Records For User

`/deposit/` - GET - _query{?page, ?sort}_ - **(token required)**

#### Fetch Multilple Deposit Records For A Package

`/deposit/records/:package_id` - GET - _query{?page}_ - **(token required)**

### Admin Endpoints

#### Create A Faq

`/admin/faqs` - POST - json{question, answer, tags}

#### Fetch Faqs

`/admin/faqs` - GET - query{?page, ?q}

#### Fetch Users

`/admin/users` - GET - query{?page, ?q}

#### Fetch User Details

`/admin/users/:user_id` - GET

#### Fetch Packages

`/admin/packages` - GET - query{?page, ?q}

#### Fetch Package Details

`/admin/packages/:package_id` - GET

#### Fetch User Packages Details

`/admin/packages/user/:user_id` - GET

#### Fetch Deposits

`/admin/deposits` - GET - query{?page, ?q, ?sort}

#### Fetch Deposit Details

`/admin/deposits/:transaction_ref` - GET

#### Fetch User Deposits Details

`/admin/deposits/user/:user_id` - GET
