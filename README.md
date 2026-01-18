# 🏡 Stays — Full-Stack Accommodation Platform

**Stays** is a full-stack accommodation booking platform inspired by Airbnb.  
It allows users to explore listings on a map, search by location & price, like stays, create their own listings, and manage them securely.

Built with **Next.js**, **Express**, **Prisma**, **PostgreSQL**, **Clerk Auth**, and **Mapbox**.

---

## ✨ Features

### 👤 Authentication
- Secure authentication with **Clerk**
- Sign up / Sign in
- Protected actions (create, edit, delete, like)

### 🏠 Listings
- Create, edit, and delete listings (owner only)
- Image uploads via **ImageKit**
- Price, location, description, and images
- Owner-only edit & delete controls

### 🔍 Search & Filters
- Search by location
- Filter by minimum & maximum price
- URL-based filters (shareable links)

### 🗺️ Map Integration (Mapbox)
- Interactive map on the home page
- Price pins for each listing
- Hover & click sync between map pins and listing cards
- Auto-centers map based on available listings

### ❤️ Likes (Wishlist)
- Like/unlike listings
- View all liked listings in a dedicated page

### ⭐ Reviews
- Add reviews with ratings
- Average rating calculation
- Owner cannot review their own listing

---

## 🧱 Tech Stack

### Frontend
- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Mapbox GL**
- **Clerk (Auth)**

### Backend
- **Node.js**
- **Express**
- **Prisma ORM**
- **PostgreSQL**
- **ImageKit (image uploads)**

---

## 📁 Project Structure

