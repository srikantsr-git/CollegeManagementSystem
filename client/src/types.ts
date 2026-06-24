export interface Settings {
  univ_name: string;
  logo_url: string;
  theme_preset: 'crimson' | 'emerald' | 'sapphire' | 'midnight';
  primary_color: string;
  secondary_color: string;
}

export interface User {
  id: number;
  role: 'student' | 'alumni' | 'admin';
  email: string;
  full_name: string;
  mobile: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AlumniProfile {
  user_id: number;
  full_name: string;
  email: string;
  mobile: string;
  gender: string;
  dob: string;
  grad_year: number;
  degree: string;
  department: string;
  roll_number: string;
  company: string;
  designation: string;
  industry: string;
  experience: number;
  city: string;
  state: string;
  country: string;
  address?: string;
  college?: string;
  linkedin: string;
  website: string;
  skills: string;
  achievements: string;
  photo_url: string;
  resume_url: string;
  membership_status: 'Active' | 'Premium' | 'Lifetime';
}

export interface StudentProfile {
  user_id: number;
  full_name: string;
  email: string;
  mobile: string;
  grad_year: number;
  degree: string;
  department: string;
  roll_number: string;
  resume_url: string;
  interests: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'Reunion' | 'Seminar' | 'Webinar' | 'Networking';
  location: string;
  capacity: number;
  registered_count: number;
  image_url: string;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Internship';
  department: string;
  description: string;
  requirements: string;
  salary: string;
  posted_by: number;
  created_at: string;
}

export interface JobApplication {
  id: number;
  job_id: number;
  user_id: number;
  resume_url: string;
  status: 'applied' | 'reviewing' | 'shortlisted' | 'rejected';
  applied_at: string;
}

export interface Meeting {
  date: string;
  time: string;
  topic: string;
}

export interface Mentorship {
  id: number;
  mentor_id: number;
  mentor_name?: string;
  company?: string;
  designation?: string;
  photo_url?: string;
  skills?: string;
  mentee_id: number;
  mentee_name?: string;
  degree?: string;
  department?: string;
  interests?: string;
  email?: string;
  status: 'pending' | 'approved' | 'rejected';
  notes: string;
  scheduled_meetings: string; // JSON string representing Meeting[]
  created_at: string;
}

export interface Donation {
  id: number;
  user_id: number | null;
  donor_name: string;
  amount: number;
  campaign: string;
  status: string;
  receipt_number: string;
  donated_at: string;
}
