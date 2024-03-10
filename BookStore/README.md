# HTTPS Status Code

HTTP status codes are standard response codes given by web servers on the internet. They communicate the status of a web request made by a client to the server. These status codes are grouped into different categories, each representing a specific type of response. 

## HTTP status codes are three-digit codes that indicate the outcome of an HTTP request. They are categorized into five classes:

1. Informational (1xx): 
These codes indicate a provisional response, such as a server receiving a request and continuing to process it. Example: 
    - 100 Continue - The server has received the request header and is waiting for the request body.

2. Successful (2xx): These codes indicate that the request was successfully received, understood, and accepted. Examples: 
    - 200 OK - The request was successful.
    - 201 Created - The request has been fulfilled and resulted in a new resource being created.
    - 204 No Content - The server has successfully processed the request, but there is no content to send back.

3. Redirection (3xx): These codes indicate that further action needs to be taken by the client to complete the request. Examples: 
    - 301 Moved Permanently - The requested resource has been permanently moved to a new location.
    - 302 Found - The requested resource resides temporarily under a different URI.
    - 304 Not Modified - The resource has not been modified since the last request, so there is no need to resend it.

4. Client Error (4xx): These codes indicate that the request contains bad syntax or cannot be fulfilled. Examples:
    - 400 Bad Request - The server cannot understand the request due to invalid syntax.
    - 401 Unauthorized - The request requires user authentication.
    - 404 Not Found - The requested resource could not be found.
    - 405 Method Not Allowed - The requested method is not supported for the requested resource.

5. Server Error (5xx): These codes indicate that the server encountered an error or malfunction and could not complete the request. Examples:
    - 500 Internal Server Error - The server encountered an unexpected condition that prevented it from fulfilling the request.
    - 502 Bad Gateway - The server received an invalid response from an upstream server.
    - 503 Service Unavailable - The server is currently unavailable (overloaded or down for maintenance).

Understanding HTTP status codes is essential for debugging web applications and interpreting server responses.