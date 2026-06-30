const express = require('express');
const cors = require('cors');
const path = require('path');
const { query } = require('./db');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- BRANDING & SETTINGS API ---
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await query.get('SELECT * FROM settings WHERE id = 1');
    if (settings) {
      if (!settings.zonal_features || settings.zonal_features === '[]') {
        settings.zonal_features = '[{"id":1,"image":"https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=80","title":"Inter-Collegiate Tournaments","description":"Organizing prestigious zonal, inter-zonal, and state-level sports competitions for student-athletes.","tag":"Competitions"},{"id":2,"image":"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80","title":"Sports Calendar & Schedules","description":"Access accurate schedules, entry dates, brackets, and fixtures for the entire academic year.","tag":"Schedules"},{"id":3,"image":"https://images.unsplash.com/photo-1544698310-74ea9d1c8258?w=800&auto=format&fit=crop&q=80","title":"Dynamic Results Portal","description":"Real-time updates of tournament standings, team rosters, scoreboards, and merit notifications.","tag":"Real-Time Updates"},{"id":4,"image":"https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80","title":"Alumni & Sports Mentorship","description":"Connecting champion alumni with current athletes for career guidance, training support, and placements.","tag":"Community"}]';
      }
      if (!settings.zonal_features_header) {
        settings.zonal_features_header = 'Core Zonal Features';
      }
      if (!settings.zonal_features_desc) {
        settings.zonal_features_desc = 'Everything you need to stay updated with university sports, tournament structures, notices, and career opportunities.';
      }
    }
    res.json(settings || {
      univ_name: 'Apex University',
      logo_url: '',
      theme_preset: 'crimson',
      primary_color: '#800020',
      secondary_color: '#1e293b',
      show_top_header: 1,
      top_header_phone: '+953 012 3654 896',
      top_header_email: 'support@apex.edu',
      top_header_bg_color: '#800020',
      top_header_text_color: '#ffffff',
      social_facebook: '#',
      social_twitter: '#',
      social_linkedin: '#',
      social_instagram: '#',
      social_youtube: '#',
      top_header_links: '[]',
      show_main_header: 1,
      univ_tagline: 'Autonomous Institution | Approved by AICTE | Permanently Affiliated',
      accreditation_logos: '[{"id":"naac","title":"NAAC A++","subtitle":"Accredited Grade","image_url":"/naac.png"},{"id":"nba","title":"NBA","subtitle":"Accredited Tier-1","image_url":"/nba.png"},{"id":"nirf","title":"NIRF","subtitle":"Top Engineering","image_url":"/nirf.png"},{"id":"ugc","title":"UGC","subtitle":"Autonomous","image_url":"/ugc.png"}]',
      contact_intro: 'We, the Department of Sports & Physical Education, are always ready to provide information and answers to queries of students. We aim to resolve basic and common questions about courses and other related information.',
      contact_address: 'Department of Sports & Physical Education,\nIravati Karve Social Science Complex, Behind SET Guest House,\nSavitribai Phule Pune University,\n(formerly University of Pune),\nPune - 411007, Maharashtra, INDIA.',
      contact_timings: '10:30 am to 06:00 pm',
      contact_timings_note: 'The University office has holidays on the 1st and the 3rd Saturday of every month.',
      contact_phone1: '+91 - 20 - 25622428',
      contact_phone2: '+91 - 20 - 25622429',
      contact_email1: 'dpe@unipune.ac.in',
      contact_email2: 'dpeadmin@unipune.ac.in',
      contact_map_query: 'Department of Sports and Physical Education, Savitribai Phule Pune University, Pune',
      zonal_features: '[{"id":1,"image":"https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=80","title":"Inter-Collegiate Tournaments","description":"Organizing prestigious zonal, inter-zonal, and state-level sports competitions for student-athletes.","tag":"Competitions"},{"id":2,"image":"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80","title":"Sports Calendar & Schedules","description":"Access accurate schedules, entry dates, brackets, and fixtures for the entire academic year.","tag":"Schedules"},{"id":3,"image":"https://images.unsplash.com/photo-1544698310-74ea9d1c8258?w=800&auto=format&fit=crop&q=80","title":"Dynamic Results Portal","description":"Real-time updates of tournament standings, team rosters, scoreboards, and merit notifications.","tag":"Real-Time Updates"},{"id":4,"image":"https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80","title":"Alumni & Sports Mentorship","description":"Connecting champion alumni with current athletes for career guidance, training support, and placements.","tag":"Community"}]',
      zonal_features_header: 'Core Zonal Features',
      zonal_features_desc: 'Everything you need to stay updated with university sports, tournament structures, notices, and career opportunities.',
      show_company_slider: 1,
      company_slider_title: 'Our Placement Partners & Recruiters',
      company_slider_desc: 'Our graduates have been placed in leading organizations across sports management, education, fitness, and public administration.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings', async (req, res) => {
  const {
    univ_name, logo_url, theme_preset, primary_color, secondary_color,
    show_top_header, top_header_phone, top_header_email, top_header_bg_color, top_header_text_color,
    social_facebook, social_twitter, social_linkedin, social_instagram, social_youtube,
    top_header_links, show_main_header, univ_tagline, accreditation_logos,
    contact_intro, contact_address, contact_timings, contact_timings_note,
    contact_phone1, contact_phone2, contact_email1, contact_email2, contact_map_query,
    zonal_features, zonal_features_header, zonal_features_desc,
    show_company_slider, company_slider_title, company_slider_desc
  } = req.body;
  try {
    await query.run(
      `INSERT OR REPLACE INTO settings (
        id, univ_name, logo_url, theme_preset, primary_color, secondary_color,
        show_top_header, top_header_phone, top_header_email, top_header_bg_color, top_header_text_color,
        social_facebook, social_twitter, social_linkedin, social_instagram, social_youtube,
        top_header_links, show_main_header, univ_tagline, accreditation_logos,
        contact_intro, contact_address, contact_timings, contact_timings_note,
        contact_phone1, contact_phone2, contact_email1, contact_email2, contact_map_query,
        zonal_features, zonal_features_header, zonal_features_desc,
        show_company_slider, company_slider_title, company_slider_desc
      )
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        univ_name, logo_url, theme_preset, primary_color, secondary_color,
        show_top_header ?? 1, top_header_phone ?? '+953 012 3654 896', top_header_email ?? 'support@apex.edu',
        top_header_bg_color ?? '#800020', top_header_text_color ?? '#ffffff',
        social_facebook ?? '#', social_twitter ?? '#', social_linkedin ?? '#', social_instagram ?? '#', social_youtube ?? '#',
        top_header_links ?? '[]', show_main_header ?? 1,
        univ_tagline ?? 'Autonomous Institution | Approved by AICTE | Permanently Affiliated',
        accreditation_logos ?? '[{"id":"naac","title":"NAAC A++","subtitle":"Accredited Grade","image_url":"/naac.png"},{"id":"nba","title":"NBA","subtitle":"Accredited Tier-1","image_url":"/nba.png"},{"id":"nirf","title":"NIRF","subtitle":"Top Engineering","image_url":"/nirf.png"},{"id":"ugc","title":"UGC","subtitle":"Autonomous","image_url":"/ugc.png"}]',
        contact_intro ?? '', contact_address ?? '', contact_timings ?? '', contact_timings_note ?? '',
        contact_phone1 ?? '', contact_phone2 ?? '', contact_email1 ?? '', contact_email2 ?? '', contact_map_query ?? '',
        zonal_features ?? '[]', zonal_features_header ?? 'Core Zonal Features', zonal_features_desc ?? 'Everything you need to stay updated with university sports, tournament structures, notices, and career opportunities.',
        show_company_slider ?? 1,
        company_slider_title ?? 'Our Placement Partners & Recruiters',
        company_slider_desc ?? 'Our graduates have been placed in leading organizations across sports management, education, fitness, and public administration.'
      ]
    );
    const updated = await query.get('SELECT * FROM settings WHERE id = 1');
    if (updated) {
      if (!updated.zonal_features || updated.zonal_features === '[]') {
        updated.zonal_features = '[{"id":1,"image":"https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=80","title":"Inter-Collegiate Tournaments","description":"Organizing prestigious zonal, inter-zonal, and state-level sports competitions for student-athletes.","tag":"Competitions"},{"id":2,"image":"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80","title":"Sports Calendar & Schedules","description":"Access accurate schedules, entry dates, brackets, and fixtures for the entire academic year.","tag":"Schedules"},{"id":3,"image":"https://images.unsplash.com/photo-1544698310-74ea9d1c8258?w=800&auto=format&fit=crop&q=80","title":"Dynamic Results Portal","description":"Real-time updates of tournament standings, team rosters, scoreboards, and merit notifications.","tag":"Real-Time Updates"},{"id":4,"image":"https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80","title":"Alumni & Sports Mentorship","description":"Connecting champion alumni with current athletes for career guidance, training support, and placements.","tag":"Community"}]';
      }
      if (!updated.zonal_features_header) {
        updated.zonal_features_header = 'Core Zonal Features';
      }
      if (!updated.zonal_features_desc) {
        updated.zonal_features_desc = 'Everything you need to stay updated with university sports, tournament structures, notices, and career opportunities.';
      }
    }
    res.json({ success: true, settings: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- AUTHENTICATION API ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await query.get(
      'SELECT id, email, password, role, full_name, status FROM users WHERE email = ? AND role = ?',
      [email, role]
    );
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if (user.status === 'pending') {
      return res.status(403).json({ error: 'Your account is pending verification by the administration.' });
    }
    if (user.status === 'rejected') {
      return res.status(403).json({ error: 'Your registration request has been rejected by the administration.' });
    }

    // Trigger OTP Flow
    res.json({
      otpRequired: true,
      mockOtp: '123456',
      email: user.email,
      message: 'OTP sent to registered email / mobile'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (otp !== '123456') {
      return res.status(400).json({ error: 'Invalid OTP code. Please use the simulated code: 123456' });
    }
    const user = await query.get('SELECT id, email, role, full_name, status FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { role, email, password, full_name, mobile, profileData } = req.body;
  try {
    // Check if user already exists
    const existingUser = await query.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Email address already registered' });
    }

    // Insert user with 'pending' status by default (admin needs to approve, except admins themselves if created)
    const initialStatus = role === 'admin' ? 'approved' : 'pending';
    
    const result = await query.run(
      'INSERT INTO users (role, email, password, full_name, mobile, status) VALUES (?, ?, ?, ?, ?, ?)',
      [role, email, password, full_name, mobile, initialStatus]
    );

    const userId = result.id;

    if (role === 'alumni') {
      const p = profileData || {};
      await query.run(
        `INSERT INTO alumni_profiles (
          user_id, gender, dob, grad_year, degree, department, roll_number, company, designation, industry, experience, city, state, country, linkedin, website, skills, achievements, photo_url, membership_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')`,
        [
          userId, p.gender || '', p.dob || '', p.grad_year || null, p.degree || '', p.department || '', p.roll_number || '',
          p.company || '', p.designation || '', p.industry || '', p.experience || 0, p.city || '', p.state || '', p.country || '',
          p.linkedin || '', p.website || '', p.skills || '', p.achievements || '', p.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80'
        ]
      );
    } else if (role === 'student') {
      const p = profileData || {};
      await query.run(
        'INSERT INTO student_profiles (user_id, grad_year, degree, department, roll_number, resume_url, resume_name, interests, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, p.grad_year || null, p.degree || '', p.department || '', p.roll_number || '', p.resume_url || '', p.resume_name || '', p.interests || '', p.photo_url || null]
      );
    }

    res.json({
      success: true,
      message: 'Registration submitted successfully! Please await administrator approval.',
      status: initialStatus
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ALUMNI DIRECTORY API ---
app.get('/api/alumni', async (req, res) => {
  const { search, grad_year, degree, department, industry, country, city } = req.query;
  try {
    let sql = `
      SELECT u.id, u.full_name, u.email, u.mobile,
             ap.gender, ap.dob, ap.grad_year, ap.degree, ap.department, ap.roll_number,
             ap.company, ap.designation, ap.industry, ap.experience,
             ap.city, ap.state, ap.country, ap.address, ap.college, ap.linkedin, ap.website, ap.skills, ap.achievements, ap.photo_url, ap.membership_status
      FROM users u
      JOIN alumni_profiles ap ON u.id = ap.user_id
      WHERE u.status = 'approved'
    `;
    const params = [];

    if (search) {
      sql += ` AND (u.full_name LIKE ? OR ap.company LIKE ? OR ap.designation LIKE ? OR ap.skills LIKE ?)`;
      const val = `%${search}%`;
      params.push(val, val, val, val);
    }
    if (grad_year) {
      sql += ` AND ap.grad_year = ?`;
      params.push(grad_year);
    }
    if (degree) {
      sql += ` AND ap.degree LIKE ?`;
      params.push(`%${degree}%`);
    }
    if (department) {
      sql += ` AND ap.department LIKE ?`;
      params.push(`%${department}%`);
    }
    if (industry) {
      sql += ` AND ap.industry LIKE ?`;
      params.push(`%${industry}%`);
    }
    if (country) {
      sql += ` AND ap.country LIKE ?`;
      params.push(`%${country}%`);
    }
    if (city) {
      sql += ` AND ap.city LIKE ?`;
      params.push(`%${city}%`);
    }

    sql += ' ORDER BY ap.grad_year DESC, u.full_name ASC';
    const rows = await query.all(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/alumni/:id', async (req, res) => {
  try {
    const profile = await query.get(
      `SELECT u.id, u.full_name, u.email, u.mobile, ap.*
       FROM users u
       JOIN alumni_profiles ap ON u.id = ap.user_id
       WHERE u.id = ?`,
      [req.params.id]
    );
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/alumni/:id', async (req, res) => {
  const { full_name, mobile, company, designation, industry, experience, city, state, country, address, college, grad_year, linkedin, website, skills, achievements, photo_url } = req.body;
  try {
    // Update User Name
    await query.run('UPDATE users SET full_name = ?, mobile = ? WHERE id = ?', [full_name, mobile, req.params.id]);

    // Update Profile Detail
    await query.run(
      `UPDATE alumni_profiles SET
        company = ?, designation = ?, industry = ?, experience = ?,
        city = ?, state = ?, country = ?, address = ?, college = ?, grad_year = ?, linkedin = ?, website = ?,
        skills = ?, achievements = ?, photo_url = ?
       WHERE user_id = ?`,
      [company, designation, industry, experience, city, state, country, address, college, grad_year, linkedin, website, skills, achievements, photo_url, req.params.id]
    );

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- STUDENT API ---
app.get('/api/student/:id', async (req, res) => {
  try {
    const profile = await query.get(
      `SELECT u.id, u.full_name, u.email, u.mobile, sp.*
       FROM users u
       JOIN student_profiles sp ON u.id = sp.user_id
       WHERE u.id = ?`,
      [req.params.id]
    );
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/student/:id', async (req, res) => {
  const { full_name, mobile, grad_year, degree, department, roll_number, resume_url, resume_name, interests, photo_url } = req.body;
  try {
    await query.run('UPDATE users SET full_name = ?, mobile = ? WHERE id = ?', [full_name, mobile, req.params.id]);
    await query.run(
      `UPDATE student_profiles SET
        grad_year = ?, degree = ?, department = ?, roll_number = ?, resume_url = ?, resume_name = ?, interests = ?, photo_url = ?
       WHERE user_id = ?`,
      [grad_year, degree, department, roll_number, resume_url, resume_name || null, interests, photo_url || null, req.params.id]
    );
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- EVENTS API ---
app.get('/api/events', async (req, res) => {
  try {
    const events = await query.all('SELECT * FROM events ORDER BY date ASC');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/events', async (req, res) => {
  const { title, description, date, time, type, location, capacity, image_url } = req.body;
  try {
    const result = await query.run(
      'INSERT INTO events (title, description, date, time, type, location, capacity, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, date, time, type, location, capacity, image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop&q=80']
    );
    res.json({ success: true, eventId: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    await query.run('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/events/:id/register', async (req, res) => {
  const { userId } = req.body;
  const eventId = req.params.id;
  try {
    // Check limit
    const event = await query.get('SELECT capacity, registered_count FROM events WHERE id = ?', [eventId]);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (event.registered_count >= event.capacity) {
      return res.status(400).json({ error: 'Event registration is full' });
    }

    // Insert registration
    await query.run('INSERT INTO event_registrations (event_id, user_id) VALUES (?, ?)', [eventId, userId]);
    // Update count
    await query.run('UPDATE events SET registered_count = registered_count + 1 WHERE id = ?', [eventId]);

    res.json({ success: true, message: 'Successfully registered for event' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'You are already registered for this event' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/events/registered/:userId', async (req, res) => {
  try {
    const events = await query.all(
      `SELECT e.*
       FROM events e
       JOIN event_registrations er ON e.id = er.event_id
       WHERE er.user_id = ?
       ORDER BY e.date ASC`,
      [req.params.userId]
    );
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- JOBS & PORTAL API ---
app.get('/api/jobs', async (req, res) => {
  const { search, type } = req.query;
  try {
    let sql = 'SELECT * FROM jobs WHERE 1=1';
    const params = [];
    if (search) {
      sql += ' AND (title LIKE ? OR company LIKE ? OR description LIKE ?)';
      const val = `%${search}%`;
      params.push(val, val, val);
    }
    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }
    sql += ' ORDER BY created_at DESC';
    const jobs = await query.all(sql, params);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/jobs', async (req, res) => {
  const { title, company, location, type, department, description, requirements, salary, postedBy } = req.body;
  try {
    const result = await query.run(
      'INSERT INTO jobs (title, company, location, type, department, description, requirements, salary, posted_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, company, location, type, department, description, requirements, salary, postedBy]
    );
    res.json({ success: true, jobId: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/jobs/:id/apply', async (req, res) => {
  const { userId, resumeUrl } = req.body;
  const jobId = req.params.id;
  try {
    await query.run(
      'INSERT INTO job_applications (job_id, user_id, resume_url, status) VALUES (?, ?, ?, ?)',
      [jobId, userId, resumeUrl || '', 'applied']
    );
    res.json({ success: true, message: 'Application submitted' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/jobs/applied/:userId', async (req, res) => {
  try {
    const applications = await query.all(
      `SELECT j.*, ja.status as app_status, ja.applied_at
       FROM jobs j
       JOIN job_applications ja ON j.id = ja.job_id
       WHERE ja.user_id = ?
       ORDER BY ja.applied_at DESC`,
      [req.params.userId]
    );
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/jobs/:id', async (req, res) => {
  try {
    await query.run('DELETE FROM jobs WHERE id = ?', [req.params.id]);
    await query.run('DELETE FROM job_applications WHERE job_id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- JOB APPLICATIONS MODERATION API ---
app.get('/api/jobs/applications', async (req, res) => {
  try {
    const apps = await query.all(`
      SELECT 
        ja.id, ja.job_id, ja.user_id, ja.resume_url, ja.status, ja.applied_at,
        j.title as job_title, j.company as job_company,
        u.full_name as applicant_name, u.email as applicant_email, u.mobile as applicant_mobile, u.role as applicant_role
      FROM job_applications ja
      JOIN jobs j ON ja.job_id = j.id
      JOIN users u ON ja.user_id = u.id
      ORDER BY ja.applied_at DESC
    `);
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/jobs/applications/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    await query.run(
      'UPDATE job_applications SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ALUMNI SPOTLIGHT (SUCCESS STORIES) API ---
app.get('/api/spotlights', async (req, res) => {
  try {
    const list = await query.all('SELECT * FROM spotlights ORDER BY created_at DESC');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/spotlights', async (req, res) => {
  const { name, role, grad, photo, text } = req.body;
  try {
    const result = await query.run(
      'INSERT INTO spotlights (name, role, grad, photo, text) VALUES (?, ?, ?, ?, ?)',
      [name, role, grad, photo || '', text]
    );
    res.json({ success: true, id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/spotlights/:id', async (req, res) => {
  const { name, role, grad, photo, text } = req.body;
  try {
    await query.run(
      'UPDATE spotlights SET name = ?, role = ?, grad = ?, photo = ?, text = ? WHERE id = ?',
      [name, role, grad, photo || '', text, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/spotlights/:id', async (req, res) => {
  try {
    await query.run('DELETE FROM spotlights WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- MENTORSHIP API ---
app.get('/api/mentorship', async (req, res) => {
  const { userId, role } = req.query;
  try {
    if (role === 'student') {
      // Get registered mentor relationships
      const matches = await query.all(
        `SELECT m.*, u.full_name as mentor_name, ap.company, ap.designation, ap.photo_url, ap.skills
         FROM mentorships m
         JOIN users u ON m.mentor_id = u.id
         JOIN alumni_profiles ap ON u.id = ap.user_id
         WHERE m.mentee_id = ?`,
        [userId]
      );
      res.json(matches);
    } else if (role === 'alumni') {
      // Get mentee requests and active students
      const matches = await query.all(
        `SELECT m.*, u.full_name as mentee_name, sp.degree, sp.department, sp.interests, u.email
         FROM mentorships m
         JOIN users u ON m.mentee_id = u.id
         JOIN student_profiles sp ON u.id = sp.user_id
         WHERE m.mentor_id = ?`,
        [userId]
      );
      res.json(matches);
    } else {
      res.status(400).json({ error: 'Invalid role for mentorship query' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/mentorship/request', async (req, res) => {
  const { menteeId, mentorId, notes } = req.body;
  try {
    await query.run(
      'INSERT INTO mentorships (mentor_id, mentee_id, status, notes, scheduled_meetings) VALUES (?, ?, ?, ?, ?)',
      [mentorId, menteeId, 'pending', notes || '', '[]']
    );
    res.json({ success: true, message: 'Mentorship request sent' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'A mentorship request has already been sent to this mentor' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/mentorship/respond', async (req, res) => {
  const { mentorshipId, status } = req.body;
  try {
    await query.run('UPDATE mentorships SET status = ? WHERE id = ?', [status, mentorshipId]);
    res.json({ success: true, message: `Mentorship request ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/mentorship/schedule', async (req, res) => {
  const { mentorshipId, date, time, topic } = req.body;
  try {
    const record = await query.get('SELECT scheduled_meetings FROM mentorships WHERE id = ?', [mentorshipId]);
    if (!record) return res.status(404).json({ error: 'Mentorship record not found' });
    
    let meetings = [];
    try {
      meetings = JSON.parse(record.scheduled_meetings || '[]');
    } catch(e) {
      meetings = [];
    }

    meetings.push({ date, time, topic });
    await query.run('UPDATE mentorships SET scheduled_meetings = ? WHERE id = ?', [JSON.stringify(meetings), mentorshipId]);
    res.json({ success: true, meetings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- DONATIONS API ---
app.get('/api/donations', async (req, res) => {
  const { userId } = req.query;
  try {
    if (userId) {
      const records = await query.all('SELECT * FROM donations WHERE user_id = ? ORDER BY donated_at DESC', [userId]);
      return res.json(records);
    }
    // Summary values
    const records = await query.all('SELECT * FROM donations ORDER BY donated_at DESC');
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/donations', async (req, res) => {
  const { userId, donorName, amount, campaign } = req.body;
  const receiptNumber = 'REC-' + Date.now().toString().slice(-8) + '-' + Math.floor(1000 + Math.random() * 9000);
  try {
    await query.run(
      'INSERT INTO donations (user_id, donor_name, amount, campaign, status, receipt_number) VALUES (?, ?, ?, ?, ?, ?)',
      [userId || null, donorName, amount, campaign, 'success', receiptNumber]
    );
    res.json({ success: true, receiptNumber, amount, campaign });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ADMIN VERIFICATION & LISTS ---
app.get('/api/admin/pending-users', async (req, res) => {
  try {
    const alumni = await query.all(
      `SELECT u.id, u.role, u.full_name, u.email, u.mobile, u.status, u.created_at, 
              ap.grad_year, ap.degree, ap.department, ap.roll_number, ap.photo_url, 
              ap.linkedin, ap.skills, ap.achievements, ap.company, ap.designation, ap.industry
       FROM users u
       JOIN alumni_profiles ap ON u.id = ap.user_id
       WHERE u.status = 'pending'`
    );
    const students = await query.all(
      `SELECT u.id, u.role, u.full_name, u.email, u.mobile, u.status, u.created_at, 
              sp.grad_year, sp.degree, sp.department, sp.roll_number, sp.photo_url, 
              sp.resume_url, sp.resume_name, sp.interests
       FROM users u
       JOIN student_profiles sp ON u.id = sp.user_id
       WHERE u.status = 'pending'`
    );
    res.json([...alumni, ...students]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/verify-user', async (req, res) => {
  const { userId, status } = req.body; // status should be 'approved' or 'rejected'
  try {
    await query.run('UPDATE users SET status = ? WHERE id = ?', [status, userId]);
    res.json({ success: true, message: `User registration ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- NEWS API ---
app.get('/api/news', async (req, res) => {
  try {
    const news = await query.all('SELECT * FROM news ORDER BY date DESC, id DESC');
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/news', async (req, res) => {
  const { title, description, date, image_url, file_url, file_name } = req.body;
  try {
    const result = await query.run(
      'INSERT INTO news (title, description, date, image_url, file_url, file_name) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, date, image_url || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&q=80', file_url || null, file_name || null]
    );
    res.json({ success: true, newsId: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/news/:id', async (req, res) => {
  try {
    await query.run('DELETE FROM news WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'News item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CUSTOM PAGES API ---
app.get('/api/custom-pages', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    const pages = await query.all('SELECT id, title, parent_menu, menu_type, is_visible, sort_order, updated_at FROM custom_pages ORDER BY sort_order ASC, title ASC');
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/custom-pages/:id', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    const page = await query.get('SELECT * FROM custom_pages WHERE id = ?', [req.params.id]);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/custom-pages', async (req, res) => {
  const { id, title, content, file_url, file_name, parent_menu, menu_type, show_slider, slider_slides, is_visible, sort_order } = req.body;
  if (!id || !title) {
    return res.status(400).json({ error: 'Page ID and Title are required' });
  }
  const slugRegex = /^[a-zA-Z0-9-_]+$/;
  if (!slugRegex.test(id)) {
    return res.status(400).json({ error: 'Page ID/Slug can only contain alphanumeric characters, hyphens, and underscores' });
  }
  try {
    const existing = await query.get('SELECT id FROM custom_pages WHERE id = ?', [id]);
    if (existing) {
      return res.status(400).json({ error: 'A page with this ID/Slug already exists' });
    }
    await query.run(
      `INSERT INTO custom_pages (id, title, content, file_url, file_name, parent_menu, menu_type, show_slider, slider_slides, is_visible, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, content || '', file_url || null, file_name || null, parent_menu || 'about', menu_type || 'child', show_slider ? 1 : 0, slider_slides || '[]', is_visible !== undefined ? (is_visible ? 1 : 0) : 1, sort_order !== undefined ? parseInt(sort_order) : 0]
    );
    res.json({ success: true, message: 'Page created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/custom-pages/:id', async (req, res) => {
  const { title, content, file_url, file_name, parent_menu, menu_type, show_slider, slider_slides, is_visible, sort_order } = req.body;
  try {
    await query.run(
      `UPDATE custom_pages 
       SET title = ?, content = ?, file_url = ?, file_name = ?, parent_menu = ?, menu_type = ?, show_slider = ?, slider_slides = ?, is_visible = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [title, content, file_url || null, file_name || null, parent_menu || 'about', menu_type || 'child', show_slider ? 1 : 0, slider_slides || '[]', is_visible !== undefined ? (is_visible ? 1 : 0) : 1, sort_order !== undefined ? parseInt(sort_order) : 0, req.params.id]
    );
    res.json({ success: true, message: 'Page updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/custom-pages/:id', async (req, res) => {
  try {
    const pageId = req.params.id;
    // Delete page itself, any direct children (where parent_menu = pageId), and any sub-children (where parent_menu is a child of pageId)
    await query.run(`
      DELETE FROM custom_pages 
      WHERE id = ? 
         OR parent_menu = ? 
         OR parent_menu IN (SELECT id FROM custom_pages WHERE parent_menu = ?)
    `, [pageId, pageId, pageId]);
    res.json({ success: true, message: 'Page and its subpages deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/custom-pages/:id/visibility', async (req, res) => {
  const { is_visible } = req.body;
  try {
    await query.run(
      'UPDATE custom_pages SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [is_visible ? 1 : 0, req.params.id]
    );
    res.json({ success: true, message: 'Visibility updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- HERO SLIDER API ---
// Ensure table exists and seed defaults on startup
const { db } = require('./db');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS slider_slides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
  )`, [], (err) => {
    if (err) return;
    // Check if already seeded
    db.get('SELECT COUNT(*) as cnt FROM slider_slides', [], (err2, row) => {
      if (err2 || (row && row.cnt > 0)) return;
      const defaults = [
        {
          sort_order: 1,
          title: 'Excellence in Sports',
          subtitle: 'Pune City Zone Sports Committee',
          description: 'Promoting athletic excellence and organizing collegiate tournaments across Pune City Zone since decades.',
          btn_text: 'Explore Events',
          btn_link: 'events',
          image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&q=80',
          overlay_opacity: 0.55
        },
        {
          sort_order: 2,
          title: 'Champion Athletes',
          subtitle: 'Nurturing the Stars of Tomorrow',
          description: 'Our programs develop physical fitness, sportsmanship, and competitive spirit among thousands of students.',
          btn_text: 'About Committee',
          btn_link: 'about-about_us',
          image_url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1920&q=80',
          overlay_opacity: 0.6
        },
        {
          sort_order: 3,
          title: 'Annual Sports Calendar',
          subtitle: 'Inter-Collegiate Tournaments',
          description: 'View the complete schedule of zonal, district, and state-level sports events for the academic year 2025-26.',
          btn_text: 'View Calendar',
          btn_link: 'about-calendar',
          image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&q=80',
          overlay_opacity: 0.5
        }
      ];
      const stmt = db.prepare(`INSERT INTO slider_slides (sort_order, title, subtitle, description, btn_text, btn_link, image_url, overlay_opacity, active) VALUES (?,?,?,?,?,?,?,?,1)`);
      defaults.forEach(d => stmt.run(d.sort_order, d.title, d.subtitle, d.description, d.btn_text, d.btn_link, d.image_url, d.overlay_opacity));
      stmt.finalize();
    });
  });
});

app.get('/api/slider', async (req, res) => {
  try {
    const slides = await query.all('SELECT * FROM slider_slides ORDER BY sort_order ASC, id ASC');
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/slider', async (req, res) => {
  const { title, subtitle, description, btn_text, btn_link, image_url, overlay_opacity, sort_order } = req.body;
  try {
    const result = await query.run(
      'INSERT INTO slider_slides (title, subtitle, description, btn_text, btn_link, image_url, overlay_opacity, sort_order, active) VALUES (?,?,?,?,?,?,?,?,1)',
      [title || '', subtitle || '', description || '', btn_text || 'Learn More', btn_link || '', image_url || '', overlay_opacity ?? 0.55, sort_order || 0]
    );
    res.json({ success: true, id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/slider/:id', async (req, res) => {
  const { title, subtitle, description, btn_text, btn_link, image_url, overlay_opacity, sort_order, active } = req.body;
  try {
    await query.run(
      'UPDATE slider_slides SET title=?, subtitle=?, description=?, btn_text=?, btn_link=?, image_url=?, overlay_opacity=?, sort_order=?, active=? WHERE id=?',
      [title, subtitle, description, btn_text, btn_link, image_url, overlay_opacity ?? 0.55, sort_order ?? 0, active ?? 1, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/slider/:id', async (req, res) => {
  try {
    await query.run('DELETE FROM slider_slides WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- RESULTS / DRAWS API ---
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    sport TEXT DEFAULT 'General',
    category TEXT DEFAULT '',
    file_url TEXT,
    file_name TEXT,
    published INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, [], (err) => {
    if (err) return;
    db.get('SELECT COUNT(*) as cnt FROM results', [], (err2, row) => {
      if (err2 || (row && row.cnt > 0)) return;
      const seeds = [
        { title: 'Inter-Collegiate Cricket Tournament 2025-26 – Final Results', description: 'St. Xavier\'s College won the zonal cricket championship defeating Fergusson College 187-164. Player of the Match: Rohit Sharma (St. Xavier\'s).', date: '2026-01-15', sport: 'Cricket', category: 'Final' },
        { title: 'Athletics Zone Selection 2025-26 – Draw & Fixtures', description: 'District-level draw for the 100m, 200m, 400m sprints and relay events has been published. Report at Gate 3 by 7:30 AM on match day.', date: '2026-03-10', sport: 'Athletics', category: 'Draw' },
        { title: 'Football Knockout Bracket 2026 – Quarter Finals', description: 'Quarter-final match schedules and venue allocations for the city-zone football championship. All matches at Shivajinagar Ground.', date: '2026-04-05', sport: 'Football', category: 'Draw' }
      ];
      const stmt = db.prepare(`INSERT INTO results (title, description, date, sport, category, published) VALUES (?,?,?,?,?,1)`);
      seeds.forEach(s => stmt.run(s.title, s.description, s.date, s.sport, s.category));
      stmt.finalize();
    });
  });
});

app.get('/api/results', async (req, res) => {
  try {
    const rows = await query.all('SELECT * FROM results ORDER BY date DESC, id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/results/:id', async (req, res) => {
  try {
    const row = await query.get('SELECT * FROM results WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/results', async (req, res) => {
  const { title, description, date, sport, category, file_url, file_name } = req.body;
  try {
    const result = await query.run(
      'INSERT INTO results (title, description, date, sport, category, file_url, file_name, published) VALUES (?,?,?,?,?,?,?,1)',
      [title, description || '', date, sport || 'General', category || '', file_url || null, file_name || null]
    );
    res.json({ success: true, id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/results/:id', async (req, res) => {
  try {
    await query.run('DELETE FROM results WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CIRCULARS API ---
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS circulars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    file_url TEXT,
    file_name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, [], (err) => {
    if (err) return;
    db.get('SELECT COUNT(*) as cnt FROM circulars', [], (err2, row) => {
      if (err2 || (row && row.cnt > 0)) return;
      const seeds = [
        { title: 'Pune City Zone Sports Committee Circular 2026-1', description: 'Guidelines and eligibility criteria for collegiate registration in Zonal sports tournaments.', date: '2026-06-01' },
        { title: 'Tournament Allocation & Entry Fee Notice', description: 'Notice regarding college entry fees and tournament center allocations for the upcoming season.', date: '2026-06-15' }
      ];
      const stmt = db.prepare(`INSERT INTO circulars (title, description, date) VALUES (?,?,?)`);
      seeds.forEach(s => stmt.run(s.title, s.description, s.date));
      stmt.finalize();
    });
  });
});

app.get('/api/circulars', async (req, res) => {
  try {
    const rows = await query.all('SELECT * FROM circulars ORDER BY date DESC, id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/circulars', async (req, res) => {
  const { title, description, date, file_url, file_name } = req.body;
  try {
    const result = await query.run(
      'INSERT INTO circulars (title, description, date, file_url, file_name) VALUES (?, ?, ?, ?, ?)',
      [title, description || '', date, file_url || null, file_name || null]
    );
    res.json({ success: true, id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/circulars/:id', async (req, res) => {
  try {
    await query.run('DELETE FROM circulars WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- NCTE MANDATORY DISCLOSURES API ---
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS ncte_disclosures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    file_url TEXT,
    file_name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, [], (err) => {
    if (err) return;
    db.get('SELECT COUNT(*) as cnt FROM ncte_disclosures', [], (err2, row) => {
      if (err2 || (row && row.cnt > 0)) return;
      const seeds = [
        { title: 'NCTE Mandatory Disclosure Report 2026', description: 'Official mandatory disclosure details, compliance details, and institutional data for NCTE teacher education programs.', date: '2026-06-10' },
        { title: 'Institutional Affiliation & NCTE Recognition Order', description: 'Official recognition order issued by Western Regional Committee (WRC) NCTE along with college affiliation documents.', date: '2026-06-20' }
      ];
      const stmt = db.prepare(`INSERT INTO ncte_disclosures (title, description, date) VALUES (?,?,?)`);
      seeds.forEach(s => stmt.run(s.title, s.description, s.date));
      stmt.finalize();
    });
  });
});

app.get('/api/ncte-disclosures', async (req, res) => {
  try {
    const rows = await query.all('SELECT * FROM ncte_disclosures ORDER BY date DESC, id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ncte-disclosures', async (req, res) => {
  const { title, description, date, file_url, file_name } = req.body;
  try {
    const result = await query.run(
      'INSERT INTO ncte_disclosures (title, description, date, file_url, file_name) VALUES (?, ?, ?, ?, ?)',
      [title, description || '', date, file_url || null, file_name || null]
    );
    res.json({ success: true, id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/ncte-disclosures/:id', async (req, res) => {
  try {
    await query.run('DELETE FROM ncte_disclosures WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- COURSES API ---
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    duration TEXT NOT NULL,
    intake INTEGER NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, [], (err) => {
    if (err) return;
    db.get('SELECT COUNT(*) as cnt FROM courses', [], (err2, row) => {
      if (err2 || (row && row.cnt > 0)) return;
      const seeds = [
        { name: 'M.P.Ed. (Master of Physical Education)', category: 'Post Graduate Courses', duration: '2 Years', intake: 40, sort_order: 1 },
        { name: 'M.A. (Yoga)', category: 'Post Graduate Courses', duration: '2 Years', intake: 40, sort_order: 2 },
        { name: 'P.G.D. in Adventure Sports', category: 'Post Graduate Courses', duration: '1 Year', intake: 30, sort_order: 3 },
        { name: 'B.P.Ed. (Bachelor of Physical Education)', category: 'Under Graduate & Professional Courses', duration: '2 Years', intake: 100, sort_order: 4 },
        { name: 'B.A. (Yoga)', category: 'Under Graduate & Professional Courses', duration: '3 Years', intake: 50, sort_order: 5 },
        { name: 'Certificate in Gym Instructor & Fitness Management', category: 'Foundation & Certificate Courses', duration: '3 Months', intake: 40, sort_order: 6 },
        { name: 'Certificate in Yoga Education', category: 'Foundation & Certificate Courses', duration: '3 Months', intake: 50, sort_order: 7 }
      ];
      const stmt = db.prepare(`INSERT INTO courses (name, category, duration, intake, sort_order) VALUES (?,?,?,?,?)`);
      seeds.forEach(s => stmt.run(s.name, s.category, s.duration, s.intake, s.sort_order));
      stmt.finalize();
    });
  });
});

app.get('/api/courses', async (req, res) => {
  try {
    const rows = await query.all('SELECT * FROM courses ORDER BY category ASC, sort_order ASC, id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/courses', async (req, res) => {
  const { name, category, duration, intake, sort_order } = req.body;
  try {
    const result = await query.run(
      'INSERT INTO courses (name, category, duration, intake, sort_order) VALUES (?, ?, ?, ?, ?)',
      [name, category, duration, parseInt(intake) || 0, parseInt(sort_order) || 0]
    );
    res.json({ success: true, id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  const { name, category, duration, intake, sort_order } = req.body;
  try {
    await query.run(
      'UPDATE courses SET name=?, category=?, duration=?, intake=?, sort_order=? WHERE id=?',
      [name, category, duration, parseInt(intake) || 0, parseInt(sort_order) || 0, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    await query.run('DELETE FROM courses WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- COMMITTEE MEMBERS API ---
app.get('/api/committee', async (req, res) => {
  try {
    const rows = await query.all('SELECT * FROM committee_members ORDER BY sort_order ASC, id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/committee', async (req, res) => {
  const { name, designation, photo_url, college_name, college_address, contact_details, sort_order, profile_pdf_url, profile_pdf_name } = req.body;
  try {
    const result = await query.run(
      'INSERT INTO committee_members (name, designation, photo_url, college_name, college_address, contact_details, sort_order, profile_pdf_url, profile_pdf_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, designation, photo_url || '', college_name || '', college_address || '', contact_details || '', sort_order || 0, profile_pdf_url || null, profile_pdf_name || null]
    );
    res.json({ success: true, id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/committee/:id', async (req, res) => {
  const { name, designation, photo_url, college_name, college_address, contact_details, sort_order, profile_pdf_url, profile_pdf_name } = req.body;
  try {
    await query.run(
      'UPDATE committee_members SET name=?, designation=?, photo_url=?, college_name=?, college_address=?, contact_details=?, sort_order=?, profile_pdf_url=?, profile_pdf_name=? WHERE id=?',
      [name, designation, photo_url || '', college_name || '', college_address || '', contact_details || '', sort_order || 0, profile_pdf_url || null, profile_pdf_name || null, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/committee/:id', async (req, res) => {
  try {
    await query.run('DELETE FROM committee_members WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- DIRECTORS OF PHYSICAL EDUCATION API ---
app.get('/api/directors', async (req, res) => {
  try {
    const rows = await query.all('SELECT * FROM directors ORDER BY sort_order ASC, id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/directors', async (req, res) => {
  const { name, photo_url, mobile_number, email, college_name, college_address, sort_order, profile_pdf_url, profile_pdf_name } = req.body;
  try {
    const result = await query.run(
      'INSERT INTO directors (name, photo_url, mobile_number, email, college_name, college_address, sort_order, profile_pdf_url, profile_pdf_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, photo_url || '', mobile_number || '', email || '', college_name || '', college_address || '', sort_order || 0, profile_pdf_url || null, profile_pdf_name || null]
    );
    res.json({ success: true, id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/directors/:id', async (req, res) => {
  const { name, photo_url, mobile_number, email, college_name, college_address, sort_order, profile_pdf_url, profile_pdf_name } = req.body;
  try {
    await query.run(
      'UPDATE directors SET name=?, photo_url=?, mobile_number=?, email=?, college_name=?, college_address=?, sort_order=?, profile_pdf_url=?, profile_pdf_name=? WHERE id=?',
      [name, photo_url || '', mobile_number || '', email || '', college_name || '', college_address || '', sort_order || 0, profile_pdf_url || null, profile_pdf_name || null, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/directors/:id', async (req, res) => {
  try {
    await query.run('DELETE FROM directors WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- HODs / DIRECTORS DESK API ---
app.get('/api/hods', async (req, res) => {
  try {
    const rows = await query.all('SELECT * FROM hods ORDER BY sort_order ASC, id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/hods', async (req, res) => {
  const { name, designation, photo_url, college_name, college_address, mobile_number, email, message, sort_order, profile_pdf_url, profile_pdf_name } = req.body;
  try {
    const result = await query.run(
      'INSERT INTO hods (name, designation, photo_url, college_name, college_address, mobile_number, email, message, sort_order, profile_pdf_url, profile_pdf_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, designation || '', photo_url || '', college_name || '', college_address || '', mobile_number || '', email || '', message || '', sort_order || 0, profile_pdf_url || null, profile_pdf_name || null]
    );
    res.json({ success: true, id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/hods/:id', async (req, res) => {
  const { name, designation, photo_url, college_name, college_address, mobile_number, email, message, sort_order, profile_pdf_url, profile_pdf_name } = req.body;
  try {
    await query.run(
      'UPDATE hods SET name=?, designation=?, photo_url=?, college_name=?, college_address=?, mobile_number=?, email=?, message=?, sort_order=?, profile_pdf_url=?, profile_pdf_name=? WHERE id=?',
      [name, designation || '', photo_url || '', college_name || '', college_address || '', mobile_number || '', email || '', message || '', sort_order || 0, profile_pdf_url || null, profile_pdf_name || null, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/hods/:id', async (req, res) => {
  try {
    await query.run('DELETE FROM hods WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// --- ADMISSIONS API ---
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS admissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
  )`, [], (err) => {
    if (err) return;
    db.get('SELECT COUNT(*) as cnt FROM admissions', [], (err2, row) => {
      if (err2 || (row && row.cnt > 0)) return;
      // Seed FCYE course data
      db.run(`INSERT INTO admissions (
        course_name, course_subtitle, intro_text,
        eligibility, age_limit, intake_capacity, duration, timing, medium,
        fees_indian, fees_international,
        batch_1_period, batch_1_admission_notice,
        batch_2_period, batch_2_admission_notice,
        additional_notes, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Certificate / Foundation Course in Yoga Education (FCYE)',
        'Foundation Course in Yoga Education',
        'The Department is offering a Three-Month Foundation Course in Yoga Education (formerly known as Certificate Course in Yoga Education) twice a year.',
        'Minimum 12th Std. or Equivalent Exam Pass',
        '18 to 60 years (Candidates should be medically fit and sound)',
        '50 students',
        'Three (03) months',
        '03:00 pm to 06:00 pm (Monday to Friday, except University holidays)',
        'English & Marathi (Instruction & Examination)',
        'Tuition Fee Rs. 20,000/- + Other Fees as per University Rules',
        'Tuition Fee Rs. 60,000/- + Other Fees as per University Rules. International Students should apply through the International Centre, SPPU.',
        'August to November',
        'Admission process starts in the first week of July',
        'February to May',
        'Admission process starts in the first week of January',
        'For further details, contact the Department of Physical Education office directly during working hours.',
        1
      ]);
    });
  });
});

app.get('/api/admissions', async (req, res) => {
  try {
    const rows = await query.all('SELECT * FROM admissions ORDER BY sort_order ASC, id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admissions/:id', async (req, res) => {
  try {
    const row = await query.get('SELECT * FROM admissions WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admissions', async (req, res) => {
  const {
    course_name, course_subtitle, intro_text, eligibility, age_limit, intake_capacity,
    duration, timing, medium, fees_indian, fees_international,
    batch_1_period, batch_1_admission_notice, batch_2_period, batch_2_admission_notice,
    additional_notes, file_url, file_name, sort_order
  } = req.body;
  try {
    const result = await query.run(
      `INSERT INTO admissions (
        course_name, course_subtitle, intro_text, eligibility, age_limit, intake_capacity,
        duration, timing, medium, fees_indian, fees_international,
        batch_1_period, batch_1_admission_notice, batch_2_period, batch_2_admission_notice,
        additional_notes, file_url, file_name, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        course_name, course_subtitle || '', intro_text || '',
        eligibility || '', age_limit || '', intake_capacity || '',
        duration || '', timing || '', medium || '',
        fees_indian || '', fees_international || '',
        batch_1_period || '', batch_1_admission_notice || '',
        batch_2_period || '', batch_2_admission_notice || '',
        additional_notes || '', file_url || null, file_name || null,
        parseInt(sort_order) || 0
      ]
    );
    res.json({ success: true, id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admissions/:id', async (req, res) => {
  const {
    course_name, course_subtitle, intro_text, eligibility, age_limit, intake_capacity,
    duration, timing, medium, fees_indian, fees_international,
    batch_1_period, batch_1_admission_notice, batch_2_period, batch_2_admission_notice,
    additional_notes, file_url, file_name, sort_order
  } = req.body;
  try {
    await query.run(
      `UPDATE admissions SET
        course_name=?, course_subtitle=?, intro_text=?, eligibility=?, age_limit=?,
        intake_capacity=?, duration=?, timing=?, medium=?, fees_indian=?, fees_international=?,
        batch_1_period=?, batch_1_admission_notice=?, batch_2_period=?, batch_2_admission_notice=?,
        additional_notes=?, file_url=?, file_name=?, sort_order=?
      WHERE id=?`,
      [
        course_name, course_subtitle || '', intro_text || '',
        eligibility || '', age_limit || '', intake_capacity || '',
        duration || '', timing || '', medium || '',
        fees_indian || '', fees_international || '',
        batch_1_period || '', batch_1_admission_notice || '',
        batch_2_period || '', batch_2_admission_notice || '',
        additional_notes || '', file_url || null, file_name || null,
        parseInt(sort_order) || 0, req.params.id
      ]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admissions/:id', async (req, res) => {
  try {
    await query.run('DELETE FROM admissions WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ADMISSION FILES ─────────────────────────────────────────────────────────────

app.get('/api/admission-files', async (req, res) => {
  try {
    const rows = await query.all('SELECT * FROM admission_files ORDER BY sort_order ASC, id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admission-files/:id', async (req, res) => {
  try {
    const row = await query.get('SELECT * FROM admission_files WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admission-files', async (req, res) => {
  const { title, file_url, file_name, sort_order } = req.body;
  try {
    const result = await query.run(
      `INSERT INTO admission_files (title, file_url, file_name, sort_order) VALUES (?, ?, ?, ?)`,
      [title, file_url || null, file_name || null, parseInt(sort_order) || 0]
    );
    res.json({ success: true, id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admission-files/:id', async (req, res) => {
  const { title, file_url, file_name, sort_order } = req.body;
  try {
    await query.run(
      `UPDATE admission_files SET title=?, file_url=?, file_name=?, sort_order=? WHERE id=?`,
      [title, file_url || null, file_name || null, parseInt(sort_order) || 0, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admission-files/:id', async (req, res) => {
  try {
    await query.run('DELETE FROM admission_files WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- GALLERY API ---
app.get('/api/gallery', async (req, res) => {
  try {
    const { category } = req.query;
    let rows;
    if (category && category !== 'All') {
      rows = await query.all('SELECT * FROM gallery WHERE category = ? ORDER BY sort_order ASC, created_at DESC', [category]);
    } else {
      rows = await query.all('SELECT * FROM gallery ORDER BY sort_order ASC, created_at DESC');
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/gallery/categories', async (req, res) => {
  try {
    const rows = await query.all('SELECT DISTINCT category FROM gallery ORDER BY category ASC');
    res.json(rows.map(r => r.category));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/gallery/:id', async (req, res) => {
  try {
    const row = await query.get('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/gallery', async (req, res) => {
  const { title, description, category, image_url, photographer, location, date, sort_order } = req.body;
  if (!title || !image_url) return res.status(400).json({ error: 'Title and image are required' });
  try {
    const result = await query.run(
      `INSERT INTO gallery (title, description, category, image_url, photographer, location, date, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description || '', category || 'General', image_url, photographer || '', location || '', date || '', parseInt(sort_order) || 0]
    );
    res.json({ success: true, id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/gallery/:id', async (req, res) => {
  const { title, description, category, image_url, photographer, location, date, sort_order } = req.body;
  try {
    await query.run(
      `UPDATE gallery SET title=?, description=?, category=?, image_url=?, photographer=?, location=?, date=?, sort_order=? WHERE id=?`,
      [title, description || '', category || 'General', image_url, photographer || '', location || '', date || '', parseInt(sort_order) || 0, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/gallery/:id', async (req, res) => {
  try {
    await query.run('DELETE FROM gallery WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PLACEMENT API ---
// Get placement page content
app.get('/api/placement/content', async (req, res) => {
  try {
    let row = await query.get('SELECT * FROM placement_content WHERE id = 1');
    if (!row) {
      await query.run(`INSERT INTO placement_content (hero_title, hero_subtitle, content, stat_placed, stat_companies, stat_package_avg, stat_package_highest)
        VALUES (?,?,?,?,?,?,?)`,
        ['Training & Placement Cell', 'Building careers, Shaping futures', '', 0, 0, '0 LPA', '0 LPA']);
      row = await query.get('SELECT * FROM placement_content WHERE id = 1');
    }
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update placement page content
app.put('/api/placement/content', async (req, res) => {
  const { hero_title, hero_subtitle, content, stat_placed, stat_companies, stat_package_avg, stat_package_highest } = req.body;
  try {
    const existing = await query.get('SELECT id FROM placement_content WHERE id = 1');
    if (existing) {
      await query.run(
        `UPDATE placement_content SET hero_title=?, hero_subtitle=?, content=?, stat_placed=?, stat_companies=?, stat_package_avg=?, stat_package_highest=?, updated_at=CURRENT_TIMESTAMP WHERE id=1`,
        [hero_title, hero_subtitle, content, parseInt(stat_placed)||0, parseInt(stat_companies)||0, stat_package_avg, stat_package_highest]
      );
    } else {
      await query.run(
        `INSERT INTO placement_content (id, hero_title, hero_subtitle, content, stat_placed, stat_companies, stat_package_avg, stat_package_highest) VALUES (1,?,?,?,?,?,?,?)`,
        [hero_title, hero_subtitle, content, parseInt(stat_placed)||0, parseInt(stat_companies)||0, stat_package_avg, stat_package_highest]
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all placement companies
app.get('/api/placement/companies', async (req, res) => {
  try {
    const rows = await query.all('SELECT * FROM placement_companies ORDER BY sort_order ASC, created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add placement company
app.post('/api/placement/companies', async (req, res) => {
  const { name, logo_url, website, sort_order } = req.body;
  if (!name) return res.status(400).json({ error: 'Company name is required' });
  try {
    const result = await query.run(
      `INSERT INTO placement_companies (name, logo_url, website, sort_order) VALUES (?,?,?,?)`,
      [name, logo_url || '', website || '', parseInt(sort_order)||0]
    );
    res.json({ success: true, id: result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update placement company
app.put('/api/placement/companies/:id', async (req, res) => {
  const { name, logo_url, website, sort_order } = req.body;
  try {
    await query.run(
      `UPDATE placement_companies SET name=?, logo_url=?, website=?, sort_order=? WHERE id=?`,
      [name, logo_url || '', website || '', parseInt(sort_order)||0, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete placement company
app.delete('/api/placement/companies/:id', async (req, res) => {
  try {
    await query.run('DELETE FROM placement_companies WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server listener
app.listen(PORT, () => {
  console.log(`Server is running dynamically on port ${PORT}`);
});


