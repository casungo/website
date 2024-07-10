<script>
  import { onMount } from "svelte";

  export let locale = "it";

  const API_URL = "https://websitealert.casungo.workers.dev/";

  let alerts = [];
  let currentLocale = locale;

  const fetchAlertData = async () => {
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
  };

  const getLocalizedErrorAlert = (locale) => ({
    visible: true,
    closable: false,
    alertClass: "alert-danger",
    icon: "bi-exclamation-triangle-fill",
    strongText: locale === "it" ? "Errore:" : "Error:",
    secondaryText: locale === "it" ? "Impossibile recuperare i dati degli avvisi." : "Unable to fetch alert data.",
  });

  const updateAlerts = async (locale) => {
    const alertsData = await fetchAlertData();
    alerts = alertsData?.[locale] ?? [getLocalizedErrorAlert(locale)];
  };

  onMount(() => {
    updateAlerts(currentLocale);
  });

  $: {
    currentLocale = locale;
    if (alerts.length === 1 && alerts[0].alertClass === "alert-danger") {
      alerts = [getLocalizedErrorAlert(currentLocale)];
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
