const { query } = require('./server/db');

const fullHtml = `
  <p>The Department is offering a Three-Month Foundation Course in Yoga Education (formerly known as Certificate Course in Yoga Education) twice a year.</p>
  <br/>
  <div class="space-y-4">
    <div class="p-4 bg-primary/5 rounded-xl border border-primary/10">
      <h3 class="font-bold text-primary mb-2">Batch Schedule</h3>
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>1st Batch :</strong> August to November (Admission process starts in the first week of July)</li>
        <li><strong>2nd Batch :</strong> February to May (Admission process starts in the first week of January)</li>
      </ul>
    </div>
    
    <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
      <h3 class="font-bold text-slate-800 dark:text-white mb-3">Course Details</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><span class="font-semibold text-slate-500">Eligibility:</span> Minimum 12th Std. or Equivalent Exam Pass</div>
        <div><span class="font-semibold text-slate-500">Age Limit:</span> 18 to 60 years (Candidates should be medically fit and sound)</div>
        <div><span class="font-semibold text-slate-500">Intake Capacity:</span> 50 students</div>
        <div><span class="font-semibold text-slate-500">Duration:</span> Three (03) months</div>
        <div><span class="font-semibold text-slate-500">Timing:</span> 03:00 pm to 06:00 pm (Monday to Friday, except University holidays)</div>
        <div><span class="font-semibold text-slate-500">Medium:</span> English & Marathi</div>
      </div>
    </div>

    <div class="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-900/30">
      <h3 class="font-bold text-green-700 dark:text-green-400 mb-2">Course Fees</h3>
      <ul class="list-disc pl-5 space-y-2">
        <li><strong>Indian Nationals:</strong> Tuition Fee Rs. 20,000/- + Other Fees as per University Rules</li>
        <li><strong>International Students:</strong> Tuition Fee Rs. 60,000/- + Other Fees as per University Rules</li>
      </ul>
      <p class="text-xs text-green-600 dark:text-green-500 mt-2 italic">* International Students should apply through the International Centre, SPPU.</p>
    </div>
  </div>
`;

query.run('UPDATE admissions SET intro_text = ? WHERE id = 1', [fullHtml])
  .then(() => console.log('Updated admission ID 1 successfully!'))
  .catch(console.error);
