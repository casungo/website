<script>
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";

  let totalVolume = 100;
  let nicotinaPercentage = 0;
  let vgPercentage = 50;
  let pgPercentage = 35;
  let aromaPercentage = 15;
  let chart;
  let showAdvancedSettings = false;
  let showTable = false;

  const defaultValues = {
    totalVolume: 100,
    nicotinaPercentage: 0,
    vgPercentage: 50,
    pgPercentage: 35,
    aromaPercentage: 15,
  };

  $: results = calculateMix(totalVolume, nicotinaPercentage, vgPercentage, pgPercentage, aromaPercentage);

  const tableVolumes = [80, 90, 100, 110, 120];

  function calculateMix(volume, nicotina, vgPercentage, pgPercentage, aromaPercentage) {
    const aroma = (aromaPercentage / 100) * volume;
    const nicotinaVolume = (nicotina / 100) * volume;
    const remainingVolume = volume - aroma - nicotinaVolume;
    const totalBasePercentage = vgPercentage + pgPercentage;
    const vg = (vgPercentage / totalBasePercentage) * remainingVolume;
    const pg = (pgPercentage / totalBasePercentage) * remainingVolume;
    return { vg, pg, aroma, nicotina: nicotinaVolume };
  }

  function handleInputClick(type) {
    const input = event.target;
    const normalizedValue = input.value.replace(",", ".");
    if (!isNaN(normalizedValue)) {
      const floatValue = parseFloat(normalizedValue);
      if (type === "volume") {
        totalVolume = Math.min(Math.max(floatValue, 3), 1000);
      } else {
        const newValue = Math.min(Math.max(floatValue, 0), 100);
        if (type === "nicotina") nicotinaPercentage = newValue;
        else if (type === "vg") vgPercentage = newValue;
        else if (type === "pg") pgPercentage = newValue;
        else if (type === "aroma") aromaPercentage = newValue;
      }
      saveToLocalStorage();
    } else {
      alert("Per favore, inserisci un numero valido.");
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
      Object.assign({ totalVolume, nicotinaPercentage, vgPercentage, pgPercentage, aromaPercentage }, defaultValues);
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
        showTable,
      }),
    );
  }

  function loadFromLocalStorage() {
    const savedSettings = JSON.parse(localStorage.getItem("svapoSettings"));
    if (savedSettings) {
      Object.assign({ totalVolume, nicotinaPercentage, vgPercentage, pgPercentage, aromaPercentage }, savedSettings);
      showTable = savedSettings.showTable || false;
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
      <label class="label cursor-pointer">
        <span class="label-text">Mostra tabella</span>
        <input type="checkbox" class="toggle toggle-primary" bind:checked={showTable} on:change={saveToLocalStorage} />
      </label>
    </div>

    {#if !showTable}
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
    {/if}

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

    {#if showTable}
      <div class="mt-6 overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Volume totale</th>
              <th>VG</th>
              <th>PG</th>
              <th>Aroma</th>
              <th>Nicotina</th>
            </tr>
          </thead>
          <tbody>
            {#each tableVolumes as volume}
              {@const mixResult = calculateMix(volume, nicotinaPercentage, vgPercentage, pgPercentage, aromaPercentage)}
              <tr>
                <td>{volume} ml</td>
                <td>{mixResult.vg.toFixed(2)} ml</td>
                <td>{mixResult.pg.toFixed(2)} ml</td>
                <td>{mixResult.aroma.toFixed(2)} ml</td>
                <td>{mixResult.nicotina.toFixed(2)} ml</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <div class="mt-6 p-4 bg-primary text-primary-content rounded-lg">
        <h3 class="font-bold text-xl mb-2">Risultati:</h3>
        <ul class="text-lg">
          <li>Glicerina Vegetale (VG): {results.vg.toFixed(2)} ml</li>
          <li>Glicole Propilenico (PG): {results.pg.toFixed(2)} ml</li>
          <li>Aroma: {results.aroma.toFixed(2)} ml</li>
          <li>Nicotina: {results.nicotina.toFixed(2)} ml</li>
        </ul>
      </div>
    {/if}

    <div class="mt-6 h-64 md:h-96">
      <canvas id="resultChart"></canvas>
    </div>

    <div class="mt-4">
      <button class="btn btn-warning" on:click={resetAll}>Resetta tutto</button>
    </div>
  </div>
</div>
