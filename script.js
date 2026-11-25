// ---------- 시계 ----------
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
    hour: '2-digit', minute: '2-digit'
  });
}
updateClock();
setInterval(updateClock, 30000);

// ---------- 검색 (I'm Feeling Lucky) ----------
document.getElementById('lucky').addEventListener('click', () => {
  const q = document.querySelector('input[name="q"]').value.trim();
  if (q) location.href = 'https://www.google.com/search?btnI=1&q=' + encodeURIComponent(q);
});

// ---------- 날씨 (Open-Meteo, API 키 불필요) ----------
const CITIES = {
  '원주': { lat: 37.3422, lon: 127.9202 },
  '서울': { lat: 37.5665, lon: 126.9780 },
  '제주': { lat: 33.4996, lon: 126.5312 }
};

// WMO 날씨 코드 -> [아이콘, 설명]
function weatherInfo(code) {
  if (code === 0) return ['☀️', '맑음'];
  if (code <= 2) return ['🌤️', '구름 조금'];
  if (code === 3) return ['☁️', '흐림'];
  if (code <= 48) return ['🌫️', '안개'];
  if (code <= 57) return ['🌦️', '이슬비'];
  if (code <= 67) return ['🌧️', '비'];
  if (code <= 77) return ['❄️', '눈'];
  if (code <= 82) return ['🌧️', '소나기'];
  if (code <= 86) return ['🌨️', '눈보라'];
  return ['⛈️', '뇌우'];
}

async function loadWeather(card) {
  const city = card.dataset.city;
  const { lat, lon } = CITIES[city];
  card.innerHTML = `<div class="city">${city}</div><div class="desc">불러오는 중…</div>`;
  const url = 'https://api.open-meteo.com/v1/forecast'
    + `?latitude=${lat}&longitude=${lon}`
    + '&current=temperature_2m,weather_code'
    + '&daily=temperature_2m_max,temperature_2m_min'
    + '&timezone=Asia%2FSeoul&forecast_days=1';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const d = await res.json();
    const [icon, desc] = weatherInfo(d.current.weather_code);
    card.innerHTML = `
      <div class="city">${city}</div>
      <div class="icon">${icon}</div>
      <div class="temp">${Math.round(d.current.temperature_2m)}°</div>
      <div class="desc">${desc}</div>
      <div class="range">
        <span class="hi">${Math.round(d.daily.temperature_2m_max[0])}°</span> /
        <span class="lo">${Math.round(d.daily.temperature_2m_min[0])}°</span>
      </div>`;
  } catch (e) {
    card.innerHTML = `<div class="city">${city}</div><div class="desc">날씨를 불러오지 못했어요</div>`;
  }
}
document.querySelectorAll('.card').forEach(loadWeather);

// ---------- 명언 (하루에 하나, 날짜 기준) ----------
const QUOTES = [
  ['가장 큰 영광은 한 번도 실패하지 않음이 아니라, 실패할 때마다 다시 일어서는 데 있다.', '공자'],
  ['천 리 길도 한 걸음부터.', '노자'],
  ['오늘 할 수 있는 일을 내일로 미루지 마라.', '벤저민 프랭클린'],
  ['시작이 반이다.', '아리스토텔레스'],
  ['당신이 할 수 있다고 믿든 할 수 없다고 믿든, 믿는 대로 될 것이다.', '헨리 포드'],
  ['행동은 모든 성공의 가장 기본적인 열쇠다.', '파블로 피카소'],
  ['배움에는 왕도가 없다.', '유클리드'],
  ['꿈을 이룰 수 있다는 용기만 있다면 모든 꿈은 이루어진다.', '월트 디즈니'],
  ['넘어지는 것은 문제가 아니다. 일어나지 않는 것이 문제다.', '공자'],
  ['변화를 원한다면, 스스로 그 변화가 되어라.', '마하트마 간디'],
  ['단순함은 궁극의 정교함이다.', '레오나르도 다 빈치'],
  ['어제와 똑같이 살면서 다른 미래를 기대하는 것은 정신병의 초기 증세다.', '알베르트 아인슈타인'],
  ['지금 이 순간이 당신 인생에서 가장 젊은 날이다.', '작자 미상'],
  ['성공의 비결은 시작하는 것이다.', '마크 트웨인']
];

(function showQuote() {
  const today = new Date();
  const dayNumber = Math.floor(
    (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000
  );
  const [text, author] = QUOTES[dayNumber % QUOTES.length];
  document.getElementById('quote-text').textContent = `“${text}”`;
  document.getElementById('quote-author').textContent = `— ${author}`;
})();
