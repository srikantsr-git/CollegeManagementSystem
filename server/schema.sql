-- Create settings table for branding and theme configuration
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  univ_name TEXT NOT NULL,
  logo_url TEXT,
  theme_preset TEXT NOT NULL DEFAULT 'crimson', -- 'crimson', 'emerald', 'sapphire', 'midnight'
  primary_color TEXT DEFAULT '#800020',
  secondary_color TEXT DEFAULT '#1e293b'
);

-- Create users table (Alumni, Students, Admins)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
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
  interests TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
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
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER,
  user_id INTEGER,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(event_id, user_id)
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
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
  id INTEGER PRIMARY KEY AUTOINCREMENT,
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
  id INTEGER PRIMARY KEY AUTOINCREMENT,
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
  id INTEGER PRIMARY KEY AUTOINCREMENT,
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
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  image_url TEXT
);

-- Insert Default Settings (OR IGNORE: won't overwrite admin changes on restart)
INSERT OR IGNORE INTO settings (id, univ_name, logo_url, theme_preset, primary_color, secondary_color)
VALUES (1, 'Apex University', '', 'crimson', '#f8b600', '#04091e');

-- Insert Initial Admin
INSERT OR IGNORE INTO users (id, role, email, password, full_name, mobile, status)
VALUES (1, 'admin', 'admin@apex.edu', 'admin123', 'Dr. Sarah Jenkins', '+1 (555) 019-2834', 'approved');

-- Insert Initial Alumni
INSERT OR IGNORE INTO users (id, role, email, password, full_name, mobile, status)
VALUES (2, 'alumni', 'john.doe@gmail.com', 'alumni123', 'John Doe', '+1 (555) 012-3456', 'approved');

INSERT OR IGNORE INTO alumni_profiles (user_id, gender, dob, grad_year, degree, department, roll_number, company, designation, industry, experience, city, state, country, linkedin, website, skills, achievements, photo_url, membership_status)
VALUES (2, 'Male', '1990-05-15', 2012, 'B.Tech', 'Computer Science', 'CS12B001', 'Google', 'Staff Software Engineer', 'Technology', 14, 'Mountain View', 'California', 'USA', 'linkedin.com/in/johndoe', 'johndoe.dev', 'React, TypeScript, Go, System Design', 'Recipient of Alumni Tech Innovator Award 2024', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80', 'Lifetime');

INSERT OR IGNORE INTO users (id, role, email, password, full_name, mobile, status)
VALUES (3, 'alumni', 'jane.smith@gmail.com', 'alumni123', 'Jane Smith', '+1 (555) 098-7654', 'approved');

INSERT OR IGNORE INTO alumni_profiles (user_id, gender, dob, grad_year, degree, department, roll_number, company, designation, industry, experience, city, state, country, linkedin, website, skills, achievements, photo_url, membership_status)
VALUES (3, 'Female', '1992-08-22', 2014, 'MBA', 'Business Management', 'MBA14M022', 'Goldman Sachs', 'Vice President', 'Finance', 12, 'New York', 'New York', 'USA', 'linkedin.com/in/janesmith', 'janesmith.com', 'Financial Modeling, Risk Analysis, Leadership', 'Under 30 Finance Leader Award', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80', 'Premium');

INSERT OR IGNORE INTO users (id, role, email, password, full_name, mobile, status)
VALUES (4, 'alumni', 'robert.chen@gmail.com', 'alumni123', 'Robert Chen', '+1 (555) 033-4455', 'approved');

INSERT OR IGNORE INTO alumni_profiles (user_id, gender, dob, grad_year, degree, department, roll_number, company, designation, industry, experience, city, state, country, linkedin, website, skills, achievements, photo_url, membership_status)
VALUES (4, 'Male', '1988-11-02', 2010, 'B.Arch', 'Architecture', 'AR10A005', 'Foster + Partners', 'Senior Architect', 'Real Estate & Design', 16, 'London', 'London', 'UK', 'linkedin.com/in/robertchen', '', 'Urban Planning, BIM, AutoCAD, Sustainable Design', 'Designed the Eco-Civic Library in London', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80', 'Lifetime');

-- Seed a Pending Alumnus to test admin approval
INSERT OR IGNORE INTO users (id, role, email, password, full_name, mobile, status)
VALUES (5, 'alumni', 'pending.alumnus@gmail.com', 'alumni123', 'Alex Carter', '+1 (555) 122-3344', 'pending');

INSERT OR IGNORE INTO alumni_profiles (user_id, gender, dob, grad_year, degree, department, roll_number, company, designation, industry, experience, city, state, country, linkedin, website, skills, achievements, photo_url, membership_status)
VALUES (5, 'Non-Binary', '1995-04-12', 2017, 'B.Tech', 'Information Technology', 'IT17B099', 'Netflix', 'Senior Frontend Developer', 'Technology', 9, 'Los Angeles', 'California', 'USA', 'linkedin.com/in/alexcarter', 'alexcarter.dev', 'React, CSS Grid, Tailwind, Animations', 'CSS Conference Speaker 2025', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80', 'Active');

-- Insert Initial Students
INSERT OR IGNORE INTO users (id, role, email, password, full_name, mobile, status)
VALUES (6, 'student', 'student.bob@apex.edu', 'student123', 'Bob Johnson', '+1 (555) 077-8899', 'approved');

INSERT OR IGNORE INTO student_profiles (user_id, grad_year, degree, department, roll_number, resume_url, interests)
VALUES (6, 2027, 'B.Tech', 'Computer Science', 'CS23B104', 'https://example.com/resumes/bob_johnson.pdf', 'Machine Learning, Web Development, Algorithms');

INSERT OR IGNORE INTO users (id, role, email, password, full_name, mobile, status)
VALUES (7, 'student', 'student.lily@apex.edu', 'student123', 'Lily Vance', '+1 (555) 066-7788', 'approved');

INSERT OR IGNORE INTO student_profiles (user_id, grad_year, degree, department, roll_number, resume_url, interests)
VALUES (7, 2026, 'B.Tech', 'Information Technology', 'IT22B205', 'https://example.com/resumes/lily_vance.pdf', 'Product Management, UI/UX Design, React');

-- Seed a Pending Student
INSERT OR IGNORE INTO users (id, role, email, password, full_name, mobile, status)
VALUES (8, 'student', 'pending.student@apex.edu', 'student123', 'Mark Davis', '+1 (555) 044-5566', 'pending');

INSERT OR IGNORE INTO student_profiles (user_id, grad_year, degree, department, roll_number, resume_url, interests)
VALUES (8, 2028, 'MBA', 'Business Management', 'MBA26M102', '', 'Investment Banking, Corporate Strategy');

-- Insert Events
INSERT OR IGNORE INTO events (id, title, description, date, time, type, location, capacity, registered_count, image_url)
VALUES (1, 'Annual Global Alumni Reunion 2026', 'Celebrate the journey of Apex University with fellow alumni. Evening gala, panel discussion, and campus tour.', '2026-10-15', '18:00', 'Reunion', 'Main Campus Auditorium & Gardens', 500, 150, 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=300&fit=crop&q=80');

INSERT OR IGNORE INTO events (id, title, description, date, time, type, location, capacity, registered_count, image_url)
VALUES (2, 'Seminar: Future of AI in Enterprise', 'A deep dive into how large language models are transforming corporate operations. Guest speakers from Google & Netflix.', '2026-07-10', '14:00', 'Seminar', 'Tech Block Hall A', 150, 45, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop&q=80');

INSERT OR IGNORE INTO events (id, title, description, date, time, type, location, capacity, registered_count, image_url)
VALUES (3, 'Webinar: Launching Your Startup', 'Learn the basics of venture capital funding, startup validation, and scaling. Virtual Zoom link will be sent.', '2026-08-05', '10:00', 'Webinar', 'Online Zoom', 1000, 210, 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=300&fit=crop&q=80');

INSERT OR IGNORE INTO events (id, title, description, date, time, type, location, capacity, registered_count, image_url)
VALUES (4, 'Executive Networking Mixer', 'Exclusive networking cocktail session for executive alumni, recruiters, and select final year students.', '2026-09-20', '19:30', 'Networking', 'Metropolitan Lounge, New York', 80, 12, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=300&fit=crop&q=80');

-- Insert Event Registrations
INSERT OR IGNORE INTO event_registrations (event_id, user_id) VALUES (1, 2);
INSERT OR IGNORE INTO event_registrations (event_id, user_id) VALUES (1, 3);
INSERT OR IGNORE INTO event_registrations (event_id, user_id) VALUES (2, 2);
INSERT OR IGNORE INTO event_registrations (event_id, user_id) VALUES (2, 6);
INSERT OR IGNORE INTO event_registrations (event_id, user_id) VALUES (3, 7);

-- Insert Jobs
INSERT OR IGNORE INTO jobs (id, title, company, location, type, department, description, requirements, salary, posted_by)
VALUES (1, 'Senior Software Engineer (Full Stack)', 'Google', 'Mountain View, CA', 'Full-time', 'Engineering', 'Join the Google Workspace team building next-generation collaboration features. You will design, develop, and deploy rich web interfaces using modern frameworks.', 'B.Tech/MS in Computer Science, 5+ years React/Go experience, System Design capability.', '$180,000 - $220,000', 2);

INSERT OR IGNORE INTO jobs (id, title, company, location, type, department, description, requirements, salary, posted_by)
VALUES (2, 'Finance Associate Intern', 'Goldman Sachs', 'New York, NY', 'Internship', 'Finance', 'Summer associate internship at our investment banking division. Conduct valuation analysis, assist in deal preparation, and construct complex financial projections.', 'Pursuing MBA or related graduate finance degree, strong analytical modeling skills.', '$8,000 / month', 3);

INSERT OR IGNORE INTO jobs (id, title, company, location, type, department, description, requirements, salary, posted_by)
VALUES (3, 'Frontend Engineer (React)', 'Netflix', 'Los Gatos, CA (Remote)', 'Full-time', 'Engineering', 'Responsible for crafting fluid UI animations, component architecture, and optimizing web performance for our primary streaming client.', '3+ years React development, master of Tailwind CSS or CSS, animation expertise.', '$150,000 - $190,000', 4);

-- Insert Mentorship
INSERT OR IGNORE INTO mentorships (id, mentor_id, mentee_id, status, notes, scheduled_meetings)
VALUES (1, 2, 6, 'approved', 'Mentoring in Machine learning pipelines and general software career growth.', '[{"date": "2026-06-28", "time": "16:00", "topic": "Review Project Architecture"}, {"date": "2026-07-15", "time": "16:00", "topic": "System Design Prep"}]');

INSERT OR IGNORE INTO mentorships (id, mentor_id, mentee_id, status, notes, scheduled_meetings)
VALUES (2, 3, 7, 'pending', 'Interested in learning about Goldman Sachs summer intern expectations.', '[]');

-- Insert Donations
INSERT OR IGNORE INTO donations (id, user_id, donor_name, amount, campaign, status, receipt_number)
VALUES (1, 2, 'John Doe', 1000.0, 'Scholarship Fund for Underprivileged Students', 'success', 'REC-2026-0001');

INSERT OR IGNORE INTO donations (id, user_id, donor_name, amount, campaign, status, receipt_number)
VALUES (2, 3, 'Jane Smith', 5000.0, 'New Campus Sports Center Development', 'success', 'REC-2026-0002');

INSERT OR IGNORE INTO donations (id, user_id, donor_name, amount, campaign, status, receipt_number)
VALUES (3, NULL, 'Anonymous Alumnus', 250.0, 'Scholarship Fund for Underprivileged Students', 'success', 'REC-2026-0003');

-- Create custom_pages table
CREATE TABLE IF NOT EXISTS custom_pages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  file_url TEXT,
  file_name TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial News
INSERT OR REPLACE INTO news (id, title, description, date, image_url)
VALUES (1, 'Apex University Launches Center for Artificial Intelligence', 'A state-of-the-art AI laboratory funded by a generous $5M donation from our tech alumni panel.', '2026-06-18', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&q=80');

INSERT OR REPLACE INTO news (id, title, description, date, image_url)
VALUES (2, 'Annual Alumni Awards Ceremony Announced', 'Nominate outstanding graduates for leadership, innovation, and community service. Submissions close July 31.', '2026-05-30', 'https://images.unsplash.com/photo-1531058020387-3be344559be6?w=500&q=80');

INSERT OR REPLACE INTO news (id, title, description, date, image_url)
VALUES (3, 'New Sports Complex Construction Begins', 'Construction has officially started on our new multi-purpose sports complex, sponsored by class of 2014.', '2026-06-10', 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=500&q=80');

-- Seed default custom pages
INSERT OR REPLACE INTO custom_pages (id, title, content, file_url, file_name) VALUES 
('about_us', 'About Us', 'Apex University Pune City Zone Sports Committee (PCZSC) promotes athletic excellence, organizes collegiate tournaments, and strengthens community health through a variety of sports leagues, events, and training programs.', NULL, NULL),
('committee', 'PCZSC Committee', 'The Pune City Zone Sports Committee comprises distinguished physical education directors, principals, and coordinators dedicated to organizing zonals, state-level selections, and governing collegiate sports events.', NULL, NULL),
('director', 'Director of Phy. Edu.', 'A message from the Director of Physical Education: "Our vision is to build a robust sports ecosystem that encourages high participation, fosters teamwork, and produces state and national-level champions."', NULL, NULL),
('circulars', 'Circulars', 'Download the latest administrative circulars, guidelines for tournament registration, eligibility forms, and official announcements here.', NULL, NULL),
('souvenirs', 'Souvenirs', 'Browse our digital souvenirs, annual sports magazines, history of trophies, and memorable group photographs from previous collegiate meets.', NULL, NULL),
('calendar', 'Sports Calendar', 'Schedule of all upcoming inter-collegiate matches, athletics selections, and zone-level tournaments for the academic year 2026.', NULL, NULL),
('draws', 'Sports Draws', 'Check tournament bracket draws, match timetables, and team schedules for collegiate matches.', NULL, NULL),
('results', 'Sports Results', 'Check tournament bracket draws, match timetables, and final event results. Keep track of tournament champions and runners-up.', NULL, NULL),
('courses', 'Academic Courses', 'The Department of Physical Education offers dynamic teacher education and sports science programs including B.P.Ed., M.P.Ed., and Ph.D. degrees to nurture sports administrators and educators.', NULL, NULL),
('admission', 'Admissions Notice & Prospectus', 'Certificate / Foundation Course in Yoga Education (FCYE) :
The Department is offering a Three-Month Foundation Course in Yoga Education (formerly known as Certificate Course in Yoga Education) twice a year.

1st Batch : August to November (Admission process starts in the first week of July)
2nd Batch : February to May (Admission process starts in the first week of January)

Course Details :
- Eligibility : Minimum 12th Std. or Equivalent Exam Pass
- Age Limit : 18 to 60 years (Candidates should be medically fit and sound)
- Intake Capacity : 50 students
- Duration : Three (03) months
- Timing : 03:00 pm to 06:00 pm (Monday to Friday, except University holidays)
- Medium of Instruction & Examination : English & Marathi

Course Fees :
- For Indian Nationals : Tuition Fee Rs. 20,000/- + Other Fees as per University Rules
- For International Students : Tuition Fee Rs. 60,000/- + Other Fees as per University Rules
*International Students should apply through the International Centre, SPPU', NULL, NULL),
('syllabus', 'Syllabus & Course Structure', 'Download detailed curriculum schemes, credit distributions, and semester-wise syllabus guidelines for all physical education and sports sciences programs.', NULL, NULL),
('academic_results', 'Academic Examination Results', 'Check examination results, internal assessment scores, merit lists, and official marksheets for various physical education programs here.', NULL, NULL);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  duration TEXT NOT NULL,
  intake INTEGER NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create circulars table
CREATE TABLE IF NOT EXISTS circulars (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  file_url TEXT,
  file_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed default circulars
INSERT OR REPLACE INTO circulars (id, title, description, date, file_url, file_name) VALUES
(1, 'Pune City Zone Sports Committee Circular 2026-1', 'Guidelines and eligibility criteria for collegiate registration in Zonal sports tournaments.', '2026-06-01', NULL, NULL),
(2, 'Tournament Allocation & Entry Fee Notice', 'Notice regarding college entry fees and tournament center allocations for the upcoming season.', '2026-06-15', NULL, NULL);

-- Create ncte_disclosures table
CREATE TABLE IF NOT EXISTS ncte_disclosures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  file_url TEXT,
  file_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed default NCTE disclosures
INSERT OR REPLACE INTO ncte_disclosures (id, title, description, date, file_url, file_name) VALUES
(1, 'NCTE Mandatory Disclosure Report 2026', 'Official mandatory disclosure details, compliance details, and institutional data for NCTE teacher education programs.', '2026-06-10', NULL, NULL),
(2, 'Institutional Affiliation & NCTE Recognition Order', 'Official recognition order issued by Western Regional Committee (WRC) NCTE along with college affiliation documents.', '2026-06-20', NULL, NULL);

-- Create committee_members table
CREATE TABLE IF NOT EXISTS committee_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
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

-- Seed default committee members
INSERT OR IGNORE INTO committee_members (id, name, designation, photo_url, college_name, college_address, contact_details, sort_order) VALUES
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
(14, 'Mr. Tribhuvan Mithun Prakash', 'Invitee Member', 'https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/14)%20Mr.%20Tribhuvan%20Mithun%20Prakash.JPG', 'Ness Wadia College of Commerce', '19, V.K Joag Path, Pune', 'Mobile No. : 9890776333', 14);



-- Create directors table
CREATE TABLE IF NOT EXISTS directors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
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

-- Seed default directors
INSERT OR IGNORE INTO directors (id, name, photo_url, mobile_number, email, college_name, college_address, sort_order) VALUES
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
(22, 'Banne Namadev Ravasaheb', 'https://pczsc.in/pczsc-data_files/2025-26/Photos%20-%20Director%20of%20Physical%20Education/Banne%20Namadev%20Ravasaheb.JPG', '8951742256', 'namadevrbanne@gmail.com', 'Pune Vidyarthi Griha PVG''S College of Engineering, Technology & Management, S.No. 44, Vidyanagari, Shivdarshan, Parvati', 'Pune', 22);

-- Create admission_files table
CREATE TABLE IF NOT EXISTS admission_files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  file_url TEXT,
  file_name TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admission_files table
CREATE TABLE IF NOT EXISTS admission_files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  file_url TEXT,
  file_name TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create hods table (From HODs/Directors Desk)
CREATE TABLE IF NOT EXISTS hods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
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
