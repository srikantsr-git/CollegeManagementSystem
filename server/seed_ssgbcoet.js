const { query } = require('./db');

async function seed() {
  console.log('Starting SSGBCOET database seeding...');

  try {
    // 1. Update Settings & Branding (In-place)
    console.log('Updating settings...');
    const settingsSql = `
      INSERT INTO settings (
        id, univ_name, logo_url, theme_preset, primary_color, secondary_color,
        show_top_header, top_header_phone, top_header_email, top_header_bg_color, top_header_text_color,
        univ_tagline, accreditation_logos, zonal_features_header, zonal_features_desc,
        contact_intro, contact_address, contact_timings, contact_timings_note,
        contact_phone1, contact_phone2, contact_email1, contact_email2, contact_map_query,
        show_company_slider, company_slider_title, company_slider_desc
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)
      ON CONFLICT (id) DO UPDATE SET
        univ_name = EXCLUDED.univ_name,
        logo_url = EXCLUDED.logo_url,
        theme_preset = EXCLUDED.theme_preset,
        primary_color = EXCLUDED.primary_color,
        secondary_color = EXCLUDED.secondary_color,
        show_top_header = EXCLUDED.show_top_header,
        top_header_phone = EXCLUDED.top_header_phone,
        top_header_email = EXCLUDED.top_header_email,
        top_header_bg_color = EXCLUDED.top_header_bg_color,
        top_header_text_color = EXCLUDED.top_header_text_color,
        univ_tagline = EXCLUDED.univ_tagline,
        accreditation_logos = EXCLUDED.accreditation_logos,
        zonal_features_header = EXCLUDED.zonal_features_header,
        zonal_features_desc = EXCLUDED.zonal_features_desc,
        contact_intro = EXCLUDED.contact_intro,
        contact_address = EXCLUDED.contact_address,
        contact_timings = EXCLUDED.contact_timings,
        contact_timings_note = EXCLUDED.contact_timings_note,
        contact_phone1 = EXCLUDED.contact_phone1,
        contact_phone2 = EXCLUDED.contact_phone2,
        contact_email1 = EXCLUDED.contact_email1,
        contact_email2 = EXCLUDED.contact_email2,
        contact_map_query = EXCLUDED.contact_map_query,
        show_company_slider = EXCLUDED.show_company_slider,
        company_slider_title = EXCLUDED.company_slider_title,
        company_slider_desc = EXCLUDED.company_slider_desc
    `;
    const settingsParams = [
      1,
      'Shri Sant Gadge Baba College of Engineering & Technology, Bhusawal',
      'http://www.ssgbcoet.com/images/logo.png',
      'sapphire',
      '#1e40af',
      '#0f172a',
      1,
      '+91-2582-224364',
      'principal@ssgbcoet.com',
      '#1e40af',
      '#ffffff',
      'Autonomous Institution | Approved by AICTE | Affiliated to DBATU & KBCNMU',
      JSON.stringify([
        { id: 'naac', title: 'NAAC', subtitle: 'Accredited Grade', image_url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/NAAC_Logo.png' },
        { id: 'aicte', title: 'AICTE', subtitle: 'Approved', image_url: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/AICTE_logo.png' },
        { id: 'dbatu', title: 'DBATU', subtitle: 'Affiliated', image_url: 'https://upload.wikimedia.org/wikipedia/commons/3/30/DBATU_Logo.png' }
      ]),
      'Key Institute Highlights',
      'Explore the outstanding features of SSGBCOET including technical training cells, digital libraries, and modern learning infrastructure.',
      'The Admissions and Administrative cells are always ready to guide prospective candidates through the application process and address academic queries.',
      'Hindi Seva Mandal\'s, Shri Sant Gadge Baba College of Engineering & Technology, Near Z.T.C., Bhusawal, Dist. Jalgaon, Maharashtra, PIN - 425203',
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
    ];
    await query.run(settingsSql, settingsParams);
    console.log('Settings updated successfully.');

    // 2. Add Courses (Append)
    console.log('Seeding courses...');
    const coursesToSeed = [
      ['B.Tech in Computer Science & Engineering', 'Engineering (UG)', '4 Years', 120, 10],
      ['B.Tech in Computer Science & Engineering (Data Science)', 'Engineering (UG)', '4 Years', 60, 11],
      ['B.Tech in Electrical Engineering', 'Engineering (UG)', '4 Years', 60, 12],
      ['B.Tech in Mechanical Engineering', 'Engineering (UG)', '4 Years', 30, 13],
      ['B.Tech in Civil Engineering', 'Engineering (UG)', '4 Years', 30, 14],
      ['B.Tech in Electronics & Telecommunication Engineering', 'Engineering (UG)', '4 Years', 30, 15],
      ['B.Tech in Electronics & Computer Engineering', 'Engineering (UG)', '4 Years', 30, 16],
      ['Master of Computer Applications (MCA)', 'Postgraduate (PG)', '2 Years', 60, 17],
      ['M.E. in Electronics & Communication Engineering', 'Postgraduate (PG)', '2 Years', 18, 18],
      ['Diploma in Computer Engineering', 'Diploma', '3 Years', 60, 19],
      ['Diploma in Electrical Engineering', 'Diploma', '3 Years', 60, 20]
    ];
    for (const c of coursesToSeed) {
      const existing = await query.get('SELECT id FROM courses WHERE name = $1', [c[0]]);
      if (!existing) {
        await query.run('INSERT INTO courses (name, category, duration, intake, sort_order) VALUES ($1, $2, $3, $4, $5)', c);
        console.log(`Course added: ${c[0]}`);
      }
    }

    // 3. Add Committee Members (Append)
    console.log('Seeding committee members...');
    const committeeToSeed = [
      ['Shri Milind J. Agrawal', 'President, Hindi Seva Mandal', '', 'SSGBCOET Bhusawal', 'Near Z.T.C., Bhusawal', '', 10],
      ['Smt. Madhu D. Sharma', 'Secretary, Hindi Seva Mandal', '', 'SSGBCOET Bhusawal', 'Near Z.T.C., Bhusawal', '', 11],
      ['Shri M. D. Tiwari', 'Treasurer, Hindi Seva Mandal', '', 'SSGBCOET Bhusawal', 'Near Z.T.C., Bhusawal', '', 12],
      ['Dr. Rahul B. Barjibhe', 'Principal (Ex-officio Member)', '', 'SSGBCOET Bhusawal', 'Near Z.T.C., Bhusawal', 'principal@ssgbcoet.com', 13]
    ];
    for (const member of committeeToSeed) {
      const existing = await query.get('SELECT id FROM committee_members WHERE name = $1', [member[0]]);
      if (!existing) {
        await query.run('INSERT INTO committee_members (name, designation, photo_url, college_name, college_address, contact_details, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7)', member);
        console.log(`Committee member added: ${member[0]}`);
      }
    }

    // 4. Add HODs (Append)
    console.log('Seeding HODs...');
    const hodsToSeed = [
      ['Dr. Dinesh D. Patil', 'HOD, Computer Science & Engineering', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&q=80', 'SSGBCOET Bhusawal', 'Bhusawal, Jalgaon', 'hod.cse@ssgbcoet.com', '9890123456', 'Welcome to the Department of CSE. Our mission is to mold tech industry leaders and software innovators.', 10],
      ['Dr. Sudhir B. Ojha', 'HOD, Basic Sciences & Humanities', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&q=80', 'SSGBCOET Bhusawal', 'Bhusawal, Jalgaon', 'hod.fy@ssgbcoet.com', '9422345678', 'We provide the fundamental scientific knowledge and humanities perspective critical for every engineering career.', 11],
      ['Dr. Pankaj P. Bhangale', 'HOD, Civil Engineering', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&q=80', 'SSGBCOET Bhusawal', 'Bhusawal, Jalgaon', 'hod.civil@ssgbcoet.com', '9823456789', 'Our curriculum focuses on hands-on structural design, mapping surveys, and modern sustainable civil developments.', 12],
      ['Prof. Avinash V. Patil', 'HOD, Mechanical Engineering', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&q=80', 'SSGBCOET Bhusawal', 'Bhusawal, Jalgaon', 'hod.mech@ssgbcoet.com', '9545123456', 'Fostering cutting-edge research in manufacturing systems, thermodynamic applications, and automation systems.', 13],
      ['Dr. Girish A. Kulkarni', 'HOD, Electronics & Telecommunication', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&q=80', 'SSGBCOET Bhusawal', 'Bhusawal, Jalgaon', 'hod.entc@ssgbcoet.com', '9922334455', 'Preparing students to build IoT applications, telecom nodes, and integrated electrical-digital equipment.', 14],
      ['Dr. Ajit P. Chaudhari', 'HOD, Electrical Engineering', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop&q=80', 'SSGBCOET Bhusawal', 'Bhusawal, Jalgaon', 'hod.elec@ssgbcoet.com', '9422556677', 'Our focus lies in power networks, electric vehicle drives, and automated control systems.', 15]
    ];
    for (const h of hodsToSeed) {
      const existing = await query.get('SELECT id FROM hods WHERE name = $1', [h[0]]);
      if (!existing) {
        await query.run('INSERT INTO hods (name, designation, photo_url, college_name, college_address, email, mobile_number, message, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', h);
        console.log(`HOD added: ${h[0]}`);
      }
    }

    // 5. Update Placements HERO (In-place) & Recruiter Logos (Append)
    console.log('Seeding placement hero...');
    const placementsSql = `
      INSERT INTO placement_content (id, hero_title, hero_subtitle, content, stat_placed, stat_companies, stat_package_avg, stat_package_highest)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        hero_title = EXCLUDED.hero_title,
        hero_subtitle = EXCLUDED.hero_subtitle,
        content = EXCLUDED.content,
        stat_placed = EXCLUDED.stat_placed,
        stat_companies = EXCLUDED.stat_companies,
        stat_package_avg = EXCLUDED.stat_package_avg,
        stat_package_highest = EXCLUDED.stat_package_highest
    `;
    await query.run(placementsSql, [
      1,
      'Training & Placement Cell',
      'Connecting Student Talent with Global Technical Opportunities',
      '<h2>Welcome to T&P Cell</h2><p>The Training and Placement Cell at SSGBCOET Bhusawal plays an active role in providing placement assistance and training to students of engineering, MCA, and diploma streams. We aim to equip students with professional competency, coding proficiency, and soft skills.</p><h3>Industry Tie-ups & MoUs</h3><p>We collaborate with top-tier organizations like Monster India, Unacademy, and Huawei Telecommunications to offer certified training programs, mock interviews, and technical workshops.</p>',
      172,
      28,
      '4.2 LPA',
      '38 LPA'
    ]);

    console.log('Seeding recruiters...');
    const recruitersToSeed = [
      ['Tata Consultancy Services (TCS)', 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg', 'https://tcs.com', 10],
      ['Infosys', 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg', 'https://infosys.com', 11],
      ['Cognizant', 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Cognizant_logo.svg', 'https://cognizant.com', 12],
      ['Accenture', 'https://upload.wikimedia.org/wikipedia/commons/8/db/Accenture.svg', 'https://accenture.com', 13],
      ['Capgemini', 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Capgemini_2017_logo.svg', 'https://capgemini.com', 14],
      ['Tech Mahindra', 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Tech_Mahindra_Logo.svg', 'https://techmahindra.com', 15],
      ['Deloitte', 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Deloitte_logo.svg', 'https://deloitte.com', 16],
      ['HCL Technologies', 'https://upload.wikimedia.org/wikipedia/commons/6/6f/HCL_Technologies_logo.svg', 'https://hcltech.com', 17]
    ];
    for (const r of recruitersToSeed) {
      const existing = await query.get('SELECT id FROM placement_companies WHERE name = $1', [r[0]]);
      if (!existing) {
        await query.run('INSERT INTO placement_companies (name, logo_url, website, sort_order) VALUES ($1, $2, $3, $4)', r);
        console.log(`Recruiter added: ${r[0]}`);
      }
    }

    // 6. Seeding Landing Sliders (Append)
    console.log('Seeding landing slider slides...');
    const slidersToSeed = [
      [10, 'Shri Sant Gadge Baba College of Engineering & Technology', 'Empowering Students, Molding Futures', 'An autonomous institution in Bhusawal providing quality engineering, PG, and diploma education since 1999.', 'Explore Courses', '/courses', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80', 0.55, 1],
      [11, 'Dynamic Placements & Training', 'Corporate Opportunities', 'Join our list of placed graduates at TCS, Infosys, Tech Mahindra, and more with packages up to 38 LPA.', 'Our Placement Success', '/placements', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80', 0.6, 1],
      [12, 'Excellent Research & Infrastructure', 'Innovation Labs', 'Equipped with state-of-the-art labs, a digital library, and physical sports facilities.', 'Academic Overview', '/about', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=80', 0.50, 1]
    ];
    for (const s of slidersToSeed) {
      const existing = await query.get('SELECT id FROM slider_slides WHERE title = $1', [s[1]]);
      if (!existing) {
        await query.run('INSERT INTO slider_slides (sort_order, title, subtitle, description, btn_text, btn_link, image_url, overlay_opacity, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', s);
        console.log(`Slider added: ${s[1]}`);
      }
    }

    // 7. Seed Custom Departmental Parent and Submenu Pages (Upsert)
    console.log('Seeding custom departmental pages...');
    const customPagesSql = `
      INSERT INTO custom_pages (id, title, content, parent_menu, menu_type, is_visible, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        parent_menu = EXCLUDED.parent_menu,
        menu_type = EXCLUDED.menu_type,
        is_visible = EXCLUDED.is_visible,
        sort_order = EXCLUDED.sort_order
    `;

    const departments = [
      { id: 'civilengg', title: 'Civil Engineering', tag: 'CE', sort: 1 },
      { id: 'computer-cngg', title: 'Computer Engineering', tag: 'CSE', sort: 2 },
      { id: 'electrical-engg', title: 'Electrical Engineering', tag: 'EE', sort: 3 },
      { id: 'mechanical-engg', title: 'Mechanical Engineering', tag: 'ME', sort: 4 },
      { id: 'entc-engg', title: 'Electronics & Telecommunication', tag: 'E&TC', sort: 5 },
      { id: 'ece-engg', title: 'Electronics & Computer Engineering', tag: 'ECE', sort: 6 },
      { id: 'mca-dept', title: 'Master of Computer Applications', tag: 'MCA', sort: 7 }
    ];

    for (const dept of departments) {
      // 7a. Seed the department level-2 page
      const deptIntroHtml = `
        <div class="space-y-6">
          <div class="p-6 bg-primary/5 rounded-3xl border border-primary/10">
            <h2 class="text-2xl font-extrabold text-primary mb-3">Department of ${dept.title}</h2>
            <p class="text-slate-650 dark:text-slate-350 leading-relaxed text-sm">
              Welcome to the Department of ${dept.title} at Shri Sant Gadge Baba College of Engineering & Technology, Bhusawal. Our department is committed to imparting top-tier theoretical and practical knowledge, preparing future-ready professionals who can design solutions for modern industrial challenges.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
              <h4 class="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider mb-2">Programs Offered</h4>
              <ul class="list-disc pl-5 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <li>Bachelor of Technology (B.Tech)</li>
                <li>Industry Internships</li>
                <li>Skill Certification Workshops</li>
              </ul>
            </div>
            <div class="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
              <h4 class="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider mb-2">Key Highlights</h4>
              <ul class="list-disc pl-5 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <li>State-of-the-art Computing & Practical Labs</li>
                <li>Experienced PhD and Industry Mentors</li>
                <li>Strong Placement Track Record</li>
              </ul>
            </div>
          </div>
        </div>
      `;
      await query.run(customPagesSql, [
        dept.id,
        dept.title,
        deptIntroHtml,
        'department',
        'child',
        1,
        dept.sort
      ]);
      console.log(`Department parent seeded: ${dept.title} (#${dept.id})`);

      // 7b. Seed Level-3 "About Department" page
      const aboutId = `about-${dept.id}`;
      const aboutTitle = `About ${dept.title}`;
      const aboutHtml = `
        <div class="space-y-6">
          <div class="p-6 bg-slate-50 dark:bg-slate-800/20 border border-slate-200/60 dark:border-slate-800/50 rounded-3xl">
            <h3 class="font-bold text-lg text-slate-800 dark:text-white mb-3">Academic Laboratories</h3>
            <p class="text-xs text-slate-500 mb-4 leading-relaxed">
              We provide advanced, fully configured labs matching the DBATU university curriculum standards.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-700 dark:text-slate-350">
              <div class="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm">
                🧪 System Hardware & Networking Cell
              </div>
              <div class="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm">
                💻 Software Design & Applied Algorithms Lab
              </div>
              <div class="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm">
                📡 Telecom & Microprocessor Simulation Lab
              </div>
              <div class="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm">
                ⚙️ Industrial Automation & CAD/CAM Workshop
              </div>
            </div>
          </div>

          <div class="border-t border-slate-200/60 dark:border-slate-800/60 pt-6">
            <h3 class="font-bold text-lg text-slate-800 dark:text-white mb-4">Department Vision & Mission</h3>
            <div class="space-y-4">
              <div class="p-4 bg-purple-50/50 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-900/30 rounded-2xl">
                <h4 class="font-bold text-purple-700 dark:text-purple-400 text-xs mb-1.5 uppercase tracking-wider">Vision</h4>
                <p class="text-xs text-slate-650 dark:text-slate-350 leading-relaxed italic">
                  "To impart quality technical education among students by enhancing their learning aptitude and gearing up them with intellectual, physical, analytical and practical capabilities in ${dept.title}."
                </p>
              </div>
              <div class="p-4 bg-orange-50/50 dark:bg-orange-950/10 border border-orange-100 dark:border-orange-900/30 rounded-2xl">
                <h4 class="font-bold text-orange-700 dark:text-orange-400 text-xs mb-1.5 uppercase tracking-wider">Mission</h4>
                <p class="text-xs text-slate-650 dark:text-slate-350 leading-relaxed italic">
                  "To build up competent engineering professionals who will meet the demands of commerce and industry by providing advanced knowledge and disseminating technical development along with transferring modern technology."
                </p>
              </div>
            </div>
          </div>
        </div>
      `;
      await query.run(customPagesSql, [
        aboutId,
        aboutTitle,
        aboutHtml,
        dept.id,
        'sub-child',
        1,
        1
      ]);
      console.log(`Sub-child about page seeded: ${aboutTitle} (#${aboutId})`);

      // 7c. Seed Level-3 "PEOs & PSOs" page
      const peoId = `${dept.id}-peos`;
      const peoTitle = `${dept.tag} - PEOs, PSOs & POs`;
      const peoHtml = `
        <div class="space-y-6">
          <div class="p-6 bg-slate-50 dark:bg-slate-800/20 border border-slate-200/60 dark:border-slate-800/50 rounded-3xl">
            <h3 class="font-bold text-lg text-slate-800 dark:text-white mb-2">Program Educational Objectives (PEOs)</h3>
            <p class="text-xs text-slate-500 mb-4 leading-relaxed">
              PEOs are broad statements that describe the career and professional accomplishments that the program is preparing graduates to achieve.
            </p>
            <table class="w-full text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <thead class="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200">
                <tr>
                  <th class="p-3 text-left border-b border-slate-200 dark:border-slate-800">Objective Code</th>
                  <th class="p-3 text-left border-b border-slate-200 dark:border-slate-800">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-850 text-slate-600 dark:text-slate-400">
                <tr>
                  <td class="p-3 font-mono font-bold text-primary">PEO-1</td>
                  <td class="p-3">To provide graduates with a strong foundation in mathematical, scientific, and engineering fundamentals necessary to formulate, solve, and analyze engineering problems.</td>
                </tr>
                <tr>
                  <td class="p-3 font-mono font-bold text-primary">PEO-2</td>
                  <td class="p-3">To train graduates with good scientific and engineering breadth so as to comprehend, analyze, design, and create novel products and solutions for real-life problems.</td>
                </tr>
                <tr>
                  <td class="p-3 font-mono font-bold text-primary">PEO-3</td>
                  <td class="p-3">To inculcate professional and ethical attitude, communication skills, teamwork skills, and ability to relate engineering issues to broader social context.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="p-6 bg-slate-50 dark:bg-slate-800/20 border border-slate-200/60 dark:border-slate-800/50 rounded-3xl">
            <h3 class="font-bold text-lg text-slate-800 dark:text-white mb-2">Program Specific Outcomes (PSOs)</h3>
            <p class="text-xs text-slate-500 mb-4 leading-relaxed">
              PSOs describe what the graduates of a specific engineering program should be able to do at the time of graduation.
            </p>
            <table class="w-full text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <thead class="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200">
                <tr>
                  <th class="p-3 text-left border-b border-slate-200 dark:border-slate-800">Outcome Code</th>
                  <th class="p-3 text-left border-b border-slate-200 dark:border-slate-800">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-850 text-slate-600 dark:text-slate-400">
                <tr>
                  <td class="p-3 font-mono font-bold text-secondary">PSO-1</td>
                  <td class="p-3">Apply standard engineering practice and strategies to construct models, conduct testing, and build complex applications in the domain of ${dept.title}.</td>
                </tr>
                <tr>
                  <td class="p-3 font-mono font-bold text-secondary">PSO-2</td>
                  <td class="p-3">Deploy technical knowledge to solve engineering problems using advanced instrumentation and software design suites.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
      await query.run(customPagesSql, [
        peoId,
        peoTitle,
        peoHtml,
        dept.id,
        'sub-child',
        1,
        2
      ]);
      console.log(`Sub-child PEOs page seeded: ${peoTitle} (#${peoId})`);
    }

    console.log('SSGBCOET Database seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
}

seed();
