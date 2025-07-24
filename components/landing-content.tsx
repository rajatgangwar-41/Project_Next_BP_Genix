"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const testimonials = [
  {
    name: "Aisha Sharma",
    avatar: "A",
    title: "Product Manager",
    description: "Incredible user experience, truly intuitive!",
  },
  {
    name: "Ben Carter",
    avatar: "B",
    title: "UX Designer",
    description: "The design is sleek and highly functional.",
  },
  {
    name: "Chloe Davis",
    avatar: "C",
    title: "Data Analyst",
    description: "Powerful features that made my work so much easier.",
  },
  {
    name: "David Lee",
    avatar: "D",
    title: "Marketing Specialist",
    description: "Helped us reach new heights in our campaigns!",
  },
  {
    name: "Emily White",
    avatar: "E",
    title: "Freelance Writer",
    description: "A must-have tool for anyone in content creation.",
  },
  {
    name: "Frank Green",
    avatar: "F",
    title: "Small Business Owner",
    description: "Transformed how I manage my daily operations.",
  },
  {
    name: "Grace Hall",
    avatar: "G",
    title: "Student",
    description: "Easy to learn and incredibly helpful for my studies.",
  },
  {
    name: "Henry Kim",
    avatar: "H",
    title: "Researcher",
    description: "Provided the insights I needed quickly and accurately.",
  },
  {
    name: "Isabella Clark",
    avatar: "I",
    title: "Customer Support Lead",
    description: "Our team's productivity has significantly improved.",
  },
  {
    name: "Jack Miller",
    avatar: "J",
    title: "Game Developer",
    description: "Revolutionized my workflow; absolutely essential!",
  },
  {
    name: "Kelly Johnson",
    avatar: "K",
    title: "Financial Advisor",
    description: "An indispensable tool for managing my clients' portfolios.",
  },
  {
    name: "Liam O'Connell",
    avatar: "L",
    title: "Chef",
    description: "Helped me streamline my kitchen operations and inventory!",
  },
]

export const LandingContent = () => {
  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">
        Testimonials
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map((item) => (
          <Card
            key={item.description}
            className="bg-[#192339] border-none text-white"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <div>
                  <p className="text-lg">{item.name}</p>
                  <p className="text-zinc-400 text-sm">{item.title}</p>
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0">
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
