# Sequence Diagram for Creating a Note

Below is the sequence diagram for the process of creating a new note:

```mermaid
sequenceDiagram
  actor user
  participant browser
  participant server

  user->>browser: Open notes page
  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
  activate server
  server-->>browser: HTML document
  deactivate server

  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
  activate server
  server-->>browser: the CSS file
  deactivate server

  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
  activate server
  server-->>browser: the JavaScript file
  deactivate server

  user->>browser: Write a note and click Save
  browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
  activate server
  Note over server: The server responds with a 302 status, redirecting to /notes
  server-->>browser: 302 Redirect to /notes
  deactivate server

  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
  activate server
  server-->>browser: Updated HTML document
  deactivate server

  browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
  activate server
  server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ...]
  deactivate server

  browser-->>user: Display updated notes
