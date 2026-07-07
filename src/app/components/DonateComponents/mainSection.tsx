'use client';

import React from 'react';

export default function MainSection() {
  const onClickDonate = () => {
    // Add your donate logic here
    alert('Thank you for supporting Lokalads!');
  };

  return (
    <div className="max-w-screen-lg container mx-auto flex flex-col items-stretch flex-nowrap px-4 sm:px-6 lg:px-16 py-4">
      {/* Info */}
      <div className="text-center">
        <h2 className="mt-4 text-2xl font-bold mb-2 text-slate-700 sm:text-3xl">
          Support Lokalads: Together, We build Stronger Communities!
        </h2>
        <p className="text-lg mb-2 italic text-slate-700 sm:text-xl">
          "Your contribution keeps Lokalads free and growing, so millions can
          benefit from our platform"
        </p>
      </div>

      {/* Donation Selection Options */}
      <form className="block">
        <div className="px-4 py-4 flex flex-col gap-3 rounded-md mb-10">
          <legend className="text-center text-lg sm:text-xl font-semibold mb-3 select-none">
            Choose your contribution amount:
          </legend>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 mb-4">
            {[
              { id: 'optOne', amount: '£10', desc: 'Help keep Lokalads running smoothly everyday.' },
              { id: 'optTwo', amount: '£30', desc: 'Drive essential improvements and innovation.' },
              { id: 'optThree', amount: '£50', desc: 'Empower us to deliver better features and services.' },
              { id: 'optFour', amount: '£100', desc: 'Be the reason Lokalads transforms for the better.' },
              { id: 'optFive', amount: '£500', desc: 'Fuel a bigger change and help us reach more communities.' },
              { id: 'optNine', amount: 'Other Amount', desc: 'Every pound counts. Customize your support and make a difference!' },
            ].map(({ id, amount, desc }) => (
              <label
                key={id}
                htmlFor={id}
                className="relative pl-4 pr-12 py-3 bg-transparent border border-slate-400 rounded-lg hover:bg-zinc-100 has-[:checked]:ring-2 has-[:checked]:text-blue-600 has-[:checked]:bg-blue-50 has-[:checked]:ring-blue-400 select-none flex flex-col gap-1"
              >
                <span className="text-2xl sm:text-3xl text-slate-800 font-bold">{amount}</span>
                <span className="text-base text-slate-600">{desc}</span>
                <input
                  type="radio"
                  name="status"
                  className="peer/html size-8 absolute accent-current right-3 top-1/2 -translate-y-1/2"
                  id={id}
                />
              </label>
            ))}
          </div>

          {/* Other Amount Input */}
          <div className="border-l-4 border-blue-500 bg-blue-50 text-green-800 p-4 pl-6">
            <label htmlFor="otherAmount" className="block text-xl font-medium text-gray-700 mb-2">
              Please Enter Other Amount
            </label>
            <div className="mt-1">
              <input
                id="otherAmount"
                name="otherAmount"
                type="text"
                autoComplete="off"
                placeholder="Other Amount"
                className="block w-2/3 appearance-none py-3 px-4 rounded-md bg-gray-100 placeholder-gray-500 border border-gray-700 focus:border-sky-900 focus:ring-2 focus:bg-white focus:outline-none focus:ring-blue-500 focus:ring-inset"
              />
            </div>
          </div>
        </div>

        {/* Horizontal Separator */}
        <hr className="w-full h-px my-8 bg-gray-200 border-0" />

        {/* Donator Details */}
        <div className="px-4 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8 gap-y-6">
          <h2 className="sm:col-span-2 text-2xl">Please enter your details:</h2>

          <div>
            <label htmlFor="name" className="block text-base font-medium text-gray-700">
              Your Full Name
            </label>
            <div className="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Please enter your full name"
                required
                className="block w-full appearance-none py-3 px-4 rounded-md bg-gray-100 placeholder-gray-500 border border-gray-700 focus:border-sky-900 focus:ring-2 focus:bg-white focus:outline-none focus:ring-blue-500 focus:ring-inset"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Your Email Address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Please enter your email address"
                required
                className="block w-full appearance-none py-3 px-4 rounded-md bg-gray-100 placeholder-gray-500 border border-gray-700 focus:border-sky-900 focus:ring-2 focus:bg-white focus:outline-none focus:ring-blue-500 focus:ring-inset"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="message" className="block text-base font-medium text-gray-700">
              Do you want to say anything? (Optional)
            </label>
            <div className="mt-1">
              <textarea
                id="message"
                name="message"
                rows={3}
                placeholder="Feel free to say your experience with Lokalads!"
                className="block w-full appearance-none py-3 px-4 rounded-md bg-gray-100 placeholder-gray-500 border border-gray-700 focus:border-sky-900 focus:ring-2 focus:bg-white focus:outline-none focus:ring-blue-500 focus:ring-inset"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Form Footer */}
        <div className="flex justify-center py-5">
          <button
            type="submit"
            onClick={onClickDonate}
            className="mt-6 px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-xl text-yellow-900 font-semibold rounded-full focus:outline-none"
          >
            Yes, I want to Support Lokalads!
          </button>
        </div>
      </form>

      {/* Sub headline */}
      <p className="mt-4 mb-8 text-xl text-slate-800 text-center">
        ...every contribution empowers us to enhance your experience, introduce
        new features, and keep Lokalads thriving for everyone. Be a part of this
        journey!
      </p>
    </div>
  );
}
