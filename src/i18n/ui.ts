export const languages = {
  en: "English",
  it: "Italian",
};

export const defaultLang = "en";

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
    projects: {
      title: "My Projects",
      cards: {
        website: {
          title: "This website",
          desc: "I created this website using Astro, Bootstrap & Cloudflare.",
          btnText: "Check out the source code!",
        },
        briefmaker: {
          title: "Briefmaker",
          desc: "Experience AI-powered design briefs and real-time virtual client interactions to enhance your expertise",
          btnText: "Go to the site!",
        },
        fedora33: {
          title: "Fedora 33 Wallpaper",
          desc: "I contributed to the development of the default Fedora 33 wallpaper that is shown on every machine with a fresh installation of the operating system!",
          btnText: "View the wallpaper!",
        },
        metaspark: {
          title: "Instagram Filter",
          desc: "I created some Instagram filters with Meta Spark. So far my most successful filter has 860K+ impressions and 540K+ opens with 14K+ shares.",
          btnText: "Try my filter!",
        },
        rocketassault: {
          title: "Rocket Assault",
          desc: "I translated more than 600 words for this game. The game feels like Rocket League and speedrunning combined, really challenging.",
          btnText: "Buy Rocket Assault!",
        },
        astrostarlight: {
          title: "Astro and starlight",
          desc: "I'm actively translating the documentation for Astro, the framework I'm currently using to build this site, and Starlight, a tool for creating a documentation site for any product, leveraging the power of Astro.",
          btnText: "Read the documentation",
        },
        carsteroids: {
          title: "Carsteroids",
          desc: "I translated more than 3,500 words for this game. A really well-made top-down shooter.",
          btnText: "Play CARSTEROIDS!",
        },
        "1chance": {
          title: "1 Chance",
          desc: "I translated more than 440 words for this game. Try it, it's free!",
          btnText: "Play 1 Chance!",
        },
        niagara: {
          title: "Niagara Launcher",
          desc: "I translated more than 4,500 words for this app. I use this launcher daily and recommend it to everyone.",
          btnText: "Try Niagara Launcher",
        },
      },
    },
    footer: {
      text: "This site is powered by Astro, Bootstrap & Cloudflare.",
    },
    nowPlaying: {
      title: "Alessandro is listening to",
      notPlayingSomethingText: "Normally you should see what I'm listening to on Spotify in real-time here, but now I'm not listening anything :)",
      lastPlayedText: "Last played tracks",
      networkError: "Network error: Unable to connect to Spotify",
      timeoutError: "Request timed out. Please check your connection",
      unknownError: "An unexpected error occurred",
      httpError: "Server error occurred. Please try again later",
      apiError: "Spotify API error occurred",
      toggleButtonLabel: "Toggle now playing panel",
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
    projects: {
      title: "I miei progetti",
      cards: {
        website: {
          title: "Questo sito web",
          desc: "Ho realizzato questo sito web utlizzando Astro, Bootstrap & Cloudflare.",
          btnText: "Controlla il codice sorgente!",
        },
        briefmaker: {
          title: "Briefmaker",
          desc: "Sperimenta con brief di design generati dall'IA e interazioni in tempo reale con clienti virtuali per migliorare la tua esperienza lavorativa",
          btnText: "Vai al sito!",
        },
        fedora33: {
          title: "Fedora 33 Wallpaper",
          desc: "Ho contribuito allo sviluppo dello sfondo predefinito di Fedora 33 che viene mostrato su ogni macchina con una nuova installazione del sistema operativo!",
          btnText: "Visualizza lo sfondo!",
        },
        metaspark: {
          title: "Filtro Instagram",
          desc: "Ho realizzato alcuni filtri Instagram con Meta Spark. Finora il mio filtro più riuscito ha 860K+ impressioni e 540K+ aperture con 14K+ condivisioni.",
          btnText: "Prova il mio filtro!",
        },
        rocketassault: {
          title: "Rocket Assault",
          desc: "Ho tradotto più di 600 parole per questo gioco. Il gioco si sente come Rocket League e speedrunning combinati, davvero impegnativo.",
          btnText: "Acquista Rocket Assault!",
        },
        astrostarlight: {
          title: "Astro e starlight",
          desc: "Sto attivamente traducendo la documentazione di Astro, framework che sto utilizzando in questo momento per costruire questo sito e Starlight, uno strumento che per creare un sito per la documentazione per qualsiasi prodotto, sfruttando la potenza di Astro.",
          btnText: "Leggi la documentazione",
        },
        carsteroids: {
          title: "Carsteroids",
          desc: "Ho tradotto più di 3.500 parole per questo gioco. Un shooter dall'alto davvero ben fatto.",
          btnText: "Gioca a CARSTEROIDS!",
        },
        "1chance": {
          title: "1 Chance",
          desc: "Ho tradotto più di 440 parole per questo gioco. Provalo, è gratuito!",
          btnText: "Gioca a 1 Chance!",
        },
        niagara: {
          title: "Niagara Launcher",
          desc: "Ho tradotto più di 4.500 parole per questa app. Uso questo launcher quotidianamente e lo consiglio a tutti.",
          btnText: "Prova Niagara Launcher",
        },
      },
    },
    footer: {
      text: "Questo sito è alimentato da Astro, Bootstrap & Cloudflare.",
    },
    nowPlaying: {
      title: "Alessandro sta ascoltando a",
      notPlayingSomethingText: "Normalmente qua dovresti vedere cosa sto ascoltando su Spotify in tempo reale, ma ora non sto ascoltando niente :)",
      lastPlayedText: "Ultimi brani riprodotti",
      networkError: "Errore di rete: Impossibile connettersi a Spotify",
      timeoutError: "Richiesta scaduta. Controlla la tua connessione",
      unknownError: "Si è verificato un errore imprevisto",
      httpError: "Errore del server. Riprova più tardi",
      apiError: "Errore dell'API di Spotify",
      toggleButtonLabel: "Attiva/Disattiva pannello musica",
    },
  },
} as const;
