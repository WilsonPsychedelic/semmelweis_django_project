/**
 * @param {string} canvasId
 * @param {object} data
 */
function renderClinicChart(canvasId, data) {
  const el = document.getElementById(canvasId);
  if (!el || !data || data.empty) return;

  new Chart(el, {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Clinic 1",
          data: data.clinic1,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239,68,68,0.1)",
          pointRadius: 5,
          tension: 0.3,
          fill: true,
        },
        {
          label: "Clinic 2",
          data: data.clinic2,
          borderColor: "#22c55e",                    // Tailwind green-500
          backgroundColor: "rgba(34,197,94,0.1)",
          pointRadius: 5,
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,  // allows the chart to fill the parent div's height
      plugins: { legend: { position: "top" } },
      scales: {
        y: {
          title: { display: true, text: "Proportion of deaths" },
          beginAtZero: true,
        },
        x: { title: { display: true, text: "Year" } },
      },
    },
  });
}

/**
 * @param {string} canvasId
 * @param {object} data - { labelsBefore, before, labelsAfter, after }
 */
function renderMonthlyChart(canvasId, data) {
  const el = document.getElementById(canvasId);
  if (!el || !data || data.empty) return;

  const allLabels = [...data.labelsBefore, ...data.labelsAfter];

  const beforePadded = [
    ...data.before,
    ...new Array(data.labelsAfter.length).fill(null),
  ];
  const afterPadded = [
    ...new Array(data.labelsBefore.length).fill(null),
    ...data.after,
  ];

  new Chart(el, {
    type: "line",
    data: {
      labels: allLabels,
      datasets: [
        {
          label: "Before handwashing",
          data: beforePadded,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239,68,68,0.08)",
          pointRadius: 3,
          tension: 0.2,
          spanGaps: false,
          fill: true,
        },
        {
          label: "After handwashing",
          data: afterPadded,
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.08)",
          pointRadius: 3,
          tension: 0.2,
          spanGaps: false,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "top" } },
      scales: {
        y: {
          title: { display: true, text: "Proportion of deaths" },
          beginAtZero: true,
        },
        x: {
          ticks: { maxTicksLimit: 14, maxRotation: 45 },
          title: { display: true, text: "Date" },
        },
      },
    },
  });
}

/**
 * @param {string} canvasId
 * @param {object} data - { labels, counts, ci_lower, ci_upper }
 */
function renderBootstrapHistogram(canvasId, data) {
  const el = document.getElementById(canvasId);
  if (!el || !data || data.empty) return;

  new Chart(el, {
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Frequency",
          data: data.counts,
          backgroundColor: data.labels.map((v) => {
            if (v < data.ci_lower || v > data.ci_upper)
              return "rgba(239,68,68,0.4)";    // red: outside CI
            return "rgba(59,130,246,0.6)";     // blue: inside CI
          }),
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => `Diff ≈ ${items[0].label}`,
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: "Mean difference in proportion deaths" },
          ticks: { maxTicksLimit: 10 },
        },
        y: { title: { display: true, text: "Count" } },
      },
    },
  });
}