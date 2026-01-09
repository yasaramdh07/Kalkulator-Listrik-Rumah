let devices = [];
let chart;

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

const themeBtn = document.getElementById("themeBtn");
const logo = document.getElementById("appLogo");

/* =========================
   THEME & LOGO HANDLER
========================= */
function setTheme(mode) {
  if (mode === "dark") {
    document.body.classList.add("dark");
    themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    if (logo) logo.src = "logo.png";
  } else {
    document.body.classList.remove("dark");
    themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    if (logo) logo.src = "logo2.png";
  }

  localStorage.setItem("theme", mode);
}

function toggleTheme() {
  const isDark = document.body.classList.contains("dark");
  setTheme(isDark ? "light" : "dark");
}

/* INIT THEME */
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme);
});

/* =========================
   DEVICE HANDLER
========================= */
function addDevice() {
  const name = document.getElementById("name").value;
  const power = parseFloat(document.getElementById("power").value);
  const hours = parseFloat(document.getElementById("hours").value);

  if (!name || power <= 0 || hours <= 0) {
    alert("Input tidak valid!");
    return;
  }

  devices.push({ name, power, hours });

  document.getElementById("name").value = "";
  document.getElementById("power").value = "";
  document.getElementById("hours").value = "";

  render();
}

function deleteDevice(index) {
  devices.splice(index, 1);
  render();
}

/* =========================
   RENDER TABLE & TOTAL
========================= */
function render() {
  const tbody = document.getElementById("deviceTable");
  tbody.innerHTML = "";

  let totalKwh = 0;
  const labels = [];
  const data = [];
  const mode = document.getElementById("mode").value;

  devices.forEach((d, i) => {
    let kwh = (d.power / 1000) * d.hours;
    if (mode === "month") kwh *= 30;

    totalKwh += kwh;
    labels.push(d.name);
    data.push(kwh);

    tbody.innerHTML += `
      <tr>
        <td>${d.name}</td>
        <td>${d.power}</td>
        <td>${d.hours}</td>
        <td>${kwh.toFixed(2)}</td>
        <td>
          <button class="btn-delete" onclick="deleteDevice(${i})">
            Hapus
          </button>
        </td>
      </tr>
    `;
  });

  const price = parseFloat(document.getElementById("price").value) || 0;

  document.getElementById("totalKwh").innerText =
    totalKwh.toFixed(2) + " kWh";

  document.getElementById("totalCost").innerText =
    rupiah.format(totalKwh * price);

  renderChart(labels, data);
}

/* =========================
   CHART
========================= */
function renderChart(labels, data) {
  const ctx = document.getElementById("chart");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: "#3b82f6",
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
      },
      responsive: true,
    },
  });
}

