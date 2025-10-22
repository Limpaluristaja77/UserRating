document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedbackForm');
  const dashboard = document.getElementById('dashboard');
  const subjectSelect = document.getElementById('subject');

  async function loadSubjects() {
    const res = await fetch('/api/subjects');
    const subjects = await res.json();
    subjectSelect.innerHTML = '<option value="">Vali õppeaine</option>';
    subjects.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = s.name;
      subjectSelect.appendChild(opt);
    });
  }

  async function loadDashboard() {
    const res = await fetch('/api/dashboard');
    const data = await res.json();

    dashboard.innerHTML = '';
    if (data.length === 0) {
      dashboard.innerHTML = '<p>Andmeid pole veel lisatud.</p>';
      return;
    }

    data.forEach(entry => {
      const card = document.createElement('div');
      card.className = 'col-md-4';

      card.innerHTML = `
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${entry.subject}</h5>
            <p><strong>Keskmine hinne:</strong> ${entry.average_rating}</p>
            <p><strong>Kommentaarid:</strong><br>
              ${(entry.comments || '').split(' ||| ').map(c => `• ${c}`).join('<br>')}
            </p>
          </div>
        </div>
      `;
      dashboard.appendChild(card);
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      subject_id: parseInt(subjectSelect.value),
      student_name: document.getElementById('studentName').value.trim(),
      rating: parseInt(document.getElementById('rating').value),
      feedback_type: document.getElementById('feedbackType').value,
      comment: document.getElementById('comment').value.trim()
    };

    if (!data.subject_id) {
      alert('Palun vali õppeaine!');
      return;
    }
    if (isNaN(data.rating)) {
      alert('Palun vali hinne!');
      return;
    }

    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      form.reset();
      loadDashboard();
    } else {
      alert('Viga tagasiside saatmisel.');
    }
  });

  loadSubjects();
  loadDashboard();

});
