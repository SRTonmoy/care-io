export default [
  {
    id: "baby-car",
    name: "Baby Car",
    description: "Professional babysitting service",
    pricePerHour: 500,
  },
  {
    id: "elderly-car",
    name: "Elderly Car",
    description: "Compassionate elderly care",
    pricePerHour: 600,
  },
  {
    id: "sick-care",
    name: "Sick Car",
    description: "Home care for sick patients",
    pricePerHour: 700,
  },
];





export const services = [
  {
    id: 1,
    name: "Baby Care",
    slug: "baby-care",
    description: "Professional baby care services including feeding, diaper changing, sleep routine, and educational activities.",
    longDescription: "Our baby care service provides professional and loving care for your little ones. We understand that every baby is unique, and our caregivers are trained to provide personalized attention to ensure your baby's comfort, safety, and development. Our services include feeding assistance, diaper changing, sleep routine management, educational playtime, and regular updates to parents.",
    price: 25,
    duration: "per hour",
    image: "/images/baby-care.jpg",
    features: [
      "24/7 availability",
      "Certified caregivers",
      "Educational activities",
      "Feeding & diaper changing",
      "Sleep routine management",
      "Regular updates to parents",
      "First aid certified",
      "Background checked"
    ],
    category: "baby",
    rating: 4.9,
    reviews: 128
  },
  {
    id: 2,
    name: "Elderly Care",
    slug: "elderly-care",
    description: "Compassionate elderly care with medication management, mobility assistance, meal preparation, and companionship.",
    longDescription: "Our elderly care service focuses on providing dignified and respectful care for seniors. We help with daily activities while promoting independence and ensuring their well-being through regular health monitoring and engaging activities. Our caregivers are trained in elderly care, medication management, mobility assistance, and emergency response.",
    price: 30,
    duration: "per hour",
    image: "/images/elderly-care.jpg",
    features: [
      "Medication management",
      "Mobility assistance",
      "Meal preparation",
      "Companionship",
      "Doctor appointment coordination",
      "Light housekeeping",
      "Memory care",
      "Vital signs monitoring"
    ],
    category: "elderly",
    rating: 4.8,
    reviews: 96
  },
  {
    id: 3,
    name: "Sick Care",
    slug: "sick-care",
    description: "Professional nursing care for patients recovering from illness or surgery, including medication administration and vital monitoring.",
    longDescription: "Our sick care service provides professional medical assistance for patients recovering from illness, surgery, or managing chronic conditions. Our trained nurses and caregivers ensure proper medication management, wound care, and regular health monitoring. We work closely with healthcare providers to ensure continuity of care and speedy recovery.",
    price: 35,
    duration: "per hour",
    image: "/images/sick-care.jpg",
    features: [
      "Nursing care",
      "Vital signs monitoring",
      "Medication administration",
      "Post-operative care",
      "Physiotherapy assistance",
      "Emergency response",
      "Wound care",
      "Medical equipment assistance"
    ],
    category: "sick",
    rating: 4.9,
    reviews: 74
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Mother of twins",
    content: "The baby care service saved my life! Professional and caring staff who treated my babies like their own. Highly recommended!",
    rating: 5,
    date: "2024-01-15"
  },
  {
    id: 2,
    name: "Robert Chen",
    role: "Son of elderly patient",
    content: "My father received excellent care for 6 months. The caregivers were punctual, professional, and genuinely caring. Thank you CARE-IO!",
    rating: 5,
    date: "2024-02-20"
  },
  {
    id: 3,
    name: "Maria Garcia",
    role: "Post-surgery patient",
    content: "Recovering from surgery was so much easier with their help. The nurses were knowledgeable and compassionate. 5-star service!",
    rating: 5,
    date: "2024-03-10"
  }
];

export const caregivers = [
  {
    id: 1,
    name: "Emma Wilson",
    specialization: "Pediatric Care",
    experience: "8 years",
    rating: 4.9,
    image: null
  },
  {
    id: 2,
    name: "James Anderson",
    specialization: "Geriatric Care",
    experience: "12 years",
    rating: 4.8,
    image: null
  },
  {
    id: 3,
    name: "Lisa Park",
    specialization: "Nursing Care",
    experience: "10 years",
    rating: 5.0,
    image: null
  }
];