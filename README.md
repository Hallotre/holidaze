# Holidaze - Front-End Development Exam Project

## Project Overview

Holidaze is a comprehensive accommodation booking platform developed as the final exam project for the Front-End Development course. This project demonstrates the application of skills learned throughout the program, including planning, designing, and implementing a modern web application with React.

## Assignment Brief

The assignment required developing a brand new front-end for Holidaze, an accommodation booking site, with two key aspects:
1. A customer-facing side where users can book holidays at venues
2. An admin-facing side where users can register and manage venues and bookings

## Project Timeline

### Gantt Chart Overview
The project was completed over a 7-week period from April 8 to May 26, 2024.

| Task | Start Date | End Date | Duration |
|------|------------|----------|----------|
| **Project Planning** | Apr 8 | Apr 14 | 1 week |
| - Project setup | Apr 8 | Apr 9 | 2 days |
| - Requirement analysis | Apr 9 | Apr 11 | 3 days |
| - Task breakdown | Apr 12 | Apr 14 | 3 days |
| **Design Phase** | Apr 15 | Apr 28 | 2 weeks |
| - Market research | Apr 15 | Apr 17 | 3 days |
| - Style guide creation | Apr 18 | Apr 21 | 4 days |
| - Wireframing | Apr 22 | Apr 24 | 3 days |
| - Prototype development | Apr 25 | Apr 28 | 4 days |
| **Development Phase** | Apr 29 | May 19 | 3 weeks |
| - Project structure setup | Apr 29 | May 1 | 3 days |
| - Authentication system | May 2 | May 5 | 4 days |
| - Venue listing & details | May 6 | May 9 | 4 days |
| - Booking functionality | May 10 | May 13 | 4 days |
| - Venue management | May 14 | May 16 | 3 days |
| - Profile management | May 17 | May 19 | 3 days |
| **Testing & Deployment** | May 20 | May 26 | 1 week |
| - Code review & bug fixes | May 20 | May 22 | 3 days |
| - Accessibility testing | May 23 | May 24 | 2 days |
| - Performance optimization | May 24 | May 25 | 2 days |
| - Deployment | May 26 | May 26 | 1 day |

### Milestone Achievements
- **April 14**: Project planning completed
- **April 28**: Design finalized
- **May 19**: Development completed
- **May 26**: Final deployment

## Learning Outcomes Addressed

- **Project Planning**: Gantt chart to plan and track development progress
- **UI Design**: Created a comprehensive style guide and prototype in Figma
- **React Development**: Built the application using React/Next.js with TypeScript
- **CSS Framework Implementation**: Used Tailwind CSS for styling the application
- **API Integration**: Connected to the Noroff API for data interaction
- **UI Functionality**: Implemented complex UI features like calendar booking, search filtering, and user management
- **Testing**: Conducted testing using HTML Markup Validation Tool, Lighthouse, and WAVE
- **Deployment**: Successfully deployed to Vercel

## User Stories Implementation

### All Users
- ✅ View a list of venues
- ✅ Search for a specific venue
- ✅ View a specific venue page by ID
- ✅ Register as a customer with a stud.noroff.no email
- ✅ Register as a venue manager with a stud.noroff.no email
- ✅ View a calendar with available dates for venues

### Customers
- ✅ Login and logout functionality
- ✅ Create bookings at venues
- ✅ View upcoming bookings
- ✅ Update avatar/profile picture

### Venue Managers
- ✅ Login and logout functionality
- ✅ Create new venues
- ✅ Edit/update managed venues
- ✅ Delete managed venues
- ✅ View upcoming bookings at managed venues
- ✅ Update avatar/profile picture

## Design Process

The application design focused on creating an appealing, WCAG-compliant interface targeted at travelers and accommodation providers. The design process included:

1. **Research**: Analyzing competitor booking platforms and identifying user needs
2. **Style Guide Development**: Creating a consistent visual language with logo, typography, color palette, and UI components
3. **Prototyping**: Designing responsive layouts for both desktop and mobile devices
4. **Refinement**: Iterating on designs based on usability principles and accessibility guidelines

## Development Approach

### Technology Stack
- **Framework**: Next.js (App Router)
- **UI**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand and React Query
- **Form Handling**: React Hook Form with Zod validation
- **Maps Integration**: Mapbox GL
- **UI Components**: Radix UI primitives
- **Date Handling**: date-fns

### Implementation Highlights

#### Authentication System
- JWT-based authentication
- Protected routes for authenticated users
- Role-based access control (Customer vs. Venue Manager)

#### Venue Management
- Complete CRUD operations for venues
- Image uploads with preview
- Location selection with map integration

#### Booking System
- Date selection with availability checking
- Booking confirmation process
- Booking management interface

#### Search Functionality
- Location-based search
- Date filtering
- Advanced filters for amenities and price range


## Setup and Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/holidaze.git
cd holidaze
```

2. **Install dependencies**
```bash
npm install
```

> **Note:** The project uses package overrides to ensure compatibility between React and react-day-picker. These configurations are necessary for proper functionality and deployment.

3. **Set up environment variables**
Create a `.env.local` file in the root directory with:
```
# API Configuration
NEXT_PUBLIC_AUTH_TOKEN=your_noroff_token
NOROFF_API_KEY=your_noroff_key

# Mapbox Configuration
MAPBOX_ACCESS_TOKEN=your_mapbox_token 
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)** with your browser to see the application.

## Project Structure

```
src/
├── app/                  # Main application routes
│   ├── page.tsx          # Home page (/)
│   ├── login/            # Login route
│   ├── register/         # Registration route
│   ├── profile/          # User profile routes
│   ├── venues/           # Venue-related routes
│   ├── help/             # Help center
│   ├── privacy/          # Privacy policy
│   └── terms/            # Terms of service
├── components/           # Reusable UI components
├── lib/                  # Utility functions and API services
└── types/                # TypeScript type definitions
```

## Reflections and Learnings

This project presented several challenges that provided valuable learning opportunities:

1. **State Management Complexity**: Handling the different user roles and their respective permissions required careful planning of the state management architecture.

2. **Form Validation**: Implementing comprehensive form validation for venue creation and user registration improved data quality and user experience.

3. **Responsive Design**: Ensuring the application worked seamlessly across all device sizes required careful planning and implementation of responsive design principles.

4. **API Integration**: Working with the provided API specification helped develop skills in reading documentation and implementing proper error handling.

The project successfully fulfilled all the required user stories while maintaining a high standard of code quality, accessibility, and user experience.
