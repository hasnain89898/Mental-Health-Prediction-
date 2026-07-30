// ============================================
// Date stamp & Clock
// ============================================
const stampDate = document.getElementById('stampDate');
stampDate.textContent = new Date().toLocaleDateString('en-US', {
  year: 'numeric', month: 'short', day: '2-digit'
});

const hourHand = document.getElementById('hourHand');
const minHand = document.getElementById('minHand');
const secHand = document.getElementById('secHand');

function setClock() {
  const now = new Date();
  
  const seconds = now.getSeconds();
  const secondsDegrees = ((seconds / 60) * 360);
  secHand.style.transform = `translateX(-50%) rotate(${secondsDegrees}deg)`;
  
  const mins = now.getMinutes();
  const minsDegrees = ((mins / 60) * 360) + ((seconds/60)*6);
  minHand.style.transform = `translateX(-50%) rotate(${minsDegrees}deg)`;
  
  const hour = now.getHours();
  const hourDegrees = ((hour / 12) * 360) + ((mins/60)*30);
  hourHand.style.transform = `translateX(-50%) rotate(${hourDegrees}deg)`;
}

setInterval(setClock, 1000);
setClock();

// ============================================
// Slider live outputs
// ============================================
const sliderIds = ['avg_daily_usage_hours', 'study_hours', 'physical_activity_hours', 'sleep_hours_per_night'];
sliderIds.forEach(id => {
  const slider = document.getElementById(id);
  const out = document.getElementById(id + '_out');
  slider.addEventListener('input', () => {
    out.textContent = parseFloat(slider.value).toFixed(1);
    drawWave();
  });
});

// ============================================
// Signature element: ink waveform that reacts
// to stress level + daily usage
// ============================================
const wavePath = document.getElementById('wavePath');
const waveReason = document.getElementById('waveReason');
const stressSelect = document.getElementById('stress_level');

const stressProfile = {
  'Low':       { amp: 8,  jitter: 2,  color: '#62806a' }, // sage
  'Medium':    { amp: 20, jitter: 6,  color: '#4e6c82' }, // dusk
  'High':      { amp: 36, jitter: 14, color: '#be6a45' }, // clay
  'Very High': { amp: 54, jitter: 26, color: '#a3452a' }  // deep clay
};

function drawWave() {
  const profile = stressProfile[stressSelect.value] || stressProfile['Medium'];
  const usage = parseFloat(document.getElementById('avg_daily_usage_hours').value) || 0;
  const usageFactor = 1 + Math.min(usage / 16, 1) * 0.6;

  const width = 800;
  const baseline = 80;
  const points = 64;
  const amp = profile.amp * usageFactor;

  let d = `M0,${baseline}`;
  for (let i = 1; i <= points; i++) {
    const x = (width / points) * i;
    const t = i / points;
    const wobble = Math.sin(t * Math.PI * 6) * amp
      + (Math.sin(t * Math.PI * 17) * profile.jitter * Math.random());
    const y = baseline - wobble * Math.sin(t * Math.PI); // taper ends to baseline
    d += ` L${x.toFixed(1)},${y.toFixed(1)}`;
  }

  wavePath.setAttribute('d', d);
  wavePath.style.stroke = profile.color;
  waveReason.textContent = `${stressSelect.value.toLowerCase()} stress · ${usage.toFixed(1)}h usage`;
}

stressSelect.addEventListener('change', drawWave);
document.getElementById('avg_daily_usage_hours').addEventListener('input', drawWave);
drawWave();

// ============================================
// FastAPI Backend Integration
// ============================================
// After deploying, replace with your live URL (e.g. https://mental-health-api.onrender.com/predict)
const API_URL = "http://127.0.0.1:8000/predict";

const form = document.getElementById('predictorForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const resultBox = document.getElementById('resultBox');
const errorBox = document.getElementById('errorBox');
const scoreDisplay = document.getElementById('scoreDisplay');
const scoreMessage = document.getElementById('scoreMessage');
const resultStamp = document.getElementById('resultStamp');
const resultBarFill = document.getElementById('resultBarFill');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  btnText.textContent = 'Tracing…';
  submitBtn.disabled = true;
  errorBox.classList.add('hidden');

  const payload = {
    age: parseInt(document.getElementById('age').value),
    gender: document.getElementById('gender').value,
    country: document.getElementById('country').value,
    academic_level: document.getElementById('academic_level').value,
    most_used_platform: document.getElementById('most_used_platform').value,
    purpose_of_use: document.getElementById('purpose_of_use').value,
    avg_daily_usage_hours: parseFloat(document.getElementById('avg_daily_usage_hours').value),
    daily_unlocks: parseInt(document.getElementById('daily_unlocks').value),
    study_hours: parseFloat(document.getElementById('study_hours').value),
    physical_activity_hours: parseFloat(document.getElementById('physical_activity_hours').value),
    sleep_hours_per_night: parseFloat(document.getElementById('sleep_hours_per_night').value),
    stress_level: document.getElementById('stress_level').value
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Prediction API error');

    const data = await response.json();
    const score = data.predicted_mental_health_score;
    const patientName = document.getElementById('patient_name').value || 'Subject';

    scoreDisplay.textContent = score.toFixed(2);
    resultBarFill.style.width = `${Math.min(score / 10, 1) * 100}%`;

    if (score >= 7.5) {
      scoreMessage.textContent = `Signal steady — ${patientName}'s well-being reads strong.`;
      resultStamp.textContent = 'STRONG';
      resultBarFill.style.background = '#62806a';
    } else if (score >= 5.0) {
      scoreMessage.textContent = `Signal moderate — ${patientName} could use a bit more balance.`;
      resultStamp.textContent = 'MODERATE';
      resultBarFill.style.background = '#4e6c82';
    } else {
      scoreMessage.textContent = `Signal low — ${patientName}'s stress is likely running high right now.`;
      resultStamp.textContent = 'LOW';
      resultBarFill.style.background = '#be6a45';
    }

    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (error) {
    errorBox.classList.remove('hidden');
  } finally {
    btnText.textContent = 'Trace the signal';
    submitBtn.disabled = false;
  }
});
