<script>
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";

  // State variables
  let totalVolume = 100;
  let nicotinaPercentage = 10;
  let vgPercentage = 50;
  let pgPercentage = 35;
  let aromaPercentage = 15;
  let chart;
  let showAdvancedSettings = false;

  // Default values
  const defaultValues = {
    totalVolume: 100,
    nicotinaPercentage: 10,
    vgPercentage: 50,
    pgPercentage: 35,
    aromaPercentage: 15,
  };

  // Reactive declaration for results
  $: results = calculateMix(totalVolume, nicotinaPercentage, vgPercentage, pgPercentage, aromaPercentage);

  function calculateMix(volume, nicotina, vg, pg, aroma) {
    const total = vg + pg + aroma + nicotina;
    const factor = volume / total;

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
        } else if (type === "vg") {
          vgPercentage = Math.min(Math.max(floatValue, 0, 100));
        } else if (type === "pg") {
          pgPercentage = Math.min(Math.max(floatValue, 0, 100));
        } else if (type === "aroma") {
          aromaPercentage = Math.min(Math.max(floatValue, 0, 100));
        }
        saveToLocalStorage();
      } else {
        alert("Per favore, inserisci un numero valido.");
      }
    }
  }

  function resetSlider(type) {
    if (type === "volume") totalVolume = defaultValues.totalVolume;
    else if (type === "nicotina") nicotinaPercentage = defaultValues.nicotinaPercentage;
    else if (type === "vg") vgPercentage = defaultValues.vgPercentage;
    else if (type === "pg") pgPercentage = defaultValues.pgPercentage;
    else if (type === "aroma") aromaPercentage = defaultValues.aromaPercentage;
    saveToLocalStorage();
  }

  function resetAll() {
    if (confirm("Sei sicuro di voler resettare tutti i valori?")) {
      totalVolume = defaultValues.totalVolume;
      nicotinaPercentage = defaultValues.nicotinaPercentage;
      vgPercentage = defaultValues.vgPercentage;
      pgPercentage = defaultValues.pgPercentage;
      aromaPercentage = defaultValues.aromaPercentage;
      saveToLocalStorage();
    }
  }

  function saveToLocalStorage() {
    localStorage.setItem(
      "svapoSettings",
      JSON.stringify({
        totalVolume,
        nicotinaPercentage,
        vgPercentage,
        pgPercentage,
        aromaPercentage,
      }),
    );
  }

  function loadFromLocalStorage() {
    const savedSettings = JSON.parse(localStorage.getItem("svapoSettings"));
    if (savedSettings) {
      totalVolume = savedSettings.totalVolume;
      nicotinaPercentage = savedSettings.nicotinaPercentage;
      vgPercentage = savedSettings.vgPercentage;
      pgPercentage = savedSettings.pgPercentage;
      aromaPercentage = savedSettings.aromaPercentage;
    }
  }

  onMount(() => {
    loadFromLocalStorage();
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
        <button class="btn btn-sm btn-outline" on:click={() => resetSlider("volume")}>Reset</button>
      </label>
      <input type="range" id="totalVolume" min="0" max="200" bind:value={totalVolume} class="range range-primary" step="10" on:change={saveToLocalStorage} />
    </div>

    <div class="form-control mt-4">
      <label class="label" for="nicotinaPercentage">
        <span class="label-text">
          Percentuale nicotina:
          <button type="button" class="text-2xl font-bold underline btn-ghost btn btn-sm p-0" on:click={() => handleInputClick("nicotina")}>{nicotinaPercentage}</button>%
        </span>
        <button class="btn btn-sm btn-outline" on:click={() => resetSlider("nicotina")}>Reset</button>
      </label>
      <input type="range" id="nicotinaPercentage" min="0" max="20" bind:value={nicotinaPercentage} class="range" step="0.5" on:change={saveToLocalStorage} />
    </div>

    <div class="mt-4">
      <button class="btn btn-primary" on:click={() => (showAdvancedSettings = !showAdvancedSettings)}>
        {showAdvancedSettings ? "Nascondi" : "Mostra"} impostazioni avanzate
      </button>
    </div>

    {#if showAdvancedSettings}
      <div class="mt-4 p-4 bg-base-200 rounded-lg">
        <h3 class="font-bold text-xl mb-2">Impostazioni avanzate:</h3>
        <div class="form-control">
          <label class="label" for="vgPercentage">
            <span class="label-text">VG: <button type="button" class="font-bold underline btn-ghost btn btn-sm p-0" on:click={() => handleInputClick("vg")}>{vgPercentage}</button>%</span>
            <button class="btn btn-sm btn-outline" on:click={() => resetSlider("vg")}>Reset</button>
          </label>
          <input type="range" id="vgPercentage" min="0" max="100" bind:value={vgPercentage} class="range" step="1" on:change={saveToLocalStorage} />
        </div>
        <div class="form-control mt-2">
          <label class="label" for="pgPercentage">
            <span class="label-text">PG: <button type="button" class="font-bold underline btn-ghost btn btn-sm p-0" on:click={() => handleInputClick("pg")}>{pgPercentage}</button>%</span>
            <button class="btn btn-sm btn-outline" on:click={() => resetSlider("pg")}>Reset</button>
          </label>
          <input type="range" id="pgPercentage" min="0" max="100" bind:value={pgPercentage} class="range" step="1" on:change={saveToLocalStorage} />
        </div>
        <div class="form-control mt-2">
          <label class="label" for="aromaPercentage">
            <span class="label-text">Aroma: <button type="button" class="font-bold underline btn-ghost btn btn-sm p-0" on:click={() => handleInputClick("aroma")}>{aromaPercentage}</button>%</span>
            <button class="btn btn-sm btn-outline" on:click={() => resetSlider("aroma")}>Reset</button>
          </label>
          <input type="range" id="aromaPercentage" min="0" max="100" bind:value={aromaPercentage} class="range" step="1" on:change={saveToLocalStorage} />
        </div>
      </div>
    {/if}

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

    <div class="mt-4">
      <button class="btn btn-warning" on:click={resetAll}>Resetta tutto</button>
    </div>
  </div>
</div>
