export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "My daughter used to say school wasn't for her. After a session at Focus + FLEX, she came home asking to build her own app. Something shifted.",
    name: "Renee T.",
    role: "Parent, Focus + FLEX Academy",
  },
  {
    quote:
      "Marked Minds doesn't just tutor students — they build environments where kids remember they're capable. That distinction matters.",
    name: "Marcus D.",
    role: "School Partner",
  },
  {
    quote:
      "The team shows up prepared, on time, and genuinely invested in our families. That's rare, and our community feels the difference.",
    name: "Angela P.",
    role: "Community Organization Partner",
  },
  {
    quote:
      "I've watched students who were disengaged in traditional classrooms lead group projects with confidence after just one session cycle.",
    name: "Dr. Imani C.",
    role: "Guest Educator",
  },
];
