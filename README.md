A modern calendar web application built with Next.js 13+ (App Router) that allows users to create, edit, delete, and view both one-time and recurring events (Daily, Weekly, Monthly).
Styled beautifully with Tailwind CSS, powered by Prisma ORM, and connected to a PostgreSQL database.

=> Features
=> Event Management

 Create,  Update, Delete, and List Events

Supports both one-time and recurring events

Recurrence options:

-> Daily

-> Weekly (select specific weekdays)

-> Monthly

Includes optional recurrence end date

Validates all form inputs before submission

-> Calendar View

Displays events on a monthly grid

Highlights recurring events automatically

Includes navigation for previous / next month

Built using Tailwind CSS for responsive design

==> Backend (API)

RESTful endpoints under /api/events

==> Tech Stack
Layer     : 	Technology
Framework : 	Next.js 13+ (App Router)
Styling   : 	Tailwind CSS
Database  : 	PostgreSQL (via Prisma ORM)
API       : 	Next.js Route Handlers
Language  : 	TypeScript
Optional  : 	date-fns

==> Environment Setup

first command - npm i
then - npx prisma generate
then - create .env file
then - DATABASE_URL="postgresql://USER:PASSWORD@127.0.0.1:5432/eventsdb?schema=public" enter this variable inside the file(make database named eventsdb)


Built with Next.js Route Handlers

Fully integrated with Prisma ORM
