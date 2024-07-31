<script>
  import { onMount } from "svelte";

  import { getLocale } from "i18n:astro";

  const locale = getLocale();

  let alerts = [];

  async function fetchAlertData() {
    try {
      const response = await fetch("/api/alert.json");
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching alert data:", error);
      return [];
    }
  }

  onMount(async () => {
    const data = await fetchAlertData();
    alerts = data.filter((alert) => alert.locale === locale && alert.visible);
  });

  /*result for fetchAlertData():
  
  [
    {
        "_id": 1,
        "lang": "it",
        "expirationDateTime": "2024-06-24T22:00:00.000Z",
        "visible": true,
        "closable": true,
        "alertClass": "info",
        "icon": "exclamation-triangle-fill",
        "title": " Firma la lettera aperta contro gli eccessi di Piracy Shield!",
        "description": "<a href=\"https://stop-piracy-shield.it/\">Scopri di più e firma qui</a>"
    },
    {
        "_id": 2,
        "lang": "en",
        "expirationDateTime": "2024-06-24T22:00:00.000Z",
        "visible": true,
        "closable": true,
        "alertClass": "info",
        "icon": "exclamation-triangle-fill",
        "title": " Sign the open letter against the excesses of Piracy Shield!",
        "description": " <a href=\"https://stop-piracy-shield.it/\">Learn more and sign here</a>"
    },
    {
        "_id": 3,
        "lang": "it",
        "expirationDateTime": "2024-06-24T22:00:00.000Z",
        "visible": true,
        "closable": true,
        "alertClass": "info",
        "icon": "exclamation-triangle-fill",
        "title": " test1 title",
        "description": "test1 desc"
    },
    {
        "_id": 4,
        "lang": "en",
        "expirationDateTime": "2024-06-24T22:00:00.000Z",
        "visible": true,
        "closable": true,
        "alertClass": "info",
        "icon": "exclamation-triangle-fill",
        "title": " test2 title",
        "description": "test2 desc"
    }
] */
</script>

{#if alerts.length > 0}
  {#each alerts as alert}
    <div class="mt-8 mx-8">
      <div role="alert" class="alert alert-{alert.alertClass} relative">
        {#if alert.closable}
          <button on:click={() => (alerts = alerts.filter((a) => a._id !== alert._id))} class="btn btn-sm absolute -top-4 -right-4">x</button>
        {/if}
        <span>{alert.content}</span>
        <a role="button" class="btn btn-sm btn-primary text-nowrap" href={alert.CTALink}>{alert.CTA}</a>
      </div>
    </div>
  {/each}
{/if}
