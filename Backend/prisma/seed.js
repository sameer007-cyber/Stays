import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

const LISTINGS = [
  {
    title: "Luxury Sea-Facing Apartment in Goa",
    description:
      "Wake up to the sound of waves in this stunning sea-facing apartment. Designed with modern interiors, a private balcony, and uninterrupted ocean views. Perfect for couples seeking a premium beachside escape.",
    location: "Goa",
    country: "India",
    price: 4800,
    latitude: 15.2993,
    longitude: 74.1240,
    imageUrl:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600",
  },
  {
    title: "Modern High-Rise Studio in South Mumbai",
    description:
      "A sleek, fully furnished studio located in the heart of South Mumbai. Ideal for business travelers and city explorers, offering skyline views, high-speed Wi-Fi, and premium amenities.",
    location: "Mumbai",
    country: "India",
    price: 6200,
    latitude: 19.0760,
    longitude: 72.8777,
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600",
  },
  {
    title: "Private Hilltop Cabin with Mountain Views",
    description:
      "Escape to the mountains in this peaceful hilltop cabin surrounded by pine trees. Enjoy breathtaking views, cozy interiors, and complete privacy—perfect for digital detox and nature lovers.",
    location: "Manali",
    country: "India",
    price: 3900,
    latitude: 32.2396,
    longitude: 77.1887,
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600",
  },
  {
    title: "Minimalist Apartment near Bangalore Tech Hub",
    description:
      "A thoughtfully designed minimalist apartment located minutes from major tech parks. Ideal for workations, featuring a dedicated workspace, natural lighting, and calm interiors.",
    location: "Bangalore",
    country: "India",
    price: 3600,
    latitude: 12.9716,
    longitude: 77.5946,
    imageUrl:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600",
  },
  {
    title: "Royal Heritage Haveli Experience",
    description:
      "Stay in a beautifully restored heritage haveli that blends royal Rajasthani architecture with modern comforts. Located close to historic forts and local markets.",
    location: "Jaipur",
    country: "India",
    price: 3300,
    latitude: 26.9124,
    longitude: 75.7873,
    imageUrl:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1600",
  },
  {
    title: "Beachfront Villa with Private Pool",
    description:
      "A luxurious beachfront villa offering a private pool, garden, and direct beach access. Perfect for family vacations or group getaways seeking privacy and comfort.",
    location: "Alibaug",
    country: "India",
    price: 9800,
    latitude: 18.6414,
    longitude: 72.8722,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600",
  },
  {
    title: "Serene Riverside Cottage Retreat",
    description:
      "Relax in this peaceful riverside cottage surrounded by lush greenery. Enjoy yoga mornings, scenic walks, and calming river sounds—ideal for wellness retreats.",
    location: "Rishikesh",
    country: "India",
    price: 3200,
    latitude: 30.0869,
    longitude: 78.2676,
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600",
  },
  {
    title: "Luxury Loft Overlooking Delhi Skyline",
    description:
      "A premium loft apartment offering panoramic city views, designer furniture, and modern comforts. Located close to top restaurants and cultural hotspots.",
    location: "Delhi",
    country: "India",
    price: 5200,
    latitude: 28.6139,
    longitude: 77.2090,
    imageUrl:
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1600",
  },
  {
    title: "Lake View Boutique Apartment",
    description:
      "A calm and stylish apartment overlooking a beautiful lake. Perfect for couples looking for a romantic getaway with scenic sunsets and peaceful surroundings.",
    location: "Udaipur",
    country: "India",
    price: 4100,
    latitude: 24.5854,
    longitude: 73.7125,
    imageUrl:
      "https://images.unsplash.com/photo-1599423300746-b62533397364?w=1600",
  },
  {
    title: "Coffee Plantation Stay in Coorg",
    description:
      "Experience plantation living in this cozy stay surrounded by coffee estates. Wake up to misty mornings, birdsong, and fresh mountain air.",
    location: "Coorg",
    country: "India",
    price: 4700,
    latitude: 12.3375,
    longitude: 75.8069,
    imageUrl:
      "https://images.unsplash.com/photo-1572120360610-d971b9b78827?w=1600",
  },
]

async function main() {
  console.log("🌱 Seeding database with unique listings...")

  // 🔥 clean DB
  await prisma.like.deleteMany()
  await prisma.review.deleteMany()
  await prisma.listing.deleteMany()
  await prisma.user.deleteMany()

  // 👤 demo owner
  const user = await prisma.user.create({
    data: {
      clerkId: "seed_demo_owner",
      name: "Demo Host",
      email: "demo@stays.com",
      password: await bcrypt.hash("password", 10),
    },
  })

  // 🏡 listings
  for (const listing of LISTINGS) {
    await prisma.listing.create({
      data: {
        ...listing,
        ownerId: user.id,
      },
    })
  }

  console.log("✅ Database seeded successfully")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
