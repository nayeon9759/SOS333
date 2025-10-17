// script.js
const form = document.getElementById('surveyForm');
const ctx = document.getElementById('chart');
const chartData = { '50만원 미만': 0, '50~100만원': 0, '100~200만원': 0, '200만원 이상': 0 };

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const payment = data.get('q2');
  if (payment) chartData[payment]++;

  drawChart();
  alert('응답이 제출되었습니다! 감사합니다.');
  form.reset();
});

function drawChart() {
  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(chartData),
      datasets: [{
        label: '지불 의향 금액 응답 수',
        data: Object.values(chartData),
        backgroundColor: ['#f6bd60', '#f7ede2', '#f28482', '#84a59d'],
        borderWidth: 1,
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

