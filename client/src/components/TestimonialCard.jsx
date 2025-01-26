import React from 'react';
import '../index.css'
const TestimonialCard = ({ name, image, testimonial }) => {
  return (
    <div className="bg-white bg-opacity-30 backdrop-blur-sm p-6 rounded-lg shadow-xl w-[300px] mx-4 space-y-4">
      <div className="flex items-center space-x-4">
        <img
          src={image}
          alt={name}
          className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
        />
        <div>
          <h3 className="text-xl font-semibold text-white text-shadow-glow">{name}</h3>
          <p className="text-sm text-gray-400 text-shadow-glow">Customer</p>
        </div>
      </div>
      <p className=" mt-4 italic text-shadow-glow">"{testimonial}"</p>
      <div className="flex justify-end">
        <span className=" text-xs text-shadow-glow">Testimonial</span>
      </div>
    </div>
  );
};

export default TestimonialCard;
