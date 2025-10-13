import React from 'react';
import Image from 'next/image';

// Reusable component for team members
const TeamMemberCard = ({ name, role, image }: { name: string; role: string; image: string }) => (
  <div className="text-center">
    <Image
      className="mx-auto h-40 w-40 rounded-full object-cover"
      src={image}
      alt={`Photo of ${name}`}
      width={160}
      height={160}
      unoptimized
    />
    <h3 className="mt-6 text-xl font-semibold leading-7 tracking-tight text-white">{name}</h3>
    <p className="text-sm leading-6 text-yellow-400">{role}</p>
  </div>
);

// Reusable component for displaying company values
const ValueCard = ({
  iconPath,
  title,
  children,
}: {
  iconPath: string;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="relative pl-9">
    <dt className="inline font-semibold text-white">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-1 top-1 h-5 w-5 text-yellow-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
      </svg>
      {title}
    </dt>
    <dd className="inline text-gray-400"> {children}</dd>
  </div>
);

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'John Carter',
      role: 'Founder & CEO',
      image: 'https://placehold.co/400x400/1F2937/FFFFFF?text=CEO',
    },
    {
      name: 'Jane Doe',
      role: 'Head of Operations',
      image: 'https://placehold.co/400x400/1F2937/FFFFFF?text=COO',
    },
    {
      name: 'Mike Williams',
      role: 'Lead Logistics',
      image: 'https://placehold.co/400x400/1F2937/FFFFFF?text=Logistics',
    },
    {
      name: 'Sarah Brown',
      role: 'Customer Support Manager',
      image: 'https://placehold.co/400x400/1F2937/FFFFFF?text=Support',
    },
  ];

  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden py-24 sm:py-32">
        <Image
          src="https://placehold.co/1600x900/111827/374151?text=Our+Warehouse"
          alt="Warehouse background"
          fill
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gray-900/60 mix-blend-multiply" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              About BuildMart
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              We&apos;re not just a supplier; we&apos;re the foundation of your success. Learn about
              our mission to provide the best construction materials with unparalleled service.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-24 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div>
            <div className="text-base leading-7 text-gray-400">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Our Story
              </h2>
              <p className="mt-6">
                BuildMart was founded in 2010 with a simple but powerful vision: to streamline the
                procurement process for builders, contractors, and DIY enthusiasts alike. Frustrated
                by the delays and inconsistent quality from existing suppliers, our founder, John
                Carter, set out to create a one-stop shop for reliable, high-quality construction
                materials.
              </p>
              <p className="mt-8">
                From a small local warehouse, we&apos;ve grown into a leading regional distributor,
                but our core principles remain the same. We believe that every successful project
                starts with a solid foundation, and that foundation is built on quality materials
                and a supplier you can trust. We leverage technology to make ordering seamless and
                logistics to ensure your materials arrive on-site, on time, every time.
              </p>
            </div>
          </div>
          <div className="lg:pt-4">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Our Values</h2>
            <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-300 lg:max-w-none">
              <ValueCard
                title="Quality First"
                iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              >
                We stand behind every product we sell. Our materials are sourced from top
                manufacturers and undergo rigorous quality checks.
              </ValueCard>
              <ValueCard
                title="Customer Commitment"
                iconPath="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              >
                Your project&apos;s success is our priority. Our team is dedicated to providing
                expert advice and unwavering support.
              </ValueCard>
              <ValueCard
                title="Absolute Reliability"
                iconPath="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              >
                We understand that time is money in the construction business. We are obsessed with
                on-time delivery and transparent communication.
              </ValueCard>
            </dl>
          </div>
        </div>
      </div>

      {/* Our Team Section */}
      <div className="bg-gray-800 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Meet Our Leadership
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-400">
              The dedicated team behind our commitment to quality and service.
            </p>
          </div>
          <div className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {teamMembers.map(person => (
              <TeamMemberCard key={person.name} {...person} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
