<script>
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";

  // State variables
  let totalVolume = 100;
  let ingredients = {
    vg: 48.5,
    pg: 33.5,
    aroma: 15,
    nicotina: 3,
  };
  let showAdvanced = false;
  let chart;

  const defaultValues = { ...ingredients };

  // Reactive declaration for results
  $: results = calculateMix(totalVolume, ingredients);

  function calculateMix(volume, { vg, pg, aroma, nicotina }) {
    const total = vg + pg + aroma + nicotina;
    const factor = 100 / total;
    return Object.fromEntries(Object.entries({ vg, pg, aroma, nicotina }).map(([key, value]) => [key, ((volume * value * factor) / 100).toFixed(2)]));
  }

  function resetSlider(ingredient) {
    ingredients[ingredient] = defaultValues[ingredient];
  }

  function handleInputClick(ingredient) {
    const newValue = prompt(`Inserisci il nuovo valore per ${ingredient}:`);
    if (newValue !== null) {
      const normalizedValue = newValue.replace(",", ".");
      if (!isNaN(normalizedValue)) {
        const floatValue = parseFloat(normalizedValue);
        const limits = {
          volume: [10, 300],
          nicotina: [0, 20],
          vg: [0, 100],
          pg: [0, 100],
          aroma: [0, 100],
        };
        if (ingredient === "volume") {
          totalVolume = Math.min(Math.max(floatValue, ...limits[ingredient]));
        } else {
          ingredients[ingredient] = Math.min(Math.max(floatValue, ...limits[ingredient]));
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
      <input type="range" id="totalVolume" min="10" max="300" bind:value={totalVolume} class="range range-primary" step="10" />
    </div>

    <div class="form-control mt-4">
      <label class="label" for="nicotinaPercentage">
        <span class="label-text">
          Percentuale nicotina:
          <button type="button" class="text-2xl font-bold underline btn-ghost btn btn-sm p-0" on:click={() => handleInputClick("nicotina")}>{ingredients.nicotina}</button>%
        </span>
        <button class="btn btn-xs" on:click={() => resetSlider("nicotina")}>Reset</button>
      </label>
      <input type="range" id="nicotinaPercentage" min="0" max="20" bind:value={ingredients.nicotina} class="range" step="0.5" />
    </div>

    <button class="btn btn-secondary mt-4" on:click={() => (showAdvanced = !showAdvanced)}>
      {showAdvanced ? "Nascondi Impostazioni Avanzate" : "Mostra Impostazioni Avanzate"}
    </button>

    {#if showAdvanced}
      <div class="mt-4 p-4 bg-base-200 rounded-lg">
        <h3 class="font-bold mb-2">Impostazioni Avanzate</h3>
        {#each ["vg", "pg", "aroma"] as ingredient}
          <div class="form-control mt-2">
            <label class="label" for="{ingredient}Percentage">
              <span class="label-text">
                Percentuale {ingredient.toUpperCase()}:
                <button type="button" class="text-2xl font-bold underline btn-ghost btn btn-sm p-0" on:click={() => handleInputClick(ingredient)}>{ingredients[ingredient]}</button>%
              </span>
              <button class="btn btn-xs" on:click={() => resetSlider(ingredient)}>Reset</button>
            </label>
            <input type="range" id="{ingredient}Percentage" min="0" max="100" bind:value={ingredients[ingredient]} class="range" step="0.5" />
          </div>
        {/each}
      </div>
    {/if}

    <div class="mt-6 p-4 bg-primary text-primary-content rounded-lg">
      <h3 class="font-bold text-xl mb-2">Risultati:</h3>
      <ul class="text-lg">
        {#each Object.entries(results) as [ingredient, value]}
          <li>{ingredient === "vg" ? "Glicerina Vegetale (VG)" : ingredient === "pg" ? "Glicole Propilenico (PG)" : ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}: {value} ml</li>
        {/each}
      </ul>
    </div>

    <div class="mt-6 h-64 md:h-96">
      <canvas id="resultChart"></canvas>
    </div>
  </div>
</div>
