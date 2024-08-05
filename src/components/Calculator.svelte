<script>
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";

  let totalVolume = 100;
  let vgPercentage = 48.5;
  let pgPercentage = 33.5;
  let aromaPercentage = 15;
  let nicotinePercentage = 3;
  let showAdvanced = false;
  let chart;

  const defaultValues = {
    vg: 48.5,
    pg: 33.5,
    aroma: 15,
    nicotine: 3,
  };

  $: results = calculateMix(totalVolume, vgPercentage, pgPercentage, aromaPercentage, nicotinePercentage);

  function calculateMix(volume, vgPerc, pgPerc, aromaPerc, nicotinePerc) {
    const total = vgPerc + pgPerc + aromaPerc + nicotinePerc;
    const factor = 100 / total;

    const vg = ((volume * vgPerc * factor) / 100).toFixed(2);
    const pg = ((volume * pgPerc * factor) / 100).toFixed(2);
    const aroma = ((volume * aromaPerc * factor) / 100).toFixed(2);
    const nicotine = ((volume * nicotinePerc * factor) / 100).toFixed(2);

    return { vg, pg, aroma, nicotine };
  }

  function resetSlider(ingredient) {
    switch (ingredient) {
      case "vg":
        vgPercentage = defaultValues.vg;
        break;
      case "pg":
        pgPercentage = defaultValues.pg;
        break;
      case "aroma":
        aromaPercentage = defaultValues.aroma;
        break;
      case "nicotine":
        nicotinePercentage = defaultValues.nicotine;
        break;
    }
  }

  function handleInputClick(ingredient) {
    const newValue = prompt(`Inserisci il nuovo valore per ${ingredient}:`);
    if (newValue !== null) {
      // Replace comma with period for decimal numbers
      const normalizedValue = newValue.replace(",", ".");
      if (!isNaN(normalizedValue)) {
        const floatValue = parseFloat(normalizedValue);
        switch (ingredient) {
          case "volume":
            totalVolume = Math.min(Math.max(floatValue, 10), 300);
            break;
          case "nicotine":
            nicotinePercentage = Math.min(Math.max(floatValue, 0), 20);
            break;
          case "vg":
            vgPercentage = Math.min(Math.max(floatValue, 0), 100);
            break;
          case "pg":
            pgPercentage = Math.min(Math.max(floatValue, 0), 100);
            break;
          case "aroma":
            aromaPercentage = Math.min(Math.max(floatValue, 0), 100);
            break;
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
            data: [results.vg, results.pg, results.aroma, results.nicotine],
            backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.parsed !== null) {
                  label += context.parsed + " ml";
                }
                return label;
              },
            },
          },
        },
      },
    });
  });

  $: if (chart) {
    chart.data.datasets[0].data = [results.vg, results.pg, results.aroma, results.nicotine];
    chart.update();
  }
</script>

<div class="card bg-base-300 shadow-xl p-4 md:p-6 lg:p-8">
  <div class="card-body">
    <div class="form-control">
      <label class="label" for="totalVolume">
        <span class="label-text text-xl"
          >Volume totale:
          <button type="button" class="text-2xl font-bold underline btn-ghost btn btn-sm p-0" on:click={() => handleInputClick("volume")}>{totalVolume}</button> ml
        </span>
      </label>
      <input type="range" id="totalVolume" min="10" max="300" bind:value={totalVolume} class="range range-primary" step="10" />
    </div>

    <div class="form-control mt-4">
      <label class="label" for="nicotinePercentage">
        <span class="label-text"
          >Percentuale nicotina:
          <button type="button" class="text-2xl font-bold underline btn-ghost btn btn-sm p-0" on:click={() => handleInputClick("nicotine")}>{nicotinePercentage}</button>%
        </span>
        <button class="btn btn-xs" on:click={() => resetSlider("nicotine")}>Reset</button>
      </label>
      <input type="range" id="nicotinePercentage" min="0" max="20" bind:value={nicotinePercentage} class="range" step="0.5" />
    </div>

    <button class="btn btn-secondary mt-4" on:click={() => (showAdvanced = !showAdvanced)}>
      {showAdvanced ? "Nascondi Impostazioni Avanzate" : "Mostra Impostazioni Avanzate"}
    </button>

    {#if showAdvanced}
      <div class="mt-4 p-4 bg-base-200 rounded-lg">
        <h3 class="font-bold mb-2">Impostazioni Avanzate</h3>
        <div class="form-control">
          <label class="label" for="vgPercentage">
            <span class="label-text"
              >Percentuale VG:
              <button type="button" class="text-2xl font-bold underline btn-ghost btn btn-sm p-0" on:click={() => handleInputClick("vg")}>{vgPercentage}</button>%
            </span>
            <button class="btn btn-xs" on:click={() => resetSlider("vg")}>Reset</button>
          </label>
          <input type="range" id="vgPercentage" min="0" max="100" bind:value={vgPercentage} class="range" step="0.5" />
        </div>

        <div class="form-control mt-2">
          <label class="label" for="pgPercentage">
            <span class="label-text"
              >Percentuale PG:
              <button type="button" class="text-2xl font-bold underline btn-ghost btn btn-sm p-0" on:click={() => handleInputClick("pg")}>{pgPercentage}</button>%
            </span>
            <button class="btn btn-xs" on:click={() => resetSlider("pg")}>Reset</button>
          </label>
          <input type="range" id="pgPercentage" min="0" max="100" bind:value={pgPercentage} class="range" step="0.5" />
        </div>

        <div class="form-control mt-2">
          <label class="label" for="aromaPercentage">
            <span class="label-text"
              >Percentuale Aroma:
              <button type="button" class="text-2xl font-bold underline btn-ghost btn btn-sm p-0" on:click={() => handleInputClick("aroma")}>{aromaPercentage}</button>%
            </span>
            <button class="btn btn-xs" on:click={() => resetSlider("aroma")}>Reset</button>
          </label>
          <input type="range" id="aromaPercentage" min="0" max="100" bind:value={aromaPercentage} class="range" step="0.5" />
        </div>
      </div>
    {/if}

    <div class="mt-6 p-4 bg-primary text-primary-content rounded-lg">
      <h3 class="font-bold text-xl mb-2">Risultati:</h3>
      <ul class="text-lg">
        <li>Glicerina Vegetale (VG): {results.vg} ml</li>
        <li>Glicole Propilenico (PG): {results.pg} ml</li>
        <li>Aroma: {results.aroma} ml</li>
        <li>Nicotina: {results.nicotine} ml</li>
      </ul>
    </div>

    <div class="mt-6 h-64 md:h-96">
      <canvas id="resultChart"></canvas>
    </div>
  </div>
</div>
