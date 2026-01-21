# VerAuto Order Tracking System

## Overview
VerAuto Order Tracking System is a comprehensive web application designed to manage and track vehicle orders from creation to delivery. The system provides real-time order status updates, city-based filtering, Excel export capabilities, and multi-user support with role-based access control.

## Features

### 📋 Order Management
- **Create Orders**: Add new vehicle orders with detailed information (brand, model, registration number, window types, etc.)
- **Order Status Tracking**: Monitor orders through multiple statuses:
  - **En Attente** (Pending)
  - **SENT** (Sent)
  - **IN_TRANSIT** (In Transit)
  - **CANCELLED** (Cancelled)
  - **COMPLETED** (Completed)
- **Order History**: View complete order lifecycle with timestamps and status changes
- **Order Details Page**: Access comprehensive order information including images, window details, offers, and comments

### 🎯 Filtering & Search
- Filter orders by city, company, registration number, and status
- View all orders or personal user orders
- City-based order grouping for organized tracking

### 📊 Excel Export
- Export filtered order data to Excel format
- Download reports by status and city
- Export IN_TRANSIT orders filtered by city with custom naming

### 🚗 Vehicle Management
- Manage car brands and models
- Support for multiple window types
- Track vehicle details and specifications

### 👥 User & Company Management
- User registration and authentication
- Role-based access control (Admin, User, Manager)
- Company and city management
- User profile management

### 🏢 Additional Features
- Transit modal for marking orders as in-transit
- Cancellation functionality with modal confirmation
- Window details management
- Offer selection for orders
- Image gallery for order documentation
- File number tracking
- Comments/notes on orders
- Pagination for large datasets

## Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - Navigation and routing
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **CSS3** - Styling

### Backend
- **Java/Spring Boot** - Backend framework
- **Maven** - Dependency management
- **Database** - (Configured in backend)
- **Apache POI/SXSSFWorkbook** - Excel file generation

## Project Structure

### Frontend (`/frontend`)
```
src/
├── pages/              # Page components (HomePage, OrderDetailsPage, ToBeSentPage, etc.)
├── components/        # Reusable components (OrderRow, SearchForm, Modals, etc.)
├── context/           # React Context (AuthContext, DownloadContext)
├── hooks/             # Custom hooks (useCarSelection, useCitySelection, etc.)
├── services/          # API service calls (orderService, userService, etc.)
├── validation/        # Input validation rules
├── utils/             # Utility functions
├── styles/            # CSS stylesheets
└── assets/            # Images and static files
```

### Backend (`/orderTracking`)
- Spring Boot application for order management API
- REST endpoints for CRUD operations
- Excel export functionality
- Authentication and authorization

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Java (v11+)
- Maven

### Installation

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd orderTracking
mvn clean install
mvn spring-boot:run
```

## Key Components

### OrdersList
Displays filtered orders in a table format with selection checkboxes and actions.

### SearchForm
Advanced search form for filtering orders by company, city, registration number, and status.

### OrderDetailsPage
Comprehensive view of a single order with history, images, window details, and action buttons.

### TransitModal
Modal dialog for marking selected orders as in-transit with company and decision number input.

### DownloadContext
Provides download functionality for Excel exports with city and status filtering.

## API Endpoints

### Orders
- `GET /orders/filtered` - Get filtered orders
- `GET /orders/{id}` - Get order details
- `POST /orders` - Create new order
- `PUT /orders/{id}` - Update order
- `GET /orders/export` - Export orders to Excel
- `POST /orders/{id}/decision` - Update order status

### Users
- `GET /users` - Get all users
- `POST /users` - Create new user
- `PUT /users/{id}` - Update user

### Other Resources
- `/companies` - Company management
- `/cities` - City management
- `/brands` - Car brands
- `/models` - Car models
- `/windows` - Window details

## Usage Examples

### Filter Orders by City and Status
Navigate to the "Suivi des Commandes" page, select a city from the dropdown, and view SENT orders specific to that city.

### Export to Excel
Click the "Télécharger Excel (SENT)" button to download all SENT orders for the selected city.

### Create an Order
Go to the form page, fill in vehicle details, select company and city, add window types, and submit.

### Track Order Status
Click on any order to view detailed information and track its progression through different statuses.

## License
© 2025 VerAuto. All rights reserved.