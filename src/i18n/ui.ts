export const languages = {
  en: "English",
  it: "Italian",
};

export const defaultLang = "it";

export const ui = {
  en: {
    // The extra `{` on the next line has been removed
    navbar: {
      home: "Home",
      contact: "Contact Me",
      theme: {
        Emerald: "Emerald",
        Retro: "Retro",
        Corporate: "Corporate",
        Cyberpunk: "Cyberpunk",
        Coffee: "Coffee",
        Luxury: "Luxury",
        Black: "Black",
      },
    },
    intro: {
      title: "About Me",
      desc: "Hi, my name is Alessandro and I'm a guy passionate about design and programming. Below you'll find a section to contact me and another for projects I've contributed to or developed.",
    },
    contact: {
      title: "Contact Me",
      desc: "Write me a message",
      or: "or",
      form: {
        name: "First and last name",
        namePlaceholder: "Enter first and last name",
        email: "Email",
        emailPlaceholder: "Enter email address",
        message: "Message",
        messagePlaceholder: "Enter your message",
        send: "Send",
        success: "Message sent successfully!",
        error: "Error sending message. Please try again.",
        requiredFields: "Please fill in all required fields.",
      },
    },
    apps: {
      title: "Apps & Tools",
      cards: {
        bereal: {
          title: "BeReal GDPR Explorer",
          desc: "A privacy-focused tool to explore and analyze your BeReal GDPR data export. View your posts, memories, and friends.",
          btnText: "Go to website",
        },
        excel2md: {
          title: "Excel to Markdown",
          desc: "Easily convert your Excel spreadsheets, Google Sheets, and CSV files into clean, formatted Markdown tables.",
          btnText: "Convert Table",
        },
        splitmedia: {
          title: "Split Your Media",
          desc: "Media splitting that actually works. Your files are processed locally and never leave your computer. Fast, secure, and 100% private.",
          btnText: "Split Files",
        },
        briefmaker: {
          title: "Briefmaker",
          desc: "Experience AI-powered design briefs and real-time virtual client interactions to enhance your expertise",
          btnText: "Go to the site!",
        },
      },
    },
    projects: {
      title: "Apps, Tools & Projects",
      cards: {
        relationSync: {
          title: "Relation Sync for Obsidian",
          desc: "An Obsidian plugin that automates bidirectional YAML frontmatter relationships, with customizable relation pairs and bulk sync tools.",
          btnText: "View on GitHub",
        },
        sedbot: {
          title: "SedBot",
          desc: "A Telegram bot for POSIX sed-style text transformations in chats, designed to run on Cloudflare Workers.",
          btnText: "View on GitHub",
        },
        osservaprezziCarburantiHa: {
          title: "Osservaprezzi Carburanti for Home Assistant",
          desc: "A Home Assistant integration that retrieves Italian fuel prices from the MIMIT Osservaprezzi service and creates automatic sensors.",
          btnText: "View on GitHub",
        },
        fedora33: {
          title: "Fedora 33 Wallpaper",
          desc: "I contributed to the development of the default Fedora 33 wallpaper that is shown on every machine with a fresh installation of the operating system!",
          btnText: "View the wallpaper!",
        },
      },
    },
    footer: {
      madeWith: "Made with",
      stack: "Astro, daisyUI & Cloudflare",
    },
    howMade: {
      title: "How this site is made",
      description: "A short technical overview of the tools, architecture, and deployment behind this website.",
      sections: {
        stack: {
          title: "Stack",
          body: "The site is built with Astro for routing and rendering, Svelte for interactive components, Tailwind CSS with daisyUI for styling, and Cloudflare Workers for deployment.",
        },
        content: {
          title: "Content and routing",
          body: "Astro handles file-based routes, localized pages, project content, and server-rendered endpoints. Reusable layouts and components keep the page structure consistent across the site.",
        },
        styling: {
          title: "Styling",
          body: "The interface uses Tailwind CSS utilities and daisyUI themes, with light and dark modes controlled client-side so the preferred theme loads before the page renders.",
        },
        deployment: {
          title: "Deployment",
          body: "The production build targets Cloudflare Workers through the Astro Cloudflare adapter, with Cloudflare Image Resizing used for optimized project images.",
        },
      },
    },
    nowPlaying: {
      title: "Alessandro is listening to",
      notPlayingSomethingText: "Normally you should see what I'm listening to on Spotify in real-time here, but now I'm not listening anything :)",
      lastPlayedText: "Last played tracks",
    },
    // The extra `}` on the previous line has been removed
  },
  it: {
    // The extra `{` on the next line has been removed
    navbar: {
      home: "Home",
      contact: "Contattami",
      theme: {
        Emerald: "Smeraldo",
        Retro: "Retrò",
        Corporate: "Aziendale",
        Cyberpunk: "Cyberpunk",
        Coffee: "Caffè",
        Luxury: "Lussuoso",
        Black: "Nero",
      },
    },
    intro: {
      title: "Su di me",
      desc: "Ciao, mi chiamo Alessandro e sono un ragazzo appassionato di design e programmazione. Sotto troverai una sezione per contattarmi e un'altra per i progetti a cui ho contribuito o che ho sviluppato.",
    },
    contact: {
      title: "Contattami",
      desc: "Scrivimi un messaggio",
      or: "oppure",
      form: {
        name: "Nome e cognome",
        namePlaceholder: "Inserisci nome e cognome",
        email: "Email",
        emailPlaceholder: "Inserisci indirizzo email",
        message: "Messaggio",
        messagePlaceholder: "Inserisci il tuo messaggio",
        send: "Invia",
        success: "Messaggio inviato con successo!",
        error: "Errore nell'invio del messaggio. Riprova.",
        requiredFields: "Compila tutti i campi obbligatori.",
      },
    },
    apps: {
      title: "App e Strumenti",
      cards: {
        bereal: {
          title: "BeReal GDPR Explorer",
          desc: "Uno strumento incentrato sulla privacy per esplorare e analizzare l'esportazione dei tuoi dati BeReal. Visualizza i tuoi post, ricordi e amici.",
          btnText: "Vai al sito web",
        },
        excel2md: {
          title: "Excel to Markdown",
          desc: "Converti facilmente i tuoi fogli di calcolo Excel, Google Sheets e file CSV in tabelle Markdown pulite e formattate.",
          btnText: "Converti Tabella",
        },
        splitmedia: {
          title: "Split Your Media",
          desc: "Divisione dei media che funziona davvero. I tuoi file vengono elaborati localmente e non lasciano mai il tuo computer. Veloce, sicuro e privato al 100%.",
          btnText: "Dividi File",
        },
        briefmaker: {
          title: "Briefmaker",
          desc: "Sperimenta con brief di design generati dall'IA e interazioni in tempo reale con clienti virtuali per migliorare la tua esperienza lavorativa",
          btnText: "Vai al sito!",
        },
      },
    },
    projects: {
      title: "App, strumenti e progetti",
      cards: {
        relationSync: {
          title: "Relation Sync for Obsidian",
          desc: "Un plugin per Obsidian che automatizza le relazioni bidirezionali nel frontmatter YAML, con coppie personalizzabili e strumenti di sincronizzazione in massa.",
          btnText: "Apri su GitHub",
        },
        sedbot: {
          title: "SedBot",
          desc: "Un bot Telegram per trasformazioni testuali in stile POSIX sed nelle chat, progettato per funzionare su Cloudflare Workers.",
          btnText: "Apri su GitHub",
        },
        osservaprezziCarburantiHa: {
          title: "Osservaprezzi Carburanti for Home Assistant",
          desc: "Un'integrazione per Home Assistant che recupera i prezzi italiani dei carburanti dal servizio Osservaprezzi del MIMIT e crea sensori automatici.",
          btnText: "Apri su GitHub",
        },

        fedora33: {
          title: "Fedora 33 Wallpaper",
          desc: "Ho contribuito allo sviluppo dello sfondo predefinito di Fedora 33 che viene mostrato su ogni macchina con una nuova installazione del sistema operativo!",
          btnText: "Visualizza lo sfondo!",
        },
      },
    },
    footer: {
      madeWith: "Made with",
      stack: "Astro, daisyUI & Cloudflare",
    },
    howMade: {
      title: "Come è fatto questo sito",
      description: "Una breve panoramica tecnica degli strumenti, dell'architettura e del deploy dietro questo sito.",
      sections: {
        stack: {
          title: "Stack",
          body: "Il sito è costruito con Astro per routing e rendering, Svelte per i componenti interattivi, Tailwind CSS con daisyUI per lo stile e Cloudflare Workers per il deploy.",
        },
        content: {
          title: "Contenuti e routing",
          body: "Astro gestisce route basate sui file, pagine localizzate, contenuti dei progetti ed endpoint server-rendered. Layout e componenti riutilizzabili mantengono coerente la struttura delle pagine.",
        },
        styling: {
          title: "Stile",
          body: "L'interfaccia usa utility Tailwind CSS e temi daisyUI, con modalità chiara e scura controllate lato client così il tema preferito viene caricato prima del rendering della pagina.",
        },
        deployment: {
          title: "Deploy",
          body: "La build di produzione usa Cloudflare Workers tramite l'adapter Cloudflare di Astro, con Cloudflare Image Resizing per ottimizzare le immagini dei progetti.",
        },
      },
    },
    nowPlaying: {
      title: "Alessandro sta ascoltando a",
      notPlayingSomethingText: "Normalmente qua dovresti vedere cosa sto ascoltando su Spotify in tempo reale, ma ora non sto ascoltando niente :)",
      lastPlayedText: "Ultimi brani riprodotti",
    },
  },
} as const;
