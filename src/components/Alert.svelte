<script>
  import { onMount } from "svelte";

  export let locale = "it"; // Passa la lingua corrente come prop

  const API_URL = "https://websitealert.casungo.workers.dev/";

  let alerts = [];
  let currentLocale = locale; // Assegna la lingua corrente a currentLocale

  async function fetchAlertData() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching alert data:", error);
      return null;
    }
  }

  function getDefaultErrorAlert() {
    return {
      visible: true,
      closable: false,
      alertClass: "alert-danger",
      icon: "bi-exclamation-triangle-fill",
      strongText: currentLocale === "it" ? "Errore:" : "Error:",
      secondaryText: currentLocale === "it" ? "Impossibile recuperare i dati degli avvisi." : "Unable to fetch alert data.",
    };
  }

  onMount(async () => {
    const alertsData = await fetchAlertData();
    alerts = alertsData?.[currentLocale] ?? [getDefaultErrorAlert()];
  });

  $: {
    // Aggiorna currentLocale quando cambia la prop locale
    currentLocale = locale;

    // Aggiorna gli avvisi quando cambia currentLocale
    if (alerts.length === 1 && alerts[0].alertClass === "alert-danger") {
      alerts = [getDefaultErrorAlert()];
    }
  }
</script>

{#each alerts as alertData, index}
  <div class="alert alert-{alertData.alertClass} {alertData.closable ? 'alert-dismissible' : ''} fade show" role="alert">
    <i class="bi bi-{alertData.icon}"></i>
    <strong>{alertData.strongText}</strong>
    {@html alertData.secondaryText}
    {#if alertData.closable}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close Alert {index + 1}"></button>
    {/if}
  </div>
{/each}
