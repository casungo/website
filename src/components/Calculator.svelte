<script>
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";

  // State variables
  let totalVolume = 100;
  let nicotinaPercentage = 10;
  let chart;

  // Reactive declaration for results
  $: results = calculateMix(totalVolume, nicotinaPercentage);

  function calculateMix(volume, nicotina) {
    let vg, pg, aroma;

    if (nicotina === 0) {
      vg = 50;
      pg = 35;
      aroma = 15;
    } else {
      vg = Math.max(0, 50 - nicotina / 2);
      pg = Math.max(0, 35 - nicotina / 2);
      aroma = 15;
    }

    const factor = volume / 100;

    return {
      vg: Math.round(vg * factor * 100) / 100,
      pg: Math.round(pg * factor * 100) / 100,
      aroma: Math.round(aroma * factor * 100) / 100,
      nicotina: Math.round(nicotina * factor * 100) / 100,
    };
  }

  function handleInputClick(type) {
    const newValue = prompt(`Inserisci il nuovo valore per ${type}:`);
    if (newValue !== null) {
      const normalizedValue = newValue.replace(",", ".");
      if (!isNaN(normalizedValue)) {
        const floatValue = parseFloat(normalizedValue);
        if (type === "volume") {
          totalVolume = Math.min(Math.max(floatValue, 3, 100));
        } else if (type === "nicotina") {
          nicotinaPercentage = Math.min(Math.max(floatValue, 0, 20));
        }
      } else {
        alert("Per favore, inserisci un numero valido.");
      }
    }
  }

  onMount(() => {
    const ctx = document.getElementById("resultChart").getContext("2d");
    chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Glicerina Vegetale (VG)", "Glicole Propilenico (PG)", "Aroma", "Nicotina"],
        datasets: [
          {
            data: Object.values(results),
            backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top" },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.parsed} ml`,
            },
          },
        },
      },
    });
  });

  $: if (chart) {
    chart.data.datasets[0].data = Object.values(results);
    chart.update();
  }
</script>

<div class="card bg-base-300 p-4 md:p-6 lg:p-8">
  <div class="card-body">
    <div class="form-control">
      <label class="label" for="totalVolume">
        <span class="label-text text-xl">
          Volume totale:
          <button type="button" class="text-2xl font-bold underline btn-ghost btn btn-sm p-0" on:click={() => handleInputClick("volume")}>{totalVolume}</button> ml
        </span>
      </label>
      <input type="range" id="totalVolume" min="0" max="200" bind:value={totalVolume} class="range range-primary" step="10" />
    </div>

    <div class="form-control mt-4">
      <label class="label" for="nicotinaPercentage">
        <span class="label-text">
          Percentuale nicotina:
          <button type="button" class="text-2xl font-bold underline btn-ghost btn btn-sm p-0" on:click={() => handleInputClick("nicotina")}>{nicotinaPercentage}</button>%
        </span>
      </label>
      <input type="range" id="nicotinaPercentage" min="0" max="20" bind:value={nicotinaPercentage} class="range" step="0.5" />
    </div>

    <div class="mt-6 p-4 bg-primary text-primary-content rounded-lg">
      <h3 class="font-bold text-xl mb-2">Risultati:</h3>
      <ul class="text-lg">
        <li>Glicerina Vegetale (VG): {results.vg} ml</li>
        <li>Glicole Propilenico (PG): {results.pg} ml</li>
        <li>Aroma: {results.aroma} ml</li>
        <li>Nicotina: {results.nicotina} ml</li>
      </ul>
    </div>

    <div class="mt-6 h-64 md:h-96">
      <canvas id="resultChart"></canvas>
    </div>
  </div>
</div>
