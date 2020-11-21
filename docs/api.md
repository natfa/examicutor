# API documentation
Please note that this documentation is a work in progress.

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

[API documentation](#authentication-/api/auth)

```
{
    id:    int;
    email: string;
    role:  string;
}
```

### Module model
A module is basically like a subject. They have a different name due to the teaching structure in the university, but essentially it is the same thing as a subject.

[API documentation](#modules-/api/module)

```
{
    id:   int;
    name: string;
}
```

### Theme model
A theme belongs to a module. It is some part of the teaching material that can have multiple different questions
that can be added to an [exam](#exam-model)

[API documentation](#themes-/api/theme)

```
{
    id:       int;
    name:     string;
    moduleId: int;
}
```


### Question model
Question model is a representation of a question that can be answered by a [student](#student-model).
It contains an array of [answers](#answer-model) and it belongs to a [theme](#theme-model).

[API documentation](#questions-/api/question)

```
{
    id:      int;
    text:    string;
    points:  number;
    answers: Answer[];
    theme:   Theme;
}
```

### Answer model
An answer that belongs to a [question](#question-model). It can either be a correct answer or an incorrect one.

```
{
    id:      int;
    text:    string;
    correct: boolean;
}
```



## Authentication `/api/auth`
Basic authentication utilities. Utilizes a cookie session system. Although the cookie system clashes with the guidelines
for a RESTful service, was considered to be the better alternative than JWTs.

1. [Get current session info](#get-/api/auth)
2. [Authenticate](#post-/api/auth)
3. [Logout](#head-/api/auth/logout)
4. [Create a new user](#post-/api/auth/create)


### `GET /api/auth`
Fetches (if any) current session information for user.

#### Responses:
Response Code | Meaning
--------------|--------
200 | All good. Sends user model with the response.
401 | User not authenticated.

#### Notes:
* NOT tested



### `POST /api/auth`
Authenticates a user. Returns the user's information as a response or an error code.

#### Request body:
Field | Type | Value
------|------|------
email | `string` | Must be a valid email.
password | `string` | Your password.

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



### `HEAD /api/auth/logout`
***NOT IMPLEMENTED***

Log a user out (invalidate the current session).

#### Responses:
Response Code | Meaning
--------------|--------
204 | User logged out.
400 | User not authorized, noop.

#### Notes:
* NOT implemented
* NOT tested



### `POST /api/auth/create`
***NOT IMPLEMENTED***

Creates a new user account. This action can only be performed by admins.

#### Request body:
Field | Type | Value
------|------|------
email | `string` | Must be a valid email.
password | `string` | The password of the new user.
psswordRepeat | `string` | A repeated password.
role | `string` | One of: `admin`, `teacher` or `student`.

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



## Modules `/api/module`
Basic CRUD for modules.

1. [Get all modules](#get-/api/module)



### `GET /api/module`
Get all modules saved on the database.

#### Responses:
Response Code | Meaning
--------------|--------
200 | Modules sent with response body.
401 | User not authenticated.

#### Notes:
* NOT tested



## Themes `/api/theme`
Basic CRUD for themes.

1. [Get all module's themes](#get-/api/theme/:moduleId)



### `GET /api/theme/:moduleId`
Get all themes saved on the database that are saved under a module.

#### Responses:
Response Code | Meaning
--------------|--------
200 | Themes sent with response body.
401 | User not authenticated.

#### Notes:
* NOT tested



## Questions `/api/question`
Basic CRUD for questions.

1. [Get all questions](#get-/api/question)
2. [Get question by id](#get-/api/question/:id)
3. [Create question](#post-/api/question)
4. [Update a question](#put-/api/question)
5. [Delete a question by id](#delete-/api/question/:id)



### `GET /api/question`
Get all questions saved on the database.

#### Responses:
Response Code | Meaning
--------------|--------
200 | Questions have been sent with response.
401 | User not authenticated.
403 | User isn't a teacher.

#### Notes:
* NOT tested



### `GET /api/question/:id`
Get question based on the ID passed in the URL.

**Note**: The `:id` is not a part of a query. This is just another path into the URL.
For example, the request GET `/api/question/42` will get the question that has an ID of 42.

#### Responses:
Response Code | Meaning
--------------|--------
200 | Question sent with response.
401 | User not authenticated.
403 | User isn't a teacher.
404 | Question with that ID not found.

#### Notes:
* NOT tested



### `POST /api/question`
Create a question.

#### Request body:
Field | Type | Value
------|------|------
text | `string` | The text of the question.
points | `number` | How many points will the question give when answered correctly.
answers | `array` | An array of valid [answers](#answer-model).
subjectName | `string` | A subject name to create the question under.
themeName | `string` | A theme name to create the question under.

##### Example:
```json
{
    "text": "What is 4+4?",
    "points": 1,
    "answers": [
        { "text": "4+4 is 5!", "correct": false },
        { "text": "4+4 is 6!", "correct": false },
        { "text": "4+4 is 7!", "correct": false },
        { "text": "4+4 is 8!", "correct": true },
    ],
    "subjectName": "Math",
    "themeName": "Algebra"
}
```

#### Responses:
Response Code | Meaning
--------------|--------
200 | Question created and returned in response body.
400 | Question request body is incorrect. Information returned with response body.
401 | User not authenticated.
403 | User not a teacher.

#### Notes:
* NOT JOI validated
* NOT tested



### `PUT /api/question`
Update a question.

#### Request body:
Field | Type | Value
------|------|------
id | `number` | The id of the question to update.
text | `string` | The text of the question.
points | `number` | How many points will the question give when answered correctly.
answers | `array` | An array of valid [answers](#answer-model).
subjectName | `string` | A subject name to create the question under.
themeName | `string` | A theme name to create the question under.

##### Example:
```json
{
    "id": 4,
    "text": "What is 4+4?",
    "points": 1,
    "answers": [
        { "text": "4+4 is 5!", "correct": false },
        { "text": "4+4 is 6!", "correct": false },
        { "text": "4+4 is 7!", "correct": false },
        { "text": "4+4 is 8!", "correct": true },
    ],
    "subjectName": "Math",
    "themeName": "Algebra"
}
```

#### Responses:
Response Code | Meaning
--------------|--------
200 | Question created and returned in response body.
400 | Question request body is incorrect. Information returned with response body.
401 | User not authenticated.
403 | User not a teacher.
404 | Question not found.

#### Notes:
* NOT JOI validated
* NOT tested



### `DELETE /api/question/:id`
Delete a question by ID.

**Note**: The `:id` is not a part of a query. This is just another path into the URL.
For example, the request GET `/api/question/42` will delete the question that has an ID of 42.

#### Responses:
Response Code | Meaning
--------------|--------
204 | Question was deleted.
401 | User not authenticated.
403 | User not a teacher.
404 | Question not found.

#### Notes:
* NOT tested