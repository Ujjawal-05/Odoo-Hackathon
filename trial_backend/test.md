# SynergySphere Backend - cURL Examples for All Routes
# Base URL: http://localhost:3000/api/v1 (use http://10.0.2.2:3000/api/v1 on Android emulator)
# Note: Replace TOKEN=... with the actual token string from login responses.

# -------------------- AUTH --------------------
# Register
curl -X POST http://localhost:3000/api/v1/auth/register -H "Content-Type: application/json" -d '{"name":"New User","email":"ne1w@example.com","password":"sec1ret"}'

# Login (Demo User)
curl -X POST http://localhost:3000/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"ne1w@example.com","password":"sec1ret"}'

# Login (Demo Admin)
curl -X POST http://localhost:3000/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"demo@synergy.com","password":"password123"}'

# Logout
curl -X POST http://localhost:3000/api/v1/auth/logout -H "Authorization: Bearer $TOKEN"

# Refresh (dummy)
curl -X POST http://localhost:3000/api/v1/auth/refresh

# -------------------- USERS --------------------
# Me
curl -X GET http://localhost:3000/api/v1/users/me -H "Authorization: Bearer $TOKEN"

# User by ID
curl -X GET http://localhost:3000/api/v1/users/u2 -H "Authorization: Bearer $TOKEN"

# Search users (Admin/Manager)
curl -X GET "http://localhost:3000/api/v1/users/search?q=alice" -H "Authorization: Bearer $TOKEN"

# -------------------- PROJECTS --------------------
# List my projects
curl -X GET http://localhost:3000/api/v1/projects -H "Authorization: Bearer $TOKEN"

# Create project
curl -X POST http://localhost:3000/api/v1/projects -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"name":"Mobile App","description":"Flutter MVP"}'

# Get project by ID
curl -X GET http://localhost:3000/api/v1/projects/p1 -H "Authorization: Bearer $TOKEN"

# Update project
curl -X PUT http://localhost:3000/api/v1/projects/p1 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"description":"Updated description"}'

# Delete project
curl -X DELETE http://localhost:3000/api/v1/projects/p1 -H "Authorization: Bearer $TOKEN"

# -------------------- PROJECT MEMBERS --------------------
# List members
curl -X GET http://localhost:3000/api/v1/projects/p1/members -H "Authorization: Bearer $TOKEN"

# Add member
curl -X POST http://localhost:3000/api/v1/projects/p1/members -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"userId":"u3","role":"member"}'

# Remove member
curl -X DELETE http://localhost:3000/api/v1/projects/p1/members/u3 -H "Authorization: Bearer $TOKEN"

# -------------------- TASKS --------------------
# List project tasks
curl -X GET http://localhost:3000/api/v1/projects/p1/tasks -H "Authorization: Bearer $TOKEN"

# Create project task
curl -X POST http://localhost:3000/api/v1/projects/p1/tasks -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"title":"New Task","description":"Details","status":"todo"}'

# Get project task by ID
curl -X GET http://localhost:3000/api/v1/projects/p1/tasks/t1 -H "Authorization: Bearer $TOKEN"

# Update project task
curl -X PUT http://localhost:3000/api/v1/projects/p1/tasks/t1 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"status":"done"}'

# Delete project task
curl -X DELETE http://localhost:3000/api/v1/projects/p1/tasks/t1 -H "Authorization: Bearer $TOKEN"

# Global tasks (list my tasks)
curl -X GET "http://localhost:3000/api/v1/tasks?assigneeId=me" -H "Authorization: Bearer $TOKEN"

# Get task globally by ID
curl -X GET http://localhost:3000/api/v1/tasks/t1 -H "Authorization: Bearer $TOKEN"

# -------------------- MESSAGES --------------------
# List messages in project
curl -X GET http://localhost:3000/api/v1/projects/p1/messages -H "Authorization: Bearer $TOKEN"

# Post new message
curl -X POST http://localhost:3000/api/v1/projects/p1/messages -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"text":"Hello team!"}'

# Get message by ID
curl -X GET http://localhost:3000/api/v1/projects/p1/messages/m1 -H "Authorization: Bearer $TOKEN"

# Update message
curl -X PUT http://localhost:3000/api/v1/projects/p1/messages/m1 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"text":"Updated message"}'

# Delete message
curl -X DELETE http://localhost:3000/api/v1/projects/p1/messages/m1 -H "Authorization: Bearer $TOKEN"

# -------------------- NOTIFICATIONS --------------------
# List my notifications
curl -X GET http://localhost:3000/api/v1/notifications -H "Authorization: Bearer $TOKEN"

# Mark notification as read
curl -X POST http://localhost:3000/api/v1/notifications/n1/read -H "Authorization: Bearer $TOKEN"
