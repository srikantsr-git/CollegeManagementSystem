-- Create settings table for branding and theme configuration
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY,
  univ_name TEXT NOT NULL,
  logo_url TEXT,
  theme_preset TEXT NOT NULL DEFAULT 'crimson', -- 'crimson', 'emerald', 'sapphire', 'midnight'
  primary_color TEXT DEFAULT '#800020',
  secondary_color TEXT DEFAULT '#1e293b',
  show_top_header INTEGER DEFAULT 1,
  top_header_phone TEXT DEFAULT '+953 012 3654 896',
  top_header_email TEXT DEFAULT 'support@apex.edu',
  top_header_bg_color TEXT DEFAULT '#800020',
  top_header_text_color TEXT DEFAULT '#ffffff',
  social_facebook TEXT DEFAULT '#',
  social_twitter TEXT DEFAULT '#',
  social_linkedin TEXT DEFAULT '#',
  social_instagram TEXT DEFAULT '#',
  social_youtube TEXT DEFAULT '#',
  top_header_links TEXT DEFAULT '[]',
  show_main_header INTEGER DEFAULT 1,
  univ_tagline TEXT DEFAULT 'Autonomous Institution | Approved by AICTE | Permanently Affiliated',
  accreditation_logos TEXT DEFAULT '[]',
  zonal_features TEXT DEFAULT '[]',
  zonal_features_header TEXT DEFAULT 'Core Zonal Features',
  zonal_features_desc TEXT DEFAULT 'Everything you need to stay updated with university sports, tournament structures, notices, and career opportunities.',
  contact_intro TEXT DEFAULT 'We, the Department of Sports & Physical Education, are always ready to provide information and answers to queries of students. We aim to resolve basic and common questions about courses and other related information.',
  contact_address TEXT DEFAULT 'Department of Sports & Physical Education,\nIravati Karve Social Science Complex, Behind SET Guest House,\nSavitribai Phule Pune University,\n(formerly University of Pune),\nPune - 411007, Maharashtra, INDIA.',
  contact_timings TEXT DEFAULT '10:30 am to 06:00 pm',
  contact_timings_note TEXT DEFAULT 'The University office has holidays on the 1st and the 3rd Saturday of every month.',
  contact_phone1 TEXT DEFAULT '+91 - 20 - 25622428',
  contact_phone2 TEXT DEFAULT '+91 - 20 - 25622429',
  contact_email1 TEXT DEFAULT 'dpe@unipune.ac.in',
  contact_email2 TEXT DEFAULT 'dpeadmin@unipune.ac.in',
  contact_map_query TEXT DEFAULT 'Department of Sports and Physical Education, Savitribai Phule Pune University, Pune',
  show_company_slider INTEGER DEFAULT 1,
  company_slider_title TEXT DEFAULT 'Our Placement Partners & Recruiters',
  company_slider_desc TEXT DEFAULT 'Our graduates have been placed in leading organizations across sports management, education, fitness, and public administration.'
);

