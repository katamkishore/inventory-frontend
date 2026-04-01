# Functional Specification — Capstone Frontend

## Overview

The Capstone frontend is a single-page web application that enables business users to manage their inventory, generate and track invoices, and monitor sales performance through a dashboard and statistics view.

---

## User Roles

- **Authenticated User** — A registered business owner or manager. All data is scoped per user account.

---

## Functional Requirements

### 1. Authentication

| ID    | Requirement |
|-------|-------------|
| AU-01 | Users can register with first name, last name, email, and password. |
| AU-02 | Users can log in with email and password. A JWT token is stored client-side. |
| AU-03 | Users can request a password reset via email, receive an OTP, verify it, and set a new password. |
| AU-04 | Protected routes redirect unauthenticated users to the login page. |
| AU-05 | Users can log out, clearing the stored token. |

### 2. Dashboard

| ID    | Requirement |
|-------|-------------|
| DB-01 | Display sales overview card: total revenue and units sold. |
| DB-02 | Display purchase overview card: total purchases and cost. |
| DB-03 | Display inventory summary: total products, in-stock, low-stock, out-of-stock counts. |
| DB-04 | Display top 5 products by sales count. |
| DB-05 | Display a monthly sales bar chart for the last 10 months. |
| DB-06 | Card order on the dashboard is customizable and persisted per user. |

### 3. Product Management

| ID    | Requirement |
|-------|-------------|
| PM-01 | Users can add a product with: name, category, price, quantity, unit, expiry date, threshold value, and an optional image. |
| PM-02 | Users can import multiple products at once via a CSV file upload. |
| PM-03 | Product list displays with search (by name/category) and pagination. |
| PM-04 | Each product shows its stock status: **In Stock**, **Low Stock**, or **Out of Stock**, calculated from quantity vs. threshold. |
| PM-05 | Users can delete a product. |
| PM-06 | Users can buy/purchase a product, which decrements stock and creates an invoice. |

### 4. Invoice Management

| ID    | Requirement |
|-------|-------------|
| IN-01 | Invoices are automatically created when a product is purchased. |
| IN-02 | Invoice list shows reference number, billed-to, total, due date, and payment status. |
| IN-03 | Users can view full invoice details including line items, tax, and subtotal. |
| IN-04 | Users can toggle an invoice's payment status between **Paid** and **Unpaid**. |
| IN-05 | Users can delete an invoice. |
| IN-06 | Invoice list header displays aggregate stats: total invoices, paid, unpaid. |

### 5. Statistics

| ID    | Requirement |
|-------|-------------|
| ST-01 | Display key metric cards: total revenue, products sold, products in stock. |
| ST-02 | Display a monthly revenue/sales bar chart. |
| ST-03 | Display a top products list with sales counts. |
| ST-04 | Card display order is customizable and persisted per user. |

### 6. Settings

| ID    | Requirement |
|-------|-------------|
| SE-01 | Users can update their first name, last name, and email. |
| SE-02 | Users can change their password (requires current password confirmation). |

---

## Non-Functional Requirements

| ID    | Requirement |
|-------|-------------|
| NF-01 | The app must be fully responsive on desktop browsers. |
| NF-02 | Toast notifications must be shown for all user actions (success and error). |
| NF-03 | All API calls must be authenticated via JWT bearer token. |
| NF-04 | The app should gracefully handle API errors without crashing. |

---

## Constraints

- The frontend communicates exclusively with the Capstone backend API.
- OTP-based password reset uses a predefined set of valid OTPs (development/demo constraint).
- No real email delivery is implemented; OTP verification is simulated.
