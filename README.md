#  Vibe Commerce — Mock E-Commerce Cart

**Full Stack Internship Coding Assignment**

This project is a **mock shopping cart application** built for the **Vibe Commerce internship assignment**.  
It simulates a basic e-commerce experience — browsing products, adding/removing items to/from a cart, and completing a mock checkout — with smooth UI and simulated backend APIs.

---

##  Overview

The app demonstrates a simplified **end-to-end e-commerce flow** using **React (TypeScript)** on the frontend.  
All API calls are **mocked with simulated latency** to mimic real backend interactions — no real server or database is required.

###  Core Features

-  **Product Listing:** Display mock products with name and price.  
-  **Add to Cart:** Add or increase product quantities seamlessly.  
-  **Cart Management:** Update quantity, remove items, and view subtotal + total.  
-  **Mock Checkout:** Enter name and email to “checkout”; displays a receipt modal.  
-  **Error & Loading States:** Handles edge cases gracefully.  
-  **Responsive UI:** Works across desktop and mobile viewports.  

---

##  Tech Stack

| Layer | Technology | Purpose |
|-------|-------------|----------|
| Frontend | **React (TypeScript)** | Core UI framework |
| Styling | **Tailwind CSS** | Responsive design |
| Mock APIs | **Promises + setTimeout** | Simulated backend |
| State Management | **React Hooks (useState, useEffect, useCallback)** | Handle cart, form, and receipt states |

---

##  Project Structure

```bash
src/
├── pages/
│   └── HomePage.tsx   # Main e-commerce UI
├── App.tsx
└── index.tsx