-- Create users table (Alumni, Students, Admins)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  role TEXT NOT NULL CHECK(role IN ('student', 'alumni', 'admin')),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  mobile TEXT,
  status TEXT NOT NULL CHECK(status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create alumni profiles table
CREATE TABLE IF NOT EXISTS alumni_profiles (
  user_id INTEGER PRIMARY KEY,
  gender TEXT,
  dob TEXT,
  grad_year INTEGER,
  degree TEXT,
  department TEXT,
  roll_number TEXT,
  company TEXT,
  designation TEXT,
  industry TEXT,
  experience INTEGER,
  city TEXT,
  state TEXT,
  country TEXT,
  address TEXT,
  college TEXT,
  linkedin TEXT,
  website TEXT,
  skills TEXT,
  achievements TEXT,
  photo_url TEXT,
  resume_url TEXT,
  membership_status TEXT DEFAULT 'Active', -- 'Active', 'Premium', 'Lifetime'
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create student profiles table
CREATE TABLE IF NOT EXISTS student_profiles (
  user_id INTEGER PRIMARY KEY,
  grad_year INTEGER,
  degree TEXT,
  department TEXT,
  roll_number TEXT,
  resume_url TEXT,
  resume_name TEXT,
  interests TEXT,
  photo_url TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  time TEXT,
  type TEXT NOT NULL CHECK(type IN ('Reunion', 'Seminar', 'Webinar', 'Networking')),
  location TEXT,
  capacity INTEGER,
  registered_count INTEGER DEFAULT 0,
  image_url TEXT
);

-- Create event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id SERIAL PRIMARY KEY,
  event_id INTEGER,
  user_id INTEGER,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(event_id, user_id)
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  type TEXT NOT NULL CHECK(type IN ('Full-time', 'Part-time', 'Internship')),
  department TEXT,
  description TEXT,
  requirements TEXT,
  salary TEXT,
  posted_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create job applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id SERIAL PRIMARY KEY,
  job_id INTEGER,
  user_id INTEGER,
  resume_url TEXT,
  status TEXT DEFAULT 'applied' CHECK(status IN ('applied', 'reviewing', 'shortlisted', 'rejected')),
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(job_id, user_id)
);

-- Create mentorships table
CREATE TABLE IF NOT EXISTS mentorships (
  id SERIAL PRIMARY KEY,
  mentor_id INTEGER,
  mentee_id INTEGER,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  scheduled_meetings TEXT, -- JSON array of dates/details
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (mentee_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(mentor_id, mentee_id)
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  donor_name TEXT NOT NULL,
  amount REAL NOT NULL,
  campaign TEXT NOT NULL,
  status TEXT DEFAULT 'success',
  receipt_number TEXT UNIQUE,
  donated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  image_url TEXT,
  file_url TEXT,
  file_name TEXT
);

-- Create custom_pages table
CREATE TABLE IF NOT EXISTS custom_pages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  file_url TEXT,
  file_name TEXT,
  parent_menu TEXT DEFAULT 'about',
  menu_type TEXT DEFAULT 'child',
  is_visible INTEGER DEFAULT 1,
  show_slider INTEGER DEFAULT 0,
  slider_slides TEXT DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  duration TEXT NOT NULL,
  intake INTEGER NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create circulars table
CREATE TABLE IF NOT EXISTS circulars (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  file_url TEXT,
  file_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ncte_disclosures table
CREATE TABLE IF NOT EXISTS ncte_disclosures (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  file_url TEXT,
  file_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create committee_members table
CREATE TABLE IF NOT EXISTS committee_members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  photo_url TEXT,
  college_name TEXT,
  college_address TEXT,
  contact_details TEXT,
  sort_order INTEGER DEFAULT 0,
  profile_pdf_url TEXT,
  profile_pdf_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create directors table
CREATE TABLE IF NOT EXISTS directors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  photo_url TEXT,
  mobile_number TEXT,
  email TEXT,
  college_name TEXT,
  college_address TEXT,
  sort_order INTEGER DEFAULT 0,
  profile_pdf_url TEXT,
  profile_pdf_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admission_files table
CREATE TABLE IF NOT EXISTS admission_files (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  file_url TEXT,
  file_name TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create hods table (From HODs/Directors Desk)
CREATE TABLE IF NOT EXISTS hods (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT NOT NULL DEFAULT '',
  photo_url TEXT,
  college_name TEXT,
  college_address TEXT,
  mobile_number TEXT,
  email TEXT,
  message TEXT,
  sort_order INTEGER DEFAULT 0,
  profile_pdf_url TEXT,
  profile_pdf_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create photo gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  image_url TEXT NOT NULL,
  photographer TEXT,
  location TEXT,
  date TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Placement page content
CREATE TABLE IF NOT EXISTS placement_content (
  id SERIAL PRIMARY KEY,
  hero_title TEXT DEFAULT 'Placements',
  hero_subtitle TEXT DEFAULT 'Building careers, Shaping futures',
  content TEXT DEFAULT '',
  stat_placed INTEGER DEFAULT 0,
  stat_companies INTEGER DEFAULT 0,
  stat_package_avg TEXT DEFAULT '0 LPA',
  stat_package_highest TEXT DEFAULT '0 LPA',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Placement companies (recruiter logos)
CREATE TABLE IF NOT EXISTS placement_companies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spotlights table
CREATE TABLE IF NOT EXISTS spotlights (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  grad TEXT,
  photo TEXT,
  text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Slider slides table
CREATE TABLE IF NOT EXISTS slider_slides (
  id SERIAL PRIMARY KEY,
  sort_order INTEGER DEFAULT 0,
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT DEFAULT '',
  description TEXT DEFAULT '',
  btn_text TEXT DEFAULT 'Learn More',
  btn_link TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  overlay_opacity REAL DEFAULT 0.55,
  active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admissions table
CREATE TABLE IF NOT EXISTS admissions (
  id SERIAL PRIMARY KEY,
  course_name TEXT NOT NULL,
  course_subtitle TEXT,
  intro_text TEXT,
  eligibility TEXT,
  age_limit TEXT,
  intake_capacity TEXT,
  duration TEXT,
  timing TEXT,
  medium TEXT,
  fees_indian TEXT,
  fees_international TEXT,
  batch_1_period TEXT,
  batch_1_admission_notice TEXT,
  batch_2_period TEXT,
  batch_2_admission_notice TEXT,
  additional_notes TEXT,
  file_url TEXT,
  file_name TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------
-- SEED DATA
-- ----------------------------------------------------

-- Insert Default Settings
INSERT INTO settings (id, univ_name, logo_url, theme_preset, primary_color, secondary_color)
VALUES (1, 'Apex University', '', 'crimson', '#f8b600', '#04091e')
ON CONFLICT (id) DO NOTHING;

-- Insert Initial Users (Admin, Alumni, Student)
INSERT INTO users (id, role, email, password, full_name, mobile, status) VALUES
(1, 'admin', 'admin@apex.edu', 'admin123', 'Dr. Sarah Jenkins', '+1 (555) 019-2834', 'approved'),
(2, 'alumni', 'john.doe@gmail.com', 'alumni123', 'John Doe', '+1 (555) 012-3456', 'approved'),
(3, 'alumni', 'jane.smith@gmail.com', 'alumni123', 'Jane Smith', '+1 (555) 098-7654', 'approved'),
(4, 'alumni', 'robert.chen@gmail.com', 'alumni123', 'Robert Chen', '+1 (555) 033-4455', 'approved'),
(5, 'alumni', 'pending.alumnus@gmail.com', 'alumni123', 'Alex Carter', '+1 (555) 122-3344', 'pending'),
(6, 'student', 'student.bob@apex.edu', 'student123', 'Bob Johnson', '+1 (555) 077-8899', 'approved'),
(7, 'student', 'student.lily@apex.edu', 'student123', 'Lily Vance', '+1 (555) 066-7788', 'approved'),
(8, 'student', 'pending.student@apex.edu', 'student123', 'Mark Davis', '+1 (555) 044-5566', 'pending')
ON CONFLICT (id) DO NOTHING;

-- Seed Alumni Profiles
INSERT INTO alumni_profiles (user_id, gender, dob, grad_year, degree, department, roll_number, company, designation, industry, experience, city, state, country, linkedin, website, skills, achievements, photo_url, membership_status) VALUES
(2, 'Male', '1990-05-15', 2012, 'B.Tech', 'Computer Science', 'CS12B001', 'Google', 'Staff Software Engineer', 'Technology', 14, 'Mountain View', 'California', 'USA', 'linkedin.com/in/johndoe', 'johndoe.dev', 'React, TypeScript, Go, System Design', 'Recipient of Alumni Tech Innovator Award 2024', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80', 'Lifetime'),
(3, 'Female', '1992-08-22', 2014, 'MBA', 'Business Management', 'MBA14M022', 'Goldman Sachs', 'Vice President', 'Finance', 12, 'New York', 'New York', 'USA', 'linkedin.com/in/janesmith', 'janesmith.com', 'Financial Modeling, Risk Analysis, Leadership', 'Under 30 Finance Leader Award', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80', 'Premium'),
(4, 'Male', '1988-11-02', 2010, 'B.Arch', 'Architecture', 'AR10A005', 'Foster + Partners', 'Senior Architect', 'Real Estate & Design', 16, 'London', 'London', 'UK', 'linkedin.com/in/robertchen', '', 'Urban Planning, BIM, AutoCAD, Sustainable Design', 'Designed the Eco-Civic Library in London', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80', 'Lifetime'),
(5, 'Non-Binary', '1995-04-12', 2017, 'B.Tech', 'Information Technology', 'IT17B099', 'Netflix', 'Senior Frontend Developer', 'Technology', 9, 'Los Angeles', 'California', 'USA', 'linkedin.com/in/alexcarter', 'alexcarter.dev', 'React, CSS Grid, Tailwind, Animations', 'CSS Conference Speaker 2025', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80', 'Active')
ON CONFLICT (user_id) DO NOTHING;

-- Seed Student Profiles
INSERT INTO student_profiles (user_id, grad_year, degree, department, roll_number, resume_url, interests) VALUES
(6, 2027, 'B.Tech', 'Computer Science', 'CS23B104', 'https://example.com/resumes/bob_johnson.pdf', 'Machine Learning, Web Development, Algorithms'),
(7, 2026, 'B.Tech', 'Information Technology', 'IT22B205', 'https://example.com/resumes/lily_vance.pdf', 'Product Management, UI/UX Design, React'),
(8, 2028, 'MBA', 'Business Management', 'MBA26M102', '', 'Investment Banking, Corporate Strategy')
ON CONFLICT (user_id) DO NOTHING;

-- Seed Events
INSERT INTO events (id, title, description, date, time, type, location, capacity, registered_count, image_url) VALUES
(1, 'Annual Global Alumni Reunion 2026', 'Celebrate the journey of Apex University with fellow alumni. Evening gala, panel discussion, and campus tour.', '2026-10-15', '18:00', 'Reunion', 'Main Campus Auditorium & Gardens', 500, 150, 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=300&fit=crop&q=80'),
(2, 'Seminar: Future of AI in Enterprise', 'A deep dive into how large language models are transforming corporate operations. Guest speakers from Google & Netflix.', '2026-07-10', '14:00', 'Seminar', 'Tech Block Hall A', 150, 45, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop&q=80'),
(3, 'Webinar: Launching Your Startup', 'Learn the basics of venture capital funding, startup validation, and scaling. Virtual Zoom link will be sent.', '2026-08-05', '10:00', 'Webinar', 'Online Zoom', 1000, 210, 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=300&fit=crop&q=80'),
(4, 'Executive Networking Mixer', 'Exclusive networking cocktail session for executive alumni, recruiters, and select final year students.', '2026-09-20', '19:30', 'Networking', 'Metropolitan Lounge, New York', 80, 12, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=300&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- Seed Event Registrations
INSERT INTO event_registrations (id, event_id, user_id) VALUES
(1, 1, 2),
(2, 1, 3),
(3, 2, 2),
(4, 2, 6),
(5, 3, 7)
ON CONFLICT (id) DO NOTHING;

-- Seed Jobs
INSERT INTO jobs (id, title, company, location, type, department, description, requirements, salary, posted_by) VALUES
(1, 'Senior Software Engineer (Full Stack)', 'Google', 'Mountain View, CA', 'Full-time', 'Engineering', 'Join the Google Workspace team building next-generation collaboration features. You will design, develop, and deploy rich web interfaces using modern frameworks.', 'B.Tech/MS in Computer Science, 5+ years React/Go experience, System Design capability.', '$180,000 - $220,000', 2),
(2, 'Finance Associate Intern', 'Goldman Sachs', 'New York, NY', 'Internship', 'Finance', 'Summer associate internship at our investment banking division. Conduct valuation analysis, assist in deal preparation, and construct complex financial projections.', 'Pursuing MBA or related graduate finance degree, strong analytical modeling skills.', '$8,000 / month', 3),
(3, 'Frontend Engineer (React)', 'Netflix', 'Los Gatos, CA (Remote)', 'Full-time', 'Engineering', 'Responsible for crafting fluid UI animations, component architecture, and optimizing web performance for our primary streaming client.', '3+ years React development, master of Tailwind CSS or CSS, animation expertise.', '$150,000 - $190,000', 4)
ON CONFLICT (id) DO NOTHING;

-- Seed Mentorships
INSERT INTO mentorships (id, mentor_id, mentee_id, status, notes, scheduled_meetings) VALUES
(1, 2, 6, 'approved', 'Mentoring in Machine learning pipelines and general software career growth.', '[{"date": "2026-06-28", "time": "16:00", "topic": "Review Project Architecture"}, {"date": "2026-07-15", "time": "16:00", "topic": "System Design Prep"}]'),
(2, 3, 7, 'pending', 'Interested in learning about Goldman Sachs summer intern expectations.', '[]')
ON CONFLICT (id) DO NOTHING;

-- Seed Donations
INSERT INTO donations (id, user_id, donor_name, amount, campaign, status, receipt_number) VALUES
(1, 2, 'John Doe', 1000.0, 'Scholarship Fund for Underprivileged Students', 'success', 'REC-2026-0001'),
(2, 3, 'Jane Smith', 5000.0, 'New Campus Sports Center Development', 'success', 'REC-2026-0002'),
(3, NULL, 'Anonymous Alumnus', 250.0, 'Scholarship Fund for Underprivileged Students', 'success', 'REC-2026-0003')
ON CONFLICT (id) DO NOTHING;

-- Seed News
INSERT INTO news (id, title, description, date, image_url) VALUES
(1, 'Apex University Launches Center for Artificial Intelligence', 'A state-of-the-art AI laboratory funded by a generous $5M donation from our tech alumni panel.', '2026-06-18', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&q=80'),
(2, 'Annual Alumni Awards Ceremony Announced', 'Nominate outstanding graduates for leadership, innovation, and community service. Submissions close July 31.', '2026-05-30', 'https://images.unsplash.com/photo-1531058020387-3be344559be6?w=500&q=80'),
(3, 'New Sports Complex Construction Begins', 'Construction has officially started on our new multi-purpose sports complex, sponsored by class of 2014.', '2026-06-10', 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=500&q=80')
ON CONFLICT (id) DO NOTHING;

-- Seed Custom Pages
INSERT INTO custom_pages (id, title, content, file_url, file_name, parent_menu, menu_type) VALUES 
('about_us', 'About Us', 'Apex University Sports Committee promotes athletic excellence, organizes collegiate tournaments, and strengthens community health through a variety of sports leagues, events, and training programs.', NULL, NULL, 'about', 'child'),
('committee', 'Committee', 'The Pune City Sports Committee comprises distinguished physical education directors, principals, and coordinators dedicated to organizing zonals, state-level selections, and governing collegiate sports events.', NULL, NULL, 'about', 'child'),
('director', 'Director of Phy. Edu.', 'A message from the Director of Physical Education: "Our vision is to build a robust sports ecosystem that encourages high participation, fosters teamwork, and produces state and national-level champions."', NULL, NULL, 'about', 'child'),
('circulars', 'Circulars', 'Download the latest administrative circulars, guidelines for tournament registration, eligibility forms, and official announcements here.', NULL, NULL, 'about', 'child'),
('news_notices', 'News and Notices', 'Get all the latest news, notices, and updates regarding physical education, university sports events, schedules, circular decisions, and notifications.', NULL, NULL, 'about', 'child'),
('souvenirs', 'Souvenirs', 'Browse our digital souvenirs, annual sports magazines, history of trophies, and memorable group photographs from previous collegiate meets.', NULL, NULL, 'student', 'child'),
('calendar', 'Sports Calendar', 'Schedule of all upcoming inter-collegiate matches, athletics selections, and zone-level tournaments for the academic year 2026.', NULL, NULL, 'student', 'child'),
('draws', 'Sports Draws', 'Check tournament bracket draws, match timetables, and team schedules for collegiate matches.', NULL, NULL, 'student', 'child'),
('results', 'Sports Results', 'Check tournament bracket draws, match timetables, and final event results. Keep track of tournament champions and runners-up.', NULL, NULL, 'student', 'child'),
('courses', 'Academic Courses', 'The Department of Physical Education offers dynamic teacher education and sports science programs including B.P.Ed., M.P.Ed., and Ph.D. degrees to nurture sports administrators and educators.', NULL, NULL, 'academic', 'child'),
('admission', 'Admissions Notice & Prospectus', 'Certificate / Foundation Course in Yoga Education (FCYE) :
The Department is offering a Three-Month Foundation Course in Yoga Education (formerly known as Certificate Course in Yoga Education) twice a year.

1st Batch : August to November (Admission process starts in the first week of July)
2nd Batch : February to May (Admission process starts in the first week of January)

Course Details :
- Eligibility : Minimum 12th Std. or Equivalent Exam Exam Pass
- Age Limit : 18 to 60 years (Candidates should be medically fit and sound)
- Intake Capacity : 50 students
- Duration : Three (03) months
- Timing : 03:00 pm to 06:00 pm (Monday to Friday, except University holidays)
- Medium of Instruction & Examination : English & Marathi

Course Fees :
- For Indian Nationals : Tuition Fee Rs. 20,000/- + Other Fees as per University Rules
- For International Students : Tuition Fee Rs. 60,000/- + Other Fees as per University Rules
*International Students should apply through the International Centre, SPPU', NULL, NULL, 'academic', 'child'),
('syllabus', 'Syllabus & Course Structure', 'Download detailed curriculum schemes, credit distributions, and semester-wise syllabus guidelines for all physical education and sports sciences programs.', NULL, NULL, 'academic', 'child'),
('academic_results', 'Academic Examination Results', 'Check examination results, internal assessment scores, merit lists, and official marksheets for various physical education programs here.', NULL, NULL, 'academic', 'child')
ON CONFLICT (id) DO NOTHING;

-- Seed Circulars
INSERT INTO circulars (id, title, description, date, file_url, file_name) VALUES
(1, 'Pune City Zone Sports Committee Circular 2026-1', 'Guidelines and eligibility criteria for collegiate registration in Zonal sports tournaments.', '2026-06-01', NULL, NULL),
(2, 'Tournament Allocation & Entry Fee Notice', 'Notice regarding college entry fees and tournament center allocations for the upcoming season.', '2026-06-15', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Seed NCTE Disclosures
INSERT INTO ncte_disclosures (id, title, description, date, file_url, file_name) VALUES
(1, 'NCTE Mandatory Disclosure Report 2026', 'Official mandatory disclosure details, compliance details, and institutional data for NCTE teacher education programs.', '2026-06-10', NULL, NULL),
(2, 'Institutional Affiliation & NCTE Recognition Order', 'Official recognition order issued by Western Regional Committee (WRC) NCTE along with college affiliation documents.', '2026-06-20', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Seed Committee Members
INSERT INTO committee_members (id, name, designation, photo_url, college_name, college_address, contact_details, sort_order) VALUES
(1, 'Prin. Dr. Iqbal N. Shaikh', 'President', 'https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/1)%20Prin.%20Dr.%20Iqubal%20Shaikh.JPG', 'Anjuman Khairul Islam Poona College', '1647, Camp, New Modikhana, Pune', '', 1),
(2, 'Dr. Shaikh Aiyaz Hussain Jiyaull Hussain', 'Secretary', 'https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/2)%20Dr.%20Shaikh%20Aiyaz%20Hussain%20Jiyaull%20Hussain.JPG', 'Anjuman Khairul Islam Poona College', '1647, Camp, New Modikhana, Pune', 'Mobile No. : 9422517809', 2),
(3, 'Prof. (Dr.) Amrule Mohan Namdeo', 'Joint Secretary', 'https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/3)%20Prof.%20(Dr.)%20Amrule%20Mohan%20Namdeo.JPG', 'Deccan Education Society''s B.M. College of Commerce', '845, Shivajinagar, Daccan Gymkhana, Pune', 'Mobile No. : 9881600118', 3),
(4, 'Prof. (Dr.) Bengle Asha Vijaykumar', 'Joint Secretary', 'https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/4)%20Prof.%20(Dr.)%20Bengle%20Asha%20Vijaykumar.JPG', 'Maharashtra Education Society''s Abasaheb Garware Mahavidyalay', 'Karve Road, Pune', 'Mobile No. : 9922223233', 4),
(5, 'Mr. Sharma Anirudha Mahesh', 'Joint Secretary', 'https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/5)%20Mr.%20Sharma%20Anirudha%20Mahesh.JPG', 'Symbiosis College of Arts & Commerce', 'Senapati Bapat Road, Pune', 'Mobile No. : 7709999997', 5),
(6, 'Dr. Bibave Umesh Arun', 'Treasurer', 'https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/6)%20Dr.%20Bibave%20Umesh%20Arun.JPG', 'Maharashtra Education Society''s Garware College Of Commerce', 'Off Karve Road, Pune', 'Mobile No. : 7350509990', 6),
(7, 'Dr. Chikte Anagha Sunil', 'Member', 'https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/7)%20Dr.%20Chikte%20Anagha%20Sunil.JPG', 'Shri Sidhvinayak Mahila Mahavidyalaya', 'Karvenagar, Pune', 'Mobile No. : 9850710713', 7),
(8, 'Prof. (Dr.) Dhamale Shantaram Dattu', 'Member', 'https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/8)%20Prof.%20(Dr.)%20Dhamale%20Shantaram%20Dattu.JPG', 'SMSS Jedhe Arts, Commerce & Science College', '425, Shukrwar Peth, Pune', 'Mobile No. : 9421077180', 8),
(9, 'Dr. Shendkar Deepak Tanaji', 'Member', 'https://pczsc.in/pczsc-data_files/2022-23/Committee%20Member%20Photos/11)%20Dr%20Deepak%20Shendkar_small.jpeg', 'PES Modern Arts, Commerce & Science College', 'Ganeshkhind, Pune', 'Mobile No. : 9823839014', 9),
(10, 'Dr. More Shirish Vijay', 'Member', 'https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/10)%20Dr.%20More%20Shirish%20Vijay.JPG', 'Chandrashekhar Agashe College of Physical Education', 'Gultekadi, Pune', 'Mobile No. : 9545455910', 10),
(11, 'Dr. Kondhare Manisha Manoj', 'Member', 'https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/11)%20Dr.%20Kondhare%20Manisha%20Manoj.JPG', 'AISSMS College of Engineering', 'Kennedy Road, Pune', 'Mobile No. : 9881294721', 11),
(12, 'Mr. Parse Abhijit Venkat', 'Member', 'https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/12)%20Mr.%20Parse%20Abhijit%20Venkat.JPG', 'Sanskar Mandir Art''s & Commerce College', 'Warje Malwadi, Pune', 'Mobile No. : 9028088199', 12),
(13, 'Dr. Abhijeet Kadam', 'Member', 'https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/13)%20Dr.%20Abhijeet%20Kadam.JPG', 'Dept. of Sports & Physical Education, SPPU', 'Savitribai Phule Pune University, Pune', 'Mobile No. : 9689827038', 13),
(14, 'Mr. Tribhuvan Mithun Prakash', 'Invitee Member', 'https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/14)%20Mr.%20Tribhuvan%20Mithun%20Prakash.JPG', 'Ness Wadia College of Commerce', '19, V.K Joag Path, Pune', 'Mobile No. : 9890776333', 14)
ON CONFLICT (id) DO NOTHING;

-- Seed Directors
INSERT INTO directors (id, name, photo_url, mobile_number, email, college_name, college_address, sort_order) VALUES
(1, 'Dr. Chikte Anagha Sunil', 'https://pczsc.in/pczsc-data_files/2025-26/Photos%20-%20Director%20of%20Physical%20Education/Chikte%20Anagha%20Sunil.JPG', '9850710713', 'anaghaschikte@yahoo.co.in', 'Maharshi Karve Stree Shikshan Sanstha''s Shri Sidhvinayak Mahila Mahavidyalaya', 'Karvenagar, Pune', 1),
(2, 'Prof. (Dr.) Dhamale Shantaram Dattu', 'https://pczsc.in/pczsc-data_files/2025-26/Photos%20-%20Director%20of%20Physical%20Education/Dhamale%20Shantaram%20Dattu.JPG', '9421077180', 'dhamaleshantaram96@gmail.com', 'Shri Shivaji Maratha Society''s Samajbhushan Baburao Alias Appasaheb Jedhe Arts, Commerce & Science College, 425', 'Shukrwar Peth, Pune', 2),
(3, 'Dr. Jadhav Balaji Pandurang', '', '9850775478', 'jadhavbalaji.jadhav@gmail.com', 'The Poona Diocesan Educational Society''s Vidya Bhavan College of Commerce, 20', 'Sholpur Road, Bhairobanala, Pune', 3),
(4, 'Dr. Shendkar Deepak Tanaji', 'https://pczsc.in/pczsc-data_files/2025-26/Photos%20-%20Director%20of%20Physical%20Education/Shendkar%20Deepak%20Tanaji.jpeg', '9823839014', 'dtshendkar@gmail.com', 'Progressive Education Society''s Modern Arts, Commerce & Science College, Ganeshkhind', 'Pune', 4),
(5, 'Prof. (Dr.) Bengle Asha Vijaykumar', 'https://pczsc.in/pczsc-data_files/2025-26/Photos%20-%20Director%20of%20Physical%20Education/Bengle%20Asha%20Vijaykumar.JPG', '9922223233', 'asha.bengle007@gmail.com', 'Maharashtra Education Society''s Abasaheb Garware Mahavidyalay, Karve Road', 'Pune', 5),
(6, 'Prof. (Dr.) Amrule Mohan Namdeo', 'https://pczsc.in/pczsc-data_files/2025-26/Photos%20-%20Director%20of%20Physical%20Education/Amrule%20Mohan%20Namdeo.JPG', '9881600118', 'amrulemohan69@gmail.com', 'Deccan Education Society''s B.M. College of Commerce, 845, Shivajinagar, Daccan Gymkhana', 'Pune', 6),
(7, 'Dr. Shaikh Aiyaz Hussain Jiyaull Hussain', 'https://pczsc.in/pczsc-data_files/2025-26/Photos%20-%20Director%20of%20Physical%20Education/Shaikh%20Aiyaz%20Hussain%20Jiyaull%20Hussain.JPG', '9422517809', 'aiyaz9422@yahoo.co.in', 'Anjuman Khairul Islam''s Poona College, 1647, Camp, New Modikhana', 'Pune', 7),
(8, 'Dr. Shelke Sudam Ramchandra', 'https://pczsc.in/pczsc-data_files/2025-26/Photos%20-%20Director%20of%20Physical%20Education/Shelke%20Sudam%20Ramchandra.JPG', '9422835676', 'shelkesudam123@gmail.com', 'Akhil Bhartiy Maratha Shikshan Parishad''s Shri Shahu Mandir Mahavidyalaya', 'Pune', 8),
(9, 'Dr. Pawar Gurunath Balasaheb', 'https://pczsc.in/pczsc-data_files/2025-26/Photos%20-%20Director%20of%20Physical%20Education/Pawar%20Gurunath%20Balasaheb.JPG', '9168782531', 'sujit.pawar19@gmail.com', 'Maharashtra Girl''s Education Society''s Huzurpaga Shrimati Durgabai Mukunddas Lohiya Mahila Vanijya Mahavidyalaya, 691, Narayan Peth, Laxmi Road', 'Pune', 9),
(10, 'Dr. More Shirish Vijay', 'https://pczsc.in/pczsc-data_files/2025-26/Photos%20-%20Director%20of%20Physical%20Education/More%20Shirish%20Vijay.JPG', '9545455910', 'shirish.more100@gmail.com', 'Maharashtriy Mandal''s Chandrashekhar Agashe College of Physical Eduaction, Gultekadi', 'Pune', 10),
(11, 'Dr. Phale Vikram Suresh', 'https://pczsc.in/pczsc-data_files/2025-26/Photos%20-%20Director%20of%20Physical%20Education/Phale%20Vikram%20Suresh.JPG', '9822028133', 'vikramphale15@gmail.com', 'Progressive Education Society''s Modern College, Shivajinagar', 'Pune', 11),
(12, 'Dr. Augustine Anjushree Anthony', 'https://pczsc.in/pczsc-data_files/2025-26/Photos%20-%20Director%20of%20Physical%20Education/Augustine%20Anjushree%20Anthony.JPG', '8007786487', 'anjushree.augustine@cumminscollege.in', 'Maharshi Karve Stree Shikshan Sanstha''s MKSSS''s Cummins College of Engineering for Women, Karvenagar', 'Pune', 12),
(13, 'Dr. Pawar Yogesh Laxmanrao', 'https://pczsc.in/pczsc-data_files/2025-26/Photos%20-%20Director%20of%20Physical%20Education/Pawar%20Yogesh%20Laxmanrao.JPG', '9850952787', 'dryogesh.pawar@yahoo.com', 'Pune District Education Association''s Mamasaheb Mohol Mahavidyalaya, 48/1-A, Erandwane, Paud Road', 'Pune', 13),
(14, 'Dube Rishi Rajendra', 'https://pczsc.in/pczsc-data_files/2025-26/Photos%20-%20Director%20of%20Physical%20Education/Dube%20Rishi%20Rajendra.JPG', '9762434949', 'rishidube.rd@gmail.com', 'The P.G.K. Mandal''s H.V. Desai College, Desai Brothers Vidyabhavan, 596, Budhavar Peth', 'Pune', 14),
(15, 'Girigosavi Amit Ankush', 'https://pczsc.in/pczsc-data_files/2025-26/Photos%20-%20Director%20of%20Physical%20Education/Girigosavi%20Amit%20Ankush.JPG', '9423341824', 'amitgirigosavi@gmail.com', 'Marathwada Mitra Mandal''s College of Commerce, 302/A, Deccan Gymkhana', 'Pune', 15),
(16, 'Dr. Kadam Abhijeet Babanrao', 'https://pczsc.in/pczsc-data_files/2025-26/Photos%20-%20Director%20of%20Physical%20Education/Kadam%20Abhijeet%20Babanrao.JPG', '9689827038', 'abhijit1207@yahoo.com', 'Post Graduate Gymkhana, Department of Sports & Physical Education, Savitribai Phule Pune University, Ganeshkhind Road', 'Pune-411007', 16),
(17, 'Dr. Patil Gauri Gajanan', 'https://pczsc.in/pczsc-data_files/2025-26/Photos%20-%20Director%20of%20Physical%20Education/Patil%20Gauri%20Gajanan.JPG', '9860765655', 'gaurigpatil2767@gmail.com', 'Bharati Vidyapeeth Mahila Abhiyantriki Mahavidyalay, Pune-Satara Road, Dhanakawadi', 'Pune', 17),
(18, 'Dr. Tambe Rohit Prakash', 'https://pczsc.in/pczsc-data_files/2025-26/Photos%20-%20Director%20of%20Physical%20Education/Tambe%20Rohit%20Prakash.JPG', '9890436863', 'rohit.tambe02@gmail.com', 'Kannada Sangh Pune''s, Kaveri College of Arts, Science & Commerce, 36, Ganeshnagar, Erandwane', 'Pune', 18),
(19, 'Patare Mukundraj Ashokrao', 'https://pczsc.in/pczsc-data_files/2025-26/Photos%20-%20Director%20of%20Physical%20Education/Patare%20Mukundraj%20Ashokrao.JPG', '9881824080', 'mpatare@gmail.com', 'Bansilal Ramnath Agarwal Charitable Trust''s Vishwakarma Institute of Technology, 666, Upper Indira Nagar, Bibwewadi', 'Pune', 19),
(20, 'Navale Santosh Ramachandra', '', '9881046721', 'snavale22@gmail.com', 'Sinhgad Technical Education Society''s Sinhgad College of Science, Survey No 44-1, Off. Sinhgad Road, Ambegaon', 'Pune', 20),
(21, 'Tribhuvan Mithun Prakash', 'https://pczsc.in/pczsc-data_files/2025-26/Photos%20-%20Director%20of%20Physical%20Education/Tribhuvan%20Mithun%20Prakash.JPG', '9890776333', 'Mithun.tribhuvan333@gmail.com', 'Modern Education Society''s Ness Wadia College Of Commerce, 19, V.K. Joag Path', 'Pune', 21),
(22, 'Banne Namadev Ravasaheb', 'https://pczsc.in/pczsc-data_files/2025-26/Photos%20-%20Director%20of%20Physical%20Education/Banne%20Namadev%20Ravasaheb.JPG', '8951742256', 'namadevrbanne@gmail.com', 'Pune Vidyarthi Griha PVG''S College of Engineering, Technology & Management, S.No. 44, Vidyanagari, Shivdarshan, Parvati', 'Pune', 22)
ON CONFLICT (id) DO NOTHING;

-- Seed Spotlights
INSERT INTO spotlights (id, name, role, grad, photo, text) VALUES
(1, 'John Doe', 'Staff Software Engineer at Google', 'Class of 2012 (Computer Science)', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&q=80', '"My years at Apex University formed the bedrock of my engineering career. The alumni network opened doors to my first internships, which eventually led me to Google. Serving as a mentor now is my way of giving back."'),
(2, 'Jane Smith', 'Vice President at Goldman Sachs', 'Class of 2014 (Business Management)', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&q=80', '"The mentorship and rigorous education I received set me up to tackle the challenges of Wall Street. The community is incredibly supportive, and I am proud to sponsor scholarship funds for future business leaders."'),
(3, 'Robert Chen', 'Senior Architect at Foster + Partners', 'Class of 2010 (Architecture)', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&q=80', '"Design is collaborative, and the creative environment at Apex taught me to push boundaries. Reconnecting with alumni in Europe helped establish my career abroad. It is a lifelong community."')
ON CONFLICT (id) DO NOTHING;

-- Seed Placement Content
INSERT INTO placement_content (id, hero_title, hero_subtitle, content, stat_placed, stat_companies, stat_package_avg, stat_package_highest)
VALUES (1, 'Training & Placement Cell', 'Empowering students with industry-ready skills and connecting them with top recruiters worldwide.', '<h2>About Our Placement Cell</h2><p>The Training and Placement Cell of our institution serves as a vital bridge between academia and the corporate world. We are dedicated to preparing students for the dynamic demands of the professional environment through comprehensive training programs, mock interviews, and industry interactions.</p><p>Our placement cell maintains strong relationships with leading companies across various sectors, ensuring a wide range of career opportunities for our graduating students.</p><h2>Our Training Programs</h2><p>We offer specialized training in aptitude, communication skills, technical skills, and personality development throughout the academic year. Industry experts conduct regular sessions to keep students updated with the latest trends.</p>', 450, 85, '6.5 LPA', '42 LPA')
ON CONFLICT (id) DO NOTHING;

-- Seed Placement Companies
INSERT INTO placement_companies (id, name, logo_url, website, sort_order) VALUES
(1, 'Google', 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', 'https://google.com', 1),
(2, 'Goldman Sachs', 'https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg', 'https://goldmansachs.com', 2),
(3, 'Netflix', 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', 'https://netflix.com', 3),
(4, 'Microsoft', 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_2012.svg', 'https://microsoft.com', 4),
(5, 'Amazon', 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', 'https://amazon.com', 5),
(6, 'Tata Consultancy Services', 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg', 'https://tcs.com', 6),
(7, 'Infosys', 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg', 'https://infosys.com', 7)
ON CONFLICT (id) DO NOTHING;

-- Seed Slider Slides
INSERT INTO slider_slides (id, sort_order, title, subtitle, description, btn_text, btn_link, image_url, overlay_opacity, active) VALUES
(1, 1, 'Excellence in Sports', 'Pune City Zone Sports Committee', 'Nurturing talent, promoting teamwork, and celebrating sportsmanship across Pune colleges.', 'Explore Events', '/student/events', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1600&auto=format&fit=crop&q=80', 0.55, 1),
(2, 2, 'Champion Alumni Network', 'Connect & Grow', 'Bridging the gap between our veteran sports champions and student-athletes.', 'Alumni Directory', '/directory', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&auto=format&fit=crop&q=80', 0.6, 1),
(3, 3, 'State-of-the-Art Facilities', 'Train Like a Pro', 'Explore our top-tier tracks, multi-purpose gyms, and expert-led training camps.', 'Our Facilities', '/about/facilities', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=80', 0.5, 1)
ON CONFLICT (id) DO NOTHING;

-- Results / Draws table
CREATE TABLE IF NOT EXISTS results (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  sport TEXT DEFAULT 'General',
  category TEXT DEFAULT '',
  file_url TEXT,
  file_name TEXT,
  published INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Results
INSERT INTO results (id, title, description, date, sport, category, file_url, file_name, published) VALUES
(1, 'Football Knockout Bracket 2026 – Quarter Finals', 'Quarter-final match schedules and venue allocations for the city-zone football championship. All matches at Shivajinagar Ground.', '2026-04-05', 'Football', 'Draw', NULL, NULL, 1),
(2, 'Inter-Collegiate Cricket Tournament 2025-26 – Final Results', 'St. Xavier''s College won the zonal cricket championship defeating Fergusson College 187-164. Player of the Match: Rohit Sharma (St. Xavier''s).', '2026-01-15', 'Cricket', 'Final', NULL, NULL, 1),
(3, 'Athletics Zone Selection 2025-26 – Draw & Fixtures', 'District-level draw for the 100m, 200m, 400m sprints and relay events has been published. Report at Gate 3 by 7:30 AM on match day.', '2026-03-10', 'Athletics', 'Draw', NULL, NULL, 1)
ON CONFLICT (id) DO NOTHING;

-- Seed Admissions
INSERT INTO admissions (id, course_name, course_subtitle, intro_text, eligibility, age_limit, intake_capacity, duration, timing, medium, fees_indian, fees_international, batch_1_period, batch_1_admission_notice, batch_2_period, batch_2_admission_notice, additional_notes, sort_order) VALUES
(1, 'Certificate / Foundation Course in Yoga Education (FCYE)', 'Foundation Course in Yoga Education', 'The Department is offering a Three-Month Foundation Course in Yoga Education (formerly known as Certificate Course in Yoga Education) twice a year.', 'Minimum 12th Std. or Equivalent Exam Pass', '18 to 60 years (Candidates should be medically fit and sound)', '50 students', 'Three (03) months', '03:00 pm to 06:00 pm (Monday to Friday, except University holidays)', 'English & Marathi (Instruction & Examination)', 'Tuition Fee Rs. 20,000/- + Other Fees as per University Rules', 'Tuition Fee Rs. 60,000/- + Other Fees as per University Rules. International Students should apply through the International Centre, SPPU.', 'August to November', 'Admission process starts in the first week of July', 'February to May', 'Admission process starts in the first week of January', 'For further details, contact the Department of Physical Education office directly during working hours.', 1)
ON CONFLICT (id) DO NOTHING;


-- ----------------------------------------------------
-- SEQUENCE RESETS
-- ----------------------------------------------------
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(MAX(id), 1)) FROM users;
SELECT setval(pg_get_serial_sequence('events', 'id'), COALESCE(MAX(id), 1)) FROM events;
SELECT setval(pg_get_serial_sequence('event_registrations', 'id'), COALESCE(MAX(id), 1)) FROM event_registrations;
SELECT setval(pg_get_serial_sequence('jobs', 'id'), COALESCE(MAX(id), 1)) FROM jobs;
SELECT setval(pg_get_serial_sequence('mentorships', 'id'), COALESCE(MAX(id), 1)) FROM mentorships;
SELECT setval(pg_get_serial_sequence('donations', 'id'), COALESCE(MAX(id), 1)) FROM donations;
SELECT setval(pg_get_serial_sequence('news', 'id'), COALESCE(MAX(id), 1)) FROM news;
SELECT setval(pg_get_serial_sequence('circulars', 'id'), COALESCE(MAX(id), 1)) FROM circulars;
SELECT setval(pg_get_serial_sequence('ncte_disclosures', 'id'), COALESCE(MAX(id), 1)) FROM ncte_disclosures;
SELECT setval(pg_get_serial_sequence('committee_members', 'id'), COALESCE(MAX(id), 1)) FROM committee_members;
SELECT setval(pg_get_serial_sequence('directors', 'id'), COALESCE(MAX(id), 1)) FROM directors;
SELECT setval(pg_get_serial_sequence('admission_files', 'id'), COALESCE(MAX(id), 1)) FROM admission_files;
SELECT setval(pg_get_serial_sequence('hods', 'id'), COALESCE(MAX(id), 1)) FROM hods;
SELECT setval(pg_get_serial_sequence('gallery', 'id'), COALESCE(MAX(id), 1)) FROM gallery;
SELECT setval(pg_get_serial_sequence('placement_content', 'id'), COALESCE(MAX(id), 1)) FROM placement_content;
SELECT setval(pg_get_serial_sequence('placement_companies', 'id'), COALESCE(MAX(id), 1)) FROM placement_companies;
SELECT setval(pg_get_serial_sequence('spotlights', 'id'), COALESCE(MAX(id), 1)) FROM spotlights;
SELECT setval(pg_get_serial_sequence('slider_slides', 'id'), COALESCE(MAX(id), 1)) FROM slider_slides;
SELECT setval(pg_get_serial_sequence('admissions', 'id'), COALESCE(MAX(id), 1)) FROM admissions;
SELECT setval(pg_get_serial_sequence('results', 'id'), COALESCE(MAX(id), 1)) FROM results;
