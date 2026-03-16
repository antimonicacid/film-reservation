<h1>Film reservation</h1>

<h2>Register</h2>

<h3>Request</h3>

<code>POST /register

{"user": "username", "pwd": "password"}</code>

<h3>Response</h3>

<code>{"message":"New user username created"}</code>

<h2>Login</h2>

<h3>Request</h3>

<code>POST /auth

{"user": "username", "pwd": "password"}</code>

<h3>Response</h3>

<code>{"accessToken":"abcdefg"}</code>

<h2>Refresh</h2>

<h3>Request</h3>

<code>GET /refresh</code>

<h3>Response</h3>

<b>If valid refresh token in cookies</b>

<code>{"accessToken":"abcdefg"}</code>

<b>If no refresh token in cookies</b>

<code>401 Unauthorized</code>

<b>If invalid refresh token in cookies</b>

<code>403 Forbidden</code>

<h2>Get films</h2>

<h3>Request</h3>

<code>GET /film

{"genre": "genre", "title": "title"}</code>

<h3>Response</h3>

<code>{"title": "film", "description": "desc", "image": "http://example.com"}</code>

<h2>Add film</h2>

<h3>Request</h3>

<code>POST /film

{"title": "film", "description": "desc", "image": "http://example.com", "genre": "genre"}</code>

<h3>Response</h3>

<code>{"message": "New film film created"}</code>


<h2>Delete film</h2>

<h3>Request</h3>

<code>DELETE /film/:id</code>

<h3>Response</h3>

<b>If film with ID is found</b>

<code>204 No content</code>

<h2>Modify film</h2>

<h3>Request</h3>

Can modify film's title, description, image or genre.

<code>PUT /film/:id

{"description": "description 2"}</code>

<h3>Response</h3>

<code>
{"title": "film", "description": "description 2", "image": "http://example.com", "genre": "genre"}</code>


<h2>Query shows</h2>

By default returns shows running today. Can provide an onDate specifying a specific day or a startDate with an optional endDate.

<h3>Request</h3>

<code>GET /show</code>

<h3>Response</h3>

<code>{"capacity": 100, "price": 5.00, "date": "2026-01-01", "time": "15:00:00", "title": "film", "description": "description 2", "image": "http://example.com"}</code>

<h2>Add show</h2>

Date and time are optional but shows without a date cannot be queried.

<h3>Request</h3>

<code>POST /show

{"price": 5.00, "capacity": 100, "date": "2026-01-01", "time": "15:00:00", "filmId": 1}</code>

<h3>Response</h3>

<code>{"message": "New show for film film created"}</code>

<h2>Modify show</h2>

Can modify price, capacity, date, time and filmId.

<h3>Request</h3>

<code>PUT /show/:id

{"price": 3.50}</code>

<h3>Response</h3>

<code>{"price": 3.50, "capacity": 100, "date": "2026-01-01", "time": "15:00:00", "filmId": 1}</code>

<h2>Delete show</h2>

<h3>Request</h3>

<code>DELETE /show/:id</code>

<h3>Response</h3>

<code>204 No Content</code>

<h2>Reserve seats</h2>

<h3>Request</h3>

<code>POST /booking

{"seats": [1,2,3], "showId": 1, "userId": 1}</code>

<h3>Response</h3>

<code>{"message": "User 1 successfully reserved seats [1,2,3] for show 1"}</code>

<h2>Delete reservation</h2>

<h3>Request</h3>

Deletes given user's reservation only.

<code>DELETE /show

{"id": 1}</code>

<h3>Response</h3>

<code>204 No Content</code>

<h2>Query user's reservations</h2>

<h3>Request</h3>

<code> GET /show/:id</code>

<h3>Response</h3>

<code>Response code 200 with all reserved seats for a given user.</code>

<h2>Query show's reservations</h2>

<h3>Request</h3>

<code>GET /show/:id</code>

<h3>Response</h3>

<code>Response code 200 with all reserved seats for a given show.</code>

<h2>Promote user to admin</h2>

<h3>Request</h3>

<code>PUT /user/promote/:id</code>

<h3>Response</h3>

<code>Response code 200 with newly promoted user's details</code>

<h2>Delete user</h2>

<h3>Request</h3>

<code>DELETE /user/delete/:id</code>

<h3>Response</h3>

<code>204 No Content</code>



