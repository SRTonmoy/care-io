"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

// Sample care-related images (Replace with your actual API endpoint)
const careImages = [
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&h=900&fit=crop", // Elderly care
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&h=900&fit=crop", // Baby care
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1600&h=900&fit=crop", // Home care
  "https://images.unsplash.com/photo-1560743641-3914f2c45636?w=1600&h=900&fit=crop", // Pet care
  "https://images.unsplash.com/photo-1514846326710-096e4a8035e0?w=1600&h=900&fit=crop", // Nursing care
];

const slides = [
  {
    title: "Professional Care Services for Your Loved Ones",
    description:
      "Trusted baby care, elderly support, and specialized nursing services across Bangladesh",
    cta1: { text: "View All Services", link: "/services" },
    cta2: { text: "Book Now", link: "/booking" },
    category: "elderly-care",
  },
  {
    title: "Verified & Trusted Caregivers",
    description:
      "Background-checked caregivers to ensure safety and peace of mind",
    cta1: { text: "Explore Caregivers", link: "/services" },
    cta2: { text: "Get Started", link: "/register" },
    category: "home-care",
  },
  {
    title: "Care That Feels Like Family",
    description:
      "Compassionate care for children, elders, and patients at home",
    cta1: { text: "Our Mission", link: "/about" },
    cta2: { text: "Contact Us", link: "/contact" },
    category: "family-care",
  },
  {
    title: "Pet Care Services",
    description:
      "Loving pet care, walking, and boarding services for your furry family members",
    cta1: { text: "Pet Services", link: "/services/pet-care" },
    cta2: { text: "Book Pet Care", link: "/booking/pet-care" },
    category: "pet-care",
  },
  {
    title: "Specialized Medical Care at Home",
    description:
      "Professional nursing and post-operative care in the comfort of your home",
    cta1: { text: "Medical Services", link: "/services/medical" },
    cta2: { text: "Schedule Visit", link: "/booking/medical" },
    category: "medical-care",
  },
];

// API function to fetch care images (example structure)
async function fetchCareImages(category) {
  // Replace with your actual API call
  // Example: const response = await fetch(`/api/care-images?category=${category}`);
  // const data = await response.json();
  
  // For demo, return matching images based on category
  return careImages;
}

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [images, setImages] = useState(careImages);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch images from API
    const loadImages = async () => {
      setIsLoading(true);
      try {
        // You can fetch based on current slide category if needed
        // const fetchedImages = await fetchCareImages(slides[current].category);
        // setImages(fetchedImages);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setImages(careImages);
      } catch (error) {
       
      } finally {
        setIsLoading(false);
      }
    };
    
    loadImages();
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  return (
    <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
      {/* Background Images with Overlay */}
      <div className="absolute inset-0">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === current % images.length ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={img}
              alt={`Care service ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
          </div>
        ))}
        
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="text-white text-xl">Loading care services...</div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="transition-all duration-700 ease-out transform">
              {/* Category Badge */}
              <div className="inline-block mb-6">
                <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
                  {slides[current].category.replace('-', ' ')}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
                {slides[current].title}
              </h1>

              {/* Description */}
              <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-2xl">
                {slides[current].description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href={slides[current].cta1.link}
                  className="bg-green-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-1 text-center"
                >
                  {slides[current].cta1.text}
                </Link>

                <Link
                  href={slides[current].cta2.link}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:-translate-y-1 text-center"
                >
                  {slides[current].cta2.text}
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 mb-8">
                <div className="text-white">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-gray-300">Happy Families</div>
                </div>
                <div className="text-white">
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-gray-300">Care Support</div>
                </div>
                <div className="text-white">
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-gray-300">Cities Covered</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute left-4 bottom-4 z-30 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all backdrop-blur-sm"
        aria-label={isPlaying ? "Pause slider" : "Play slider"}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className="group relative"
            aria-label={`Go to slide ${i + 1}`}
          >
            <div
              className={`w-12 h-1 rounded-full transition-all ${
                current === i
                  ? "bg-green-400"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {slides[i].category.replace('-', ' ')}
            </div>
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
        <div
          className="h-full bg-green-400 transition-all duration-5000 ease-linear"
          style={{
            width: isPlaying ? '100%' : '0%',
            animation: isPlaying ? 'progress 5s linear' : 'none'
          }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-green-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl"></div>
    </section>
  );
}