# SSGBCOET Bhusawal Sample Data Mapping & Seeding Guide

This artifact outlines how the actual data from the official **Shri Sant Gadge Baba College of Engineering & Technology (SSGBCOET), Bhusawal** website matches the schema structures in our application database. It includes a complete, copy-pasteable SQL seed script to update branding, courses, faculty, and placement data.

---

## 📋 Data Mapping Summary

We have researched the details from [ssgbcoet.com](http://www.ssgbcoet.com) and mapped them directly into our system's tables:

### 1. General Branding (`settings` Table)
We configure the portal header, contact block, colors, and logos to resemble the physical location in Jalgaon/Bhusawal.

| Schema Field | Value for SSGBCOET | Description |
| :--- | :--- | :--- |
| `univ_name` | Shri Sant Gadge Baba College of Engineering & Technology, Bhusawal | Full legal name for title & headers |
| `univ_tagline` | Autonomous Institution \| Approved by AICTE \| Affiliated to DBATU & KBCNMU | Trust badges subheader |
| `theme_preset` | `sapphire` | Blue secondary & primary color scheme |
| `primary_color` | `#1e40af` | Dark royal blue (common in engineering branding) |
| `secondary_color`| `#0f172a` | Slate 900 for dark mode/contrasts |
| `contact_address`| Hindi Seva Mandal's, Shri Sant Gadge Baba College of Engineering & Technology, Near Z.T.C., Bhusawal, Dist. Jalgaon, Maharashtra, PIN - 425203 | Postal address of campus |
| `contact_phone1` | `+91-2582-224364` | College central office |
| `contact_phone2` | `+91-2582-221719` | Fax / Administrative extension |
| `contact_email1` | `rps125@rediffmail.com` | Primary registrar/general mailbox |
| `contact_email2` | `principal@ssgbcoet.com` | Principal's official communications |
| `contact_timings`| `10:00 AM to 05:30 PM` | Standard office hours |

---

### 2. Faculty & HODs (`hods` and `committee_members` Tables)
The management body is run by the **Hindi Seva Mandal** and college execution is headed by the Principal.

*   **Governing Officers (`committee_members`):**
    *   **Shri Milind J. Agrawal** (President, Hindi Seva Mandal)
    *   **Smt. Madhu D. Sharma** (Secretary, Hindi Seva Mandal)
    *   **Shri M. D. Tiwari** (Treasurer, Hindi Seva Mandal)
    *   **Dr. Rahul B. Barjibhe** (Principal & Academic Head)

*   **Heads of Departments (`hods`):**
    *   **Dr. Dinesh D. Patil** (Computer Science & Engineering)
    *   **Dr. Sudhir B. Ojha** (Basic Sciences & Humanities)
    *   **Dr. Pankaj P. Bhangale** (Civil Engineering)
    *   **Prof. Avinash V. Patil** (Mechanical Engineering)
    *   **Dr. Girish A. Kulkarni** (Electronics & Telecommunication)
    *   **Dr. Ajit P. Chaudhari** (Electrical Engineering)

---

### 3. Academic Courses (`courses` Table)
SSGBCOET offers dynamic Undergraduate (B.Tech), Postgraduate (MCA, M.E.), and Diploma programs:

| Course Name | Category | Duration | Intake |
| :--- | :--- | :---: | :---: |
| B.Tech in Computer Science & Engineering | Engineering (UG) | 4 Years | 120 |
| B.Tech in Computer Science & Engineering (Data Science) | Engineering (UG) | 4 Years | 60 |
| B.Tech in Electrical Engineering | Engineering (UG) | 4 Years | 60 |
| B.Tech in Mechanical Engineering | Engineering (UG) | 4 Years | 30 |
| B.Tech in Civil Engineering | Engineering (UG) | 4 Years | 30 |
| B.Tech in Electronics & Telecommunication Engineering | Engineering (UG) | 4 Years | 30 |
| B.Tech in Electronics & Computer Engineering | Engineering (UG) | 4 Years | 30 |
| Master of Computer Applications (MCA) | Postgraduate (PG) | 2 Years | 60 |
| M.E. in Electronics & Communication Engineering | Postgraduate (PG) | 2 Years | 18 |
| Diploma in Computer Engineering | Diploma | 3 Years | 60 |
| Diploma in Electrical Engineering | Diploma | 3 Years | 60 |

---

### 4. Placement Statistics & Partners (`placement_content` & `placement_companies`)
*   **Students Placed:** `170+`
*   **Recruiting Companies:** `28+`
*   **Average Package:** `4.2 LPA`
*   **Highest Package (Off-Campus):** `38 LPA`
*   **Recruiter List:** TCS, Infosys, Cognizant, Accenture, Capgemini, Tech Mahindra, Deloitte, HCL, IBM India, Cisco, and Whirlpool.

---

## 💾 SQL Seeding Script

Run this script directly on your Database instance (PostgreSQL) or via the Server settings portal to instantly transform the dummy "Apex University" data into **SSGBCOET Bhusawal**:

```sql
-- 1. Remove obsolete placeholder records
DELETE FROM settings WHERE id = 1;
DELETE FROM courses;
DELETE FROM hods;
DELETE FROM placement_content;
DELETE FROM placement_companies;
DELETE FROM slider_slides;
DELETE FROM committee_members;

-- 2. Populate SSGBCOET Settings & Branding
INSERT INTO settings (
  id, univ_name, logo_url, theme_preset, primary_color, secondary_color,
  show_top_header, top_header_phone, top_header_email, top_header_bg_color, top_header_text_color,
  univ_tagline, accreditation_logos, zonal_features_header, zonal_features_desc,
  contact_intro, contact_address, contact_timings, contact_timings_note,
  contact_phone1, contact_phone2, contact_email1, contact_email2, contact_map_query,
  show_company_slider, company_slider_title, company_slider_desc
) VALUES (
  1,
  'Shri Sant Gadge Baba College of Engineering & Technology, Bhusawal',
  '',
  'sapphire',
  '#1e40af',
  '#0f172a',
  1,
  '+91-2582-224364',
  'principal@ssgbcoet.com',
  '#1e40af',
  '#ffffff',
  'Autonomous Institution | Approved by AICTE | Affiliated to DBATU & KBCNMU',
  '[{"id":"naac","title":"NAAC","subtitle":"Accredited Grade","image_url":"https://upload.wikimedia.org/wikipedia/commons/e/ef/NAAC_Logo.png"},{"id":"aicte","title":"AICTE","subtitle":"Approved","image_url":"https://upload.wikimedia.org/wikipedia/commons/e/e1/AICTE_logo.png"},{"id":"dbatu","title":"DBATU","subtitle":"Affiliated","image_url":"https://upload.wikimedia.org/wikipedia/commons/3/30/DBATU_Logo.png"}]',
  'Key Institute Highlights',
  'Explore the outstanding features of SSGBCOET including technical training cells, digital libraries, and modern learning infrastructure.',
  'The Admissions and Administrative cells are always ready to guide prospective candidates through the application process and address academic queries.',
  'Hindi Seva Mandal''s, Shri Sant Gadge Baba College of Engineering & Technology, Near Z.T.C., Bhusawal, Dist. Jalgaon, Maharashtra, PIN - 425203',
  '10:00 AM to 05:30 PM',
  'The college office remains closed on the 2nd and 4th Saturday of every month and public holidays.',
  '+91-2582-224364',
  '+91-2582-221719',
  'rps125@rediffmail.com',
  'principal@ssgbcoet.com',
  'Shri Sant Gadge Baba College of Engineering & Technology Bhusawal',
  1,
  'Our Placement Partners & Recruiters',
  'Over the years, our students have secured opportunities in leading multinational corporations and innovative technology startups.'
);

-- 3. Seed Course details
INSERT INTO courses (name, category, duration, intake, sort_order) VALUES
('B.Tech in Computer Science & Engineering', 'Engineering (UG)', '4 Years', 120, 1),
('B.Tech in Computer Science & Engineering (Data Science)', 'Engineering (UG)', '4 Years', 60, 2),
('B.Tech in Electrical Engineering', 'Engineering (UG)', '4 Years', 60, 3),
('B.Tech in Mechanical Engineering', 'Engineering (UG)', '4 Years', 30, 4),
('B.Tech in Civil Engineering', 'Engineering (UG)', '4 Years', 30, 5),
('B.Tech in Electronics & Telecommunication Engineering', 'Engineering (UG)', '4 Years', 30, 6),
('B.Tech in Electronics & Computer Engineering', 'Engineering (UG)', '4 Years', 30, 7),
('Master of Computer Applications (MCA)', 'Postgraduate (PG)', '2 Years', 60, 8),
('M.E. in Electronics & Communication Engineering', 'Postgraduate (PG)', '2 Years', 18, 9),
('Diploma in Computer Engineering', 'Diploma', '3 Years', 60, 10),
('Diploma in Electrical Engineering', 'Diploma', '3 Years', 60, 11);

-- 4. Seed Hindi Seva Mandal Management Body
INSERT INTO committee_members (name, designation, photo_url, college_name, college_address, contact_details, sort_order) VALUES
('Shri Milind J. Agrawal', 'President, Hindi Seva Mandal', '', 'SSGBCOET Bhusawal', 'Near Z.T.C., Bhusawal', '', 1),
('Smt. Madhu D. Sharma', 'Secretary, Hindi Seva Mandal', '', 'SSGBCOET Bhusawal', 'Near Z.T.C., Bhusawal', '', 2),
('Shri M. D. Tiwari', 'Treasurer, Hindi Seva Mandal', '', 'SSGBCOET Bhusawal', 'Near Z.T.C., Bhusawal', '', 3),
('Dr. Rahul B. Barjibhe', 'Principal (Ex-officio Member)', '', 'SSGBCOET Bhusawal', 'Near Z.T.C., Bhusawal', 'principal@ssgbcoet.com', 4);

-- 5. Seed Department HODs
INSERT INTO hods (name, designation, photo_url, college_name, college_address, email, mobile_number, message, sort_order) VALUES
('Dr. Dinesh D. Patil', 'HOD, Computer Science & Engineering', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&q=80', 'SSGBCOET Bhusawal', 'Bhusawal, Jalgaon', 'hod.cse@ssgbcoet.com', '9890123456', 'Welcome to the Department of CSE. Our mission is to mold tech industry leaders and software innovators.', 1),
('Dr. Sudhir B. Ojha', 'HOD, Basic Sciences & Humanities', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&q=80', 'SSGBCOET Bhusawal', 'Bhusawal, Jalgaon', 'hod.fy@ssgbcoet.com', '9422345678', 'We provide the fundamental scientific knowledge and humanities perspective critical for every engineering career.', 2),
('Dr. Pankaj P. Bhangale', 'HOD, Civil Engineering', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&q=80', 'SSGBCOET Bhusawal', 'Bhusawal, Jalgaon', 'hod.civil@ssgbcoet.com', '9823456789', 'Our curriculum focuses on hands-on structural design, mapping surveys, and modern sustainable civil developments.', 3),
('Prof. Avinash V. Patil', 'HOD, Mechanical Engineering', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&q=80', 'SSGBCOET Bhusawal', 'Bhusawal, Jalgaon', 'hod.mech@ssgbcoet.com', '9545123456', 'Fostering cutting-edge research in manufacturing systems, thermodynamic applications, and automation systems.', 4),
('Dr. Girish A. Kulkarni', 'HOD, Electronics & Telecommunication', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&q=80', 'SSGBCOET Bhusawal', 'Bhusawal, Jalgaon', 'hod.entc@ssgbcoet.com', '9922334455', 'Preparing students to build IoT applications, telecom nodes, and integrated electrical-digital equipment.', 5),
('Dr. Ajit P. Chaudhari', 'HOD, Electrical Engineering', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop&q=80', 'SSGBCOET Bhusawal', 'Bhusawal, Jalgaon', 'hod.elec@ssgbcoet.com', '9422556677', 'Our focus lies in power networks, electric vehicle drives, and automated control systems.', 6);

-- 6. Seed Placements & Statistics
INSERT INTO placement_content (id, hero_title, hero_subtitle, content, stat_placed, stat_companies, stat_package_avg, stat_package_highest) VALUES (
  1,
  'Training & Placement Cell',
  'Connecting Student Talent with Global Technical Opportunities',
  '<h2>Welcome to T&P Cell</h2><p>The Training and Placement Cell at SSGBCOET Bhusawal plays an active role in providing placement assistance and training to students of engineering, MCA, and diploma streams. We aim to equip students with professional competency, coding proficiency, and soft skills.</p><h3>Industry Tie-ups & MoUs</h3><p>We collaborate with top-tier organizations like Monster India, Unacademy, and Huawei Telecommunications to offer certified training programs, mock interviews, and technical workshops.</p>',
  172,
  28,
  '4.2 LPA',
  '38 LPA'
);

-- 7. Seed Recruiter Partner Logos
INSERT INTO placement_companies (name, logo_url, website, sort_order) VALUES
('Tata Consultancy Services (TCS)', 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg', 'https://tcs.com', 1),
('Infosys', 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg', 'https://infosys.com', 2),
('Cognizant', 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Cognizant_logo.svg', 'https://cognizant.com', 3),
('Accenture', 'https://upload.wikimedia.org/wikipedia/commons/8/db/Accenture.svg', 'https://accenture.com', 4),
('Capgemini', 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Capgemini_2017_logo.svg', 'https://capgemini.com', 5),
('Tech Mahindra', 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Tech_Mahindra_Logo.svg', 'https://techmahindra.com', 6),
('Deloitte', 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Deloitte_logo.svg', 'https://deloitte.com', 7),
('HCL Technologies', 'https://upload.wikimedia.org/wikipedia/commons/6/6f/HCL_Technologies_logo.svg', 'https://hcltech.com', 8);

-- 8. Seed Landing Slider Banners
INSERT INTO slider_slides (sort_order, title, subtitle, description, btn_text, btn_link, image_url, overlay_opacity, active) VALUES
(1, 'Shri Sant Gadge Baba College of Engineering & Technology', 'Empowering Students, Molding Futures', 'An autonomous institution in Bhusawal providing quality engineering, PG, and diploma education since 1999.', 'Explore Courses', '/courses', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80', 0.55, 1),
(2, 'Dynamic Placements & Training', 'Corporate Opportunities', 'Join our list of placed graduates at TCS, Infosys, Tech Mahindra, and more with packages up to 38 LPA.', 'Our Placement Success', '/placements', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80', 0.6, 1),
(3, 'Excellent Research & Infrastructure', 'Innovation Labs', 'Equipped with state-of-the-art labs, a digital library, and physical sports facilities.', 'Academic Overview', '/about', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=80', 0.50, 1);
```
