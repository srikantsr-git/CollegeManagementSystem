const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'alumni.db');
const schemaPath = path.join(__dirname, 'schema.sql');

// Establish Database Connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    db.run("PRAGMA foreign_keys = ON;", (pragmaErr) => {
      if (pragmaErr) console.error('Failed to enable foreign keys:', pragmaErr.message);
    });
    initializeDatabase();
  }
});

// Run Schema initialization
function initializeDatabase() {
  try {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema, (err) => {
      if (err) {
        console.error('Error executing schema.sql:', err.message);
      } else {
        console.log('Database schema verified & seeded successfully.');
        db.run("ALTER TABLE custom_pages ADD COLUMN parent_menu TEXT DEFAULT 'about';", () => {
          db.run("UPDATE custom_pages SET parent_menu = 'academic' WHERE id IN ('courses', 'admission', 'syllabus', 'academic_results');", () => {});
          db.run("UPDATE custom_pages SET parent_menu = 'student' WHERE id IN ('souvenirs', 'calendar', 'draws', 'results');", () => {});
        });
        db.run("ALTER TABLE custom_pages ADD COLUMN menu_type TEXT DEFAULT 'child';", () => {});
        db.run("ALTER TABLE custom_pages ADD COLUMN is_visible INTEGER DEFAULT 1;", () => {});
        db.run("ALTER TABLE custom_pages ADD COLUMN show_slider INTEGER DEFAULT 0;", () => {});
        db.run("ALTER TABLE custom_pages ADD COLUMN slider_slides TEXT DEFAULT '[]';", () => {});
        db.run("ALTER TABLE custom_pages ADD COLUMN sort_order INTEGER DEFAULT 0;", () => {
          const seedMenus = [
            { id: 'about', title: 'About Us', parent_menu: 'none', menu_type: 'parent', sort_order: 1 },
            { id: 'academic', title: 'Academic', parent_menu: 'none', menu_type: 'parent', sort_order: 2 },
            { id: 'student', title: 'Student Corner', parent_menu: 'none', menu_type: 'parent', sort_order: 3 },
            { id: 'directory', title: 'Alumni Directory', parent_menu: 'none', menu_type: 'standalone', sort_order: 4 },
            { id: 'gallery', title: 'Gallery', parent_menu: 'none', menu_type: 'standalone', sort_order: 5 },
            { id: 'placements', title: 'Placements', parent_menu: 'none', menu_type: 'standalone', sort_order: 6 },
            { id: 'donations', title: 'Donations & Giving', parent_menu: 'none', menu_type: 'standalone', sort_order: 7 },
            { id: 'contact', title: 'Contact', parent_menu: 'none', menu_type: 'standalone', sort_order: 8 },
            { id: 'about_us', title: 'About Us', parent_menu: 'about', menu_type: 'child', sort_order: 1 },
            { id: 'committee', title: 'Committee', parent_menu: 'about', menu_type: 'child', sort_order: 2 },
            { id: 'hods', title: 'From HODs/Directors Desk', parent_menu: 'about', menu_type: 'child', sort_order: 3 },
            { id: 'director', title: 'Director of Phy. Edu.', parent_menu: 'about', menu_type: 'child', sort_order: 4 },
            { id: 'circulars', title: 'Circulars', parent_menu: 'about', menu_type: 'child', sort_order: 5 },
            { id: 'ncte', title: 'NCTE Mandatory Disclosures', parent_menu: 'about', menu_type: 'child', sort_order: 6 },
            { id: 'facilities', title: 'Facilities', parent_menu: 'about', menu_type: 'child', sort_order: 7 },
            { id: 'courses', title: 'Academic Courses', parent_menu: 'academic', menu_type: 'child', sort_order: 1 },
            { id: 'admission', title: 'Admissions Notice', parent_menu: 'academic', menu_type: 'child', sort_order: 2 },
            { id: 'syllabus', title: 'Curriculum Syllabus', parent_menu: 'academic', menu_type: 'child', sort_order: 3 },
            { id: 'academic_results', title: 'Academic Results', parent_menu: 'academic', menu_type: 'child', sort_order: 4 },
            { id: 'events', title: 'Events Registry', parent_menu: 'student', menu_type: 'child', sort_order: 1 },
            { id: 'stories', title: 'Stories', parent_menu: 'student', menu_type: 'child', sort_order: 2 },
            { id: 'careers', title: 'Internships & Careers', parent_menu: 'student', menu_type: 'child', sort_order: 3 },
            { id: 'activities', title: 'Activities', parent_menu: 'student', menu_type: 'child', sort_order: 4 },
            { id: 'research', title: 'Research', parent_menu: 'student', menu_type: 'child', sort_order: 5 },
            { id: 'projects', title: 'Projects', parent_menu: 'student', menu_type: 'child', sort_order: 6 },
            { id: 'calendar', title: 'Sports Calendar', parent_menu: 'student', menu_type: 'child', sort_order: 7 },
            { id: 'souvenirs', title: 'Souvenirs', parent_menu: 'student', menu_type: 'child', sort_order: 8 },
            { id: 'draws', title: 'Draws', parent_menu: 'student', menu_type: 'child', sort_order: 9 },
            { id: 'results', title: 'Results', parent_menu: 'student', menu_type: 'child', sort_order: 10 }
          ];

          seedMenus.forEach(m => {
            db.run(
              "INSERT OR IGNORE INTO custom_pages (id, title, content, parent_menu, menu_type, sort_order, is_visible) VALUES (?, ?, '', ?, ?, ?, 1)",
              [m.id, m.title, m.parent_menu, m.menu_type, m.sort_order],
              () => {
                db.run(
                  "UPDATE custom_pages SET parent_menu = ?, menu_type = ?, sort_order = ?, title = ? WHERE id = ?",
                  [m.parent_menu, m.menu_type, m.sort_order, m.title, m.id]
                );
              }
            );
          });
        });
        db.run("ALTER TABLE settings ADD COLUMN show_top_header INTEGER DEFAULT 1;", () => {});
        db.run("ALTER TABLE settings ADD COLUMN top_header_phone TEXT DEFAULT '+953 012 3654 896';", () => {});
        db.run("ALTER TABLE settings ADD COLUMN top_header_email TEXT DEFAULT 'support@apex.edu';", () => {});
        db.run("ALTER TABLE settings ADD COLUMN top_header_bg_color TEXT DEFAULT '#800020';", () => {});
        db.run("ALTER TABLE settings ADD COLUMN top_header_text_color TEXT DEFAULT '#ffffff';", () => {});
        db.run("ALTER TABLE settings ADD COLUMN social_facebook TEXT DEFAULT '#';", () => {});
        db.run("ALTER TABLE settings ADD COLUMN social_twitter TEXT DEFAULT '#';", () => {});
        db.run("ALTER TABLE settings ADD COLUMN social_linkedin TEXT DEFAULT '#';", () => {});
        db.run("ALTER TABLE settings ADD COLUMN social_instagram TEXT DEFAULT '#';", () => {});
        db.run("ALTER TABLE settings ADD COLUMN social_youtube TEXT DEFAULT '#';", () => {});
        db.run("ALTER TABLE settings ADD COLUMN top_header_links TEXT DEFAULT '[]';", () => {});
        db.run("ALTER TABLE settings ADD COLUMN show_main_header INTEGER DEFAULT 1;", () => {});
        db.run("ALTER TABLE settings ADD COLUMN univ_tagline TEXT DEFAULT 'Autonomous Institution | Approved by AICTE | Permanently Affiliated';", () => {});
        db.run("ALTER TABLE settings ADD COLUMN accreditation_logos TEXT DEFAULT '[]';", () => {});
        db.run("ALTER TABLE settings ADD COLUMN contact_intro TEXT DEFAULT 'We, the Department of Sports & Physical Education, are always ready to provide information and answers to queries of students. We aim to resolve basic and common questions about courses and other related information.';", () => {});
        db.run("ALTER TABLE settings ADD COLUMN contact_address TEXT DEFAULT 'Department of Sports & Physical Education,\nIravati Karve Social Science Complex, Behind SET Guest House,\nSavitribai Phule Pune University,\n(formerly University of Pune),\nPune - 411007, Maharashtra, INDIA.';", () => {});
        db.run("ALTER TABLE settings ADD COLUMN contact_timings TEXT DEFAULT '10:30 am to 06:00 pm';", () => {});
        db.run("ALTER TABLE settings ADD COLUMN contact_timings_note TEXT DEFAULT 'The University office has holidays on the 1st and the 3rd Saturday of every month.';", () => {});
        db.run("ALTER TABLE settings ADD COLUMN contact_phone1 TEXT DEFAULT '+91 - 20 - 25622428';", () => {});
        db.run("ALTER TABLE settings ADD COLUMN contact_phone2 TEXT DEFAULT '+91 - 20 - 25622429';", () => {});
        db.run("ALTER TABLE settings ADD COLUMN contact_email1 TEXT DEFAULT 'dpe@unipune.ac.in';", () => {});
        db.run("ALTER TABLE settings ADD COLUMN contact_email2 TEXT DEFAULT 'dpeadmin@unipune.ac.in';", () => {});
        db.run("ALTER TABLE settings ADD COLUMN contact_map_query TEXT DEFAULT 'Department of Sports and Physical Education, Savitribai Phule Pune University, Pune';", () => {});
        db.run("ALTER TABLE committee_members ADD COLUMN profile_pdf_url TEXT;", () => {});
        db.run("ALTER TABLE committee_members ADD COLUMN profile_pdf_name TEXT;", () => {});
        db.run("ALTER TABLE directors ADD COLUMN profile_pdf_url TEXT;", () => {});
        db.run("ALTER TABLE directors ADD COLUMN profile_pdf_name TEXT;", () => {});
        db.run("ALTER TABLE alumni_profiles ADD COLUMN address TEXT;", () => {});
        db.run("ALTER TABLE alumni_profiles ADD COLUMN college TEXT;", () => {});
        db.run("ALTER TABLE student_profiles ADD COLUMN photo_url TEXT;", () => {});
        db.run("ALTER TABLE student_profiles ADD COLUMN resume_name TEXT;", () => {});
        db.run("ALTER TABLE news ADD COLUMN file_url TEXT;", () => {});
        db.run("ALTER TABLE news ADD COLUMN file_name TEXT;", () => {});
        db.run(`CREATE TABLE IF NOT EXISTS hods (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, designation TEXT NOT NULL DEFAULT '', photo_url TEXT, college_name TEXT, college_address TEXT, mobile_number TEXT, email TEXT, message TEXT, sort_order INTEGER DEFAULT 0, profile_pdf_url TEXT, profile_pdf_name TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`, () => {});
        db.run(`CREATE TABLE IF NOT EXISTS spotlights (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          role TEXT,
          grad TEXT,
          photo TEXT,
          text TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
          if (!err) {
            db.get("SELECT COUNT(*) as count FROM spotlights", (countErr, row) => {
              if (!countErr && row && row.count === 0) {
                const stmt = db.prepare("INSERT INTO spotlights (name, role, grad, photo, text) VALUES (?, ?, ?, ?, ?)");
                stmt.run("John Doe", "Staff Software Engineer at Google", "Class of 2012 (Computer Science)", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&q=80", '"My years at Apex University formed the bedrock of my engineering career. The alumni network opened doors to my first internships, which eventually led me to Google. Serving as a mentor now is my way of giving back."');
                stmt.run("Jane Smith", "Vice President at Goldman Sachs", "Class of 2014 (Business Management)", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&q=80", '"The mentorship and rigorous education I received set me up to tackle the challenges of Wall Street. The community is incredibly supportive, and I am proud to sponsor scholarship funds for future business leaders."');
                stmt.run("Robert Chen", "Senior Architect at Foster + Partners", "Class of 2010 (Architecture)", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&q=80", '"Design is collaborative, and the creative environment at Apex taught me to push boundaries. Reconnecting with alumni in Europe helped establish my career abroad. It is a lifelong community."');
                stmt.finalize();
              }
            });
          }
        });

        // Create gallery table if not exists (migration-safe)
        db.run(`CREATE TABLE IF NOT EXISTS gallery (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          category TEXT NOT NULL DEFAULT 'General',
          image_url TEXT NOT NULL,
          photographer TEXT,
          location TEXT,
          date TEXT,
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`, () => {});

        // Create placement tables (migration-safe)
        db.run(`CREATE TABLE IF NOT EXISTS placement_content (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          hero_title TEXT DEFAULT 'Placements',
          hero_subtitle TEXT DEFAULT 'Building careers, Shaping futures',
          content TEXT DEFAULT '',
          stat_placed INTEGER DEFAULT 0,
          stat_companies INTEGER DEFAULT 0,
          stat_package_avg TEXT DEFAULT '0 LPA',
          stat_package_highest TEXT DEFAULT '0 LPA',
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`, () => {
          db.get('SELECT COUNT(*) as count FROM placement_content', (e, row) => {
            if (!e && row && row.count === 0) {
              db.run(`INSERT INTO placement_content (hero_title, hero_subtitle, content, stat_placed, stat_companies, stat_package_avg, stat_package_highest)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                ['Training & Placement Cell',
                 'Empowering students with industry-ready skills and connecting them with top recruiters worldwide.',
                 '<h2>About Our Placement Cell</h2><p>The Training and Placement Cell of our institution serves as a vital bridge between academia and the corporate world. We are dedicated to preparing students for the dynamic demands of the professional environment through comprehensive training programs, mock interviews, and industry interactions.</p><p>Our placement cell maintains strong relationships with leading companies across various sectors, ensuring a wide range of career opportunities for our graduating students.</p><h2>Our Training Programs</h2><p>We offer specialized training in aptitude, communication skills, technical skills, and personality development throughout the academic year. Industry experts conduct regular sessions to keep students updated with the latest trends.</p>',
                 450, 85, '6.5 LPA', '42 LPA'
                ], () => {});
            }
          });
        });

        db.run(`CREATE TABLE IF NOT EXISTS placement_companies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          logo_url TEXT,
          website TEXT,
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`, () => {
          db.get('SELECT COUNT(*) as count FROM placement_companies', (e, row) => {
            if (!e && row && row.count === 0) {
              const stmt = db.prepare("INSERT INTO placement_companies (name, logo_url, website, sort_order) VALUES (?, ?, ?, ?)");
              stmt.run("Google", "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", "https://google.com", 1);
              stmt.run("Goldman Sachs", "https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg", "https://goldmansachs.com", 2);
              stmt.run("Netflix", "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", "https://netflix.com", 3);
              stmt.run("Microsoft", "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_2012.svg", "https://microsoft.com", 4);
              stmt.run("Amazon", "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", "https://amazon.com", 5);
              stmt.run("Tata Consultancy Services", "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg", "https://tcs.com", 6);
              stmt.run("Infosys", "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg", "https://infosys.com", 7);
              stmt.finalize();
            }
          });
        });

      }
    });
  } catch (err) {
    console.error('Failed to read schema.sql file:', err.message);
  }
}

// Database helper utilities using Promises
const query = {
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  },

  exec(sql) {
    return new Promise((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};

module.exports = {
  db,
  query
};
