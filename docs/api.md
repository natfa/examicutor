# API documentation (draft)

The base for all api calls is `/api`. Each heading in this document documents a different
path of the API. The path is written as part of the heading.

Ensure in all segments that you have the following information:
* A short description of what the endpoint does
* Detailed description on what parameters are available
* Body schema (for POST requests) *NOTE:* all fields are required unless specified otherwise
* Response codes and their meaning



## Models
The models that are going to be returned from the API. Written out in `fieldname: type` format. Types that start with
a capital letter are considered models defined in this document. Lowercase are basic types.

### User model
User model is the basic model for a registered user.

```
{
    id:    int;
    email: string;
    role:  string;
}
```



## Authentication `/api/auth`
Basic authentication utilities. Utilizes a cookie session system. Although the cookie system clashes with the guidelines
for a RESTful service, was considered to be the better alternative than JWTs.



### `GET /api/auth`
Fetches (if any) current session information for user.

#### Responses:
Response Code | Meaning
--------------|--------
200 | All good. Sends user model with the response.
401 | User not authenticated.

#### Notes:
* NOT Joi validated
* NOT tested



### `POST /api/auth`
Authenticates a user. Returns the user's information as a response or an error code.

#### Request body:
Field | Value
------|------
email | String. Must be a valid email.
password | String.

##### Example:
```json
{
    "email": "example@example.com",
    "password": "myVeryStrongPassword"
}
```

#### Responses:
Response Code | Meaning
--------------|--------
200 | All went well. User model sent with response.
400 | User is already authenticated.
401 | User doesn't exist or password didn't match.

#### Notes:
* NOT JOI validated
* NOT tested



### `HEAD /api/auth/logout` ***NOT IMPLEMENTED***
Log a user out (invalidate the current session).

#### Responses:
Response Code | Meaning
--------------|--------
204 | User logged out.
400 | User not authorized, noop.

#### Notes:
* NOT implemented
* NOT tested



### `POST /api/auth/create` ***NOT IMPLEMENTED***
Creates a new user account. This action can only be performed by admins.

#### Request body:
Field | Value
------|------
email | Email string value. Must be a valid email.
password | String.
psswordRepeat | String.
role | String. One of: `admin`, `teacher` or `student`.

##### Example:
```json
{
    "email": "example@example.com",
    "password": "aVeryStrongPassword",
    "passwordRepeat": "aVeryStrongPassword",
    "role": "admin"
}
```

#### Responses:
Response Code | Meaning
--------------|--------
200 | User successfully created. User model sent back with response.
400 | Provided email is already in use, email is invalid, passwords don't match or role doesn't exist. Response body provides details.
401 | User not authenticated.
403 | User not admin.

#### Notes:
* NOT JOI validated
* NOT tested