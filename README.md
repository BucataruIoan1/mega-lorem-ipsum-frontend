Mega Lorem Ipsum

Application for managing Lorem Ipsum records, with CRUD, filtering, search, sorting, pagination, and quick test data generation.

Backend: https://github.com/BucataruIoan1/mega-lorem-ipsum-backend
Frontend: https://github.com/BucataruIoan1/mega-lorem-ipsum-frontend

The backend runs on http://localhost:3000, and the frontend runs on http://localhost:5173. The frontend depends on the backend, so the backend must be started first.

# Backend

I. Technologies: Node.js, Express, Jest, Nodemon

II. Installation and startup

git clone https://github.com/BucataruIoan1/mega-lorem-ipsum-backend
cd mega-lorem-ipsum-backend
npm install
npm run dev || npm start

III. API — Backend (http://localhost:3000)

1. Records — /api/records

GET     /api/records                  List with pagination, filters, search, sorting
GET     /api/records/:id              Single record
POST    /api/records                  Create
PUT     /api/records/:id              Edit
DELETE  /api/records/:id              Delete
POST    /api/records/generate-lorem   Generates 10/20/50/100/200 records

Optional GET parameters: page, pageSize (10/20/50/"all"), search, categoryId, statusId, ownerId, priorityId, sortBy (id/content/category/status/owner/priority/lastModified), sortDir (asc/desc).

2. Categories — /api/categories

GET     /api/categories       Category list
GET     /api/categories/:id   Single category
POST    /api/categories       Create
PUT     /api/categories/:id   Edit
DELETE  /api/categories/:id   Delete (blocked with 409 if used by a record)

3. Owners — /api/owners

GET     /api/owners       Owner list
GET     /api/owners/:id   Single owner
POST    /api/owners       Create
PUT     /api/owners/:id   Edit
DELETE  /api/owners/:id   Delete (blocked with 409 if used by a record)

4. Statuses — /api/statuses (read-only)

GET /api/statuses --> Predefined lookup with the values: Active, Inactive.

5. Priorities — /api/priorities (read-only)

GET /api/priorities --> Predefined lookup with the values: High, Normal, Low.

IV. Validations — Backend

Records — GET (list): page must be a positive integer, otherwise 400; pageSize only 10/20/50/"all", otherwise 400; sortBy only id/content/category/status/owner/priority/lastModified, otherwise 400; sortDir only asc/desc, otherwise 400; if page exceeds the number of pages, the last page is automatically returned; if there are no records, page automatically becomes 1.

Records — POST/PUT: all fields (content, categoryId, statusId, ownerId, priorityId) are required, otherwise 400; categoryId/statusId/ownerId/priorityId must exist, otherwise 400 with a specific message ("Category not found" etc.); for PUT/DELETE, the id must exist, otherwise 404.

Records — generate-lorem: count only 10/20/50/100/200, otherwise 400.

Categories / Owners: name is required when creating/editing, otherwise 400; the entity must exist for GET by ID, PUT, DELETE, otherwise 404; deletion is blocked with 409 if it is used by a record.

Statuses / Priorities: read-only, without POST/PUT/DELETE; GET by non-existing ID → 404.

V. Data

Stored in JSON files, without an external database:

mega-lorem-ipsum-backend/src/Data/
records.json
categories.json
owners.json
statuses.json    (read-only)
priorities.json  (read-only)

VI. Tests

npm test
Backend: 17 Jest tests (recordMapper, recordService — filtering/search/sorting/pagination, creation/generation)

# Frontend (separate terminal)

I. Technologies: React, HTML, CSS, JavaScript, Vite, React Router, Framer Motion, Vitest

II. Installation and startup

git clone https://github.com/BucataruIoan1/mega-lorem-ipsum-frontend
cd mega-lorem-ipsum-frontend
npm install
npm run dev

The application is available at http://localhost:5173.

III. Frontend interfaces

/records — responsive table with 7 sortable columns + Actions, live search, filtering, pagination, add/edit through modal, deletion with confirmation, and Lorem generation of 10/20/50/100/200 records
/owners — CRUD owners
/categories — CRUD categories

IV. UX and accessibility — Frontend

The modals are animated when opening/closing and can be closed with ESC, the "X" button, or by clicking the overlay. When a modal is opened, the page content does not jump: page scrolling is locked and the layout remains stable. The table state (search, sorting, pagination) and modal state are synchronized with the URL, so the same link can reopen the same view. The navigation is Mobile Ready, without jQuery, and the modals are keyboard accessible: focus trap, full Tab navigation, and focus restoration to the element that opened the dialog.

V. Validations — Frontend

A record's content is required, with a minimum of 3 characters, and category, status, owner, and priority are required, with inline error messages in the form. When editing, if nothing has changed, the form is not submitted ("Nu ai modificat nimic"). For Lorem generation (bulk), only 10/20/50/100/200 are allowed. The Owner/Category name is processed with trim() and must have at least 2 characters, with the same "nothing changed" rule when editing. Table query parameters are automatically normalized: positive page, pageSize only 10/20/50/all, sortDir only asc/desc, and the modal type only accepts valid values.

An owner or category cannot be deleted if it is used by a record (409 Conflict).

VI. Tests — Frontend

Run frontend tests:

npm run test

For watch mode:

npm run test:watch

Frontend tests cover:

API/service requests and response normalization
record creation payloads
sorting and pagination
form/input validation
bulk Lorem generation and error handling