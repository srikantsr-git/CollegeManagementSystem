/**
 * Import script: Replaces dummy committee members with real PCZSC data
 * scraped from https://pczsc.in/pczsc-data_files/pczscCommittee.htm
 */
const { query } = require('./db');

const members = [
  {
    name: "Prin. Dr. Iqbal N. Shaikh",
    designation: "President",
    photo_url: "https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/1)%20Prin.%20Dr.%20Iqubal%20Shaikh.JPG",
    college_name: "Anjuman Khairul Islam Poona College",
    college_address: "1647, Camp, New Modikhana, Pune",
    contact_details: "",
    sort_order: 1
  },
  {
    name: "Dr. Shaikh Aiyaz Hussain Jiyaull Hussain",
    designation: "Secretary",
    photo_url: "https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/2)%20Dr.%20Shaikh%20Aiyaz%20Hussain%20Jiyaull%20Hussain.JPG",
    college_name: "Anjuman Khairul Islam Poona College",
    college_address: "1647, Camp, New Modikhana, Pune",
    contact_details: "Mobile No. : 9422517809",
    sort_order: 2
  },
  {
    name: "Prof. (Dr.) Amrule Mohan Namdeo",
    designation: "Joint Secretary",
    photo_url: "https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/3)%20Prof.%20(Dr.)%20Amrule%20Mohan%20Namdeo.JPG",
    college_name: "Deccan Education Society's B.M. College of Commerce",
    college_address: "845, Shivajinagar, Daccan Gymkhana, Pune",
    contact_details: "Mobile No. : 9881600118",
    sort_order: 3
  },
  {
    name: "Prof. (Dr.) Bengle Asha Vijaykumar",
    designation: "Joint Secretary",
    photo_url: "https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/4)%20Prof.%20(Dr.)%20Bengle%20Asha%20Vijaykumar.JPG",
    college_name: "Maharashtra Education Society's Abasaheb Garware Mahavidyalay",
    college_address: "Karve Road, Pune",
    contact_details: "Mobile No. : 9922223233",
    sort_order: 4
  },
  {
    name: "Mr. Sharma Anirudha Mahesh",
    designation: "Joint Secretary",
    photo_url: "https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/5)%20Mr.%20Sharma%20Anirudha%20Mahesh.JPG",
    college_name: "Symbiosis College of Arts & Commerce",
    college_address: "Senapati Bapat Road, Pune",
    contact_details: "Mobile No. : 7709999997",
    sort_order: 5
  },
  {
    name: "Dr. Bibave Umesh Arun",
    designation: "Treasurer",
    photo_url: "https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/6)%20Dr.%20Bibave%20Umesh%20Arun.JPG",
    college_name: "Maharashtra Education Society's Garware College Of Commerce",
    college_address: "Off Karve Road, Pune",
    contact_details: "Mobile No. : 7350509990",
    sort_order: 6
  },
  {
    name: "Dr. Chikte Anagha Sunil",
    designation: "Member",
    photo_url: "https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/7)%20Dr.%20Chikte%20Anagha%20Sunil.JPG",
    college_name: "Shri Sidhvinayak Mahila Mahavidyalaya",
    college_address: "Karvenagar, Pune",
    contact_details: "Mobile No. : 9850710713",
    sort_order: 7
  },
  {
    name: "Prof. (Dr.) Dhamale Shantaram Dattu",
    designation: "Member",
    photo_url: "https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/8)%20Prof.%20(Dr.)%20Dhamale%20Shantaram%20Dattu.JPG",
    college_name: "SMSS Jedhe Arts, Commerce & Science College",
    college_address: "425, Shukrwar Peth, Pune",
    contact_details: "Mobile No. : 9421077180",
    sort_order: 8
  },
  {
    name: "Dr. Shendkar Deepak Tanaji",
    designation: "Member",
    photo_url: "https://pczsc.in/pczsc-data_files/2022-23/Committee%20Member%20Photos/11)%20Dr%20Deepak%20Shendkar_small.jpeg",
    college_name: "PES Modern Arts, Commerce & Science College",
    college_address: "Ganeshkhind, Pune",
    contact_details: "Mobile No. : 9823839014",
    sort_order: 9
  },
  {
    name: "Dr. More Shirish Vijay",
    designation: "Member",
    photo_url: "https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/10)%20Dr.%20More%20Shirish%20Vijay.JPG",
    college_name: "Chandrashekhar Agashe College of Physical Education",
    college_address: "Gultekadi, Pune",
    contact_details: "Mobile No. : 9545455910",
    sort_order: 10
  },
  {
    name: "Dr. Kondhare Manisha Manoj",
    designation: "Member",
    photo_url: "https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/11)%20Dr.%20Kondhare%20Manisha%20Manoj.JPG",
    college_name: "AISSMS College of Engineering",
    college_address: "Kennedy Road, Pune",
    contact_details: "Mobile No. : 9881294721",
    sort_order: 11
  },
  {
    name: "Mr. Parse Abhijit Venkat",
    designation: "Member",
    photo_url: "https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/12)%20Mr.%20Parse%20Abhijit%20Venkat.JPG",
    college_name: "Sanskar Mandir Art's & Commerce College",
    college_address: "Warje Malwadi, Pune",
    contact_details: "Mobile No. : 9028088199",
    sort_order: 12
  },
  {
    name: "Dr. Abhijeet Kadam",
    designation: "Member",
    photo_url: "https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/13)%20Dr.%20Abhijeet%20Kadam.JPG",
    college_name: "Dept. of Sports & Physical Education, SPPU",
    college_address: "Savitribai Phule Pune University, Pune",
    contact_details: "Mobile No. : 9689827038",
    sort_order: 13
  },
  {
    name: "Mr. Tribhuvan Mithun Prakash",
    designation: "Invitee Member",
    photo_url: "https://pczsc.in/pczsc-data_files/2025-26/Committee%20Member%20Photos/14)%20Mr.%20Tribhuvan%20Mithun%20Prakash.JPG",
    college_name: "Ness Wadia College of Commerce",
    college_address: "19, V.K Joag Path, Pune",
    contact_details: "Mobile No. : 9890776333",
    sort_order: 14
  }
];

async function importCommittee() {
  console.log('Clearing existing committee members...');
  await query.run('DELETE FROM committee_members');

  console.log(`Inserting ${members.length} PCZSC committee members...`);
  for (const m of members) {
    await query.run(
      'INSERT INTO committee_members (name, designation, photo_url, college_name, college_address, contact_details, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [m.name, m.designation, m.photo_url, m.college_name, m.college_address, m.contact_details, m.sort_order]
    );
    console.log(`  ✓ ${m.sort_order}. ${m.name} — ${m.designation}`);
  }

  const count = await query.get('SELECT COUNT(*) as cnt FROM committee_members');
  console.log(`\nDone! ${count.cnt} members now in database.`);
  process.exit(0);
}

importCommittee().catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});
