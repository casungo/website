<!-- src/components/navbar/ThemeSwitcher.svelte -->
<script>
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";

  let theme;

  function getPreferredColorScheme() {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  function setTheme(newTheme) {
    theme = newTheme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  onMount(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(getPreferredColorScheme());
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  });
</script>

<button class="btn btn-ghost" on:click={toggleTheme}>
  {#if theme === "light"}
    <Icon icon="material-symbols:dark-mode-rounded" class="w-5 h-5" />
  {:else}
    <Icon icon="material-symbols:light-mode-rounded" class="w-5 h-5" />
  {/if}
</button>
