import React from 'react';
import TestimonialCard from './TestimonialCard';

const testimonials = [
  {
    name: 'John Doe',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    testimonial: 'This service is amazing! It really helped me streamline my workflow and save time.',
  },
  {
    name: 'Jane Smith',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    testimonial: 'I love using this product. It is user-friendly and reliable.',
  },
  {
    name: 'Ariana',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    testimonial: 'I love using this product. It is user-friendly and reliable.',
  },
  {
    name: 'Aarav Sharma',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    testimonial: 'This app has made managing my work much easier. Highly recommend!',
  },
  {
    name: 'Priya Patel',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    testimonial: 'The customer support is fantastic. They really care about their users.',
  },
  {
    name: 'Vikram Singh',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    testimonial: 'A very intuitive and efficient product. It saves me so much time!',
  },
  {
    name: 'Neha Gupta',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    testimonial: 'I have been using this service for months, and I am very happy with it.',
  },
  {
    name: 'Ravi Kumar',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
    testimonial: 'The user interface is sleek, and the performance is top-notch.',
  },
  {
    name: 'Sanya Rao',
    image: 'https://randomuser.me/api/portraits/women/4.jpg',
    testimonial: 'I’ve recommended this service to all my friends and family.',
  },
  {
    name: 'Manish Verma',
    image: 'https://randomuser.me/api/portraits/men/5.jpg',
    testimonial: 'Great value for money! I am seeing real improvements in my daily tasks.',
  },
];

const Testimonials = () => {
  return (
    <div className="p-6 h-[300px] flex justify-center items-center relative overflow-hidden">
      <div className="flex space-x-6 animate-slideTestimonial">
        {testimonials.map((item, index) => (
          <TestimonialCard
            key={index}
            name={item.name}
            image={item.image}
            testimonial={item.testimonial}
          />
        ))}
      </div>
      {/* Blur effect at both ends */}
      <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-black opacity-30" />
      <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-black opacity-30" />
    </div>
  );
};

export default Testimonials;
