/* =====================================================
   LINKHUB
   SCRIPT PRINCIPAL
   SUPORTE A PASTAS DENTRO DE PASTAS
===================================================== */


/* =====================================================
   CONFIGURAÇÃO SUPABASE
===================================================== */

const SUPABASE_URL =
    "https://pdjbwcjehmqregimlryq.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_d-ODS7kpWKsuBVTLYpDcjA_UyT9FEZJ";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =====================================================
   ESTADO
===================================================== */

let folders = [];

let currentLinks = [];

let currentFolderId = null;

let adminMode = false;

let adminPassword = "";

let editingFolderId = null;

let editingLinkId = null;

let folderSort = "newest";

let linkSort = "newest";

let folderLayout = "grid";

let linkLayout = "grid";

let foldersPerRow = 4;

let linksPerRow = 4;

let toastTimer = null;


/* =====================================================
   TEMA PADRÃO
===================================================== */

const defaultTheme = {

    background: "#f3f3f3",

    topbar: "#ffffff",

    text: "#111111",

    heading: "#000000",

    border: "#000000",

    button: "#111111",

    logo: "#111111",

    gradientEnabled: false,

    gradientStart: "#f3f3f3",

    gradientEnd: "#ffffff",

    gradientDirection: "135deg",

    borderWidth: 2,

    fontScale: 1,

    logoImage: ""

};


let currentTheme = {
    ...defaultTheme
};


/* =====================================================
   TEMAS PRONTOS
===================================================== */

const presetThemes = [

    {
        name: "Azul Oceano",
        background: "#eaf4ff",
        topbar: "#ffffff",
        text: "#12304a",
        heading: "#062b49",
        border: "#0b4f71",
        button: "#087ea4",
        logo: "#064663",
        gradientEnabled: true,
        gradientStart: "#eaf4ff",
        gradientEnd: "#d9f3ff",
        gradientDirection: "135deg"
    },

    {
        name: "Verde Natureza",
        background: "#edf8f0",
        topbar: "#ffffff",
        text: "#183b2a",
        heading: "#0c4025",
        border: "#176b3a",
        button: "#159957",
        logo: "#0d6335",
        gradientEnabled: true,
        gradientStart: "#edf8f0",
        gradientEnd: "#d8f5df",
        gradientDirection: "135deg"
    },

    {
        name: "Roxo",
        background: "#f4efff",
        topbar: "#ffffff",
        text: "#35254d",
        heading: "#28103f",
        border: "#6b3fa0",
        button: "#7b4bb7",
        logo: "#542681",
        gradientEnabled: true,
        gradientStart: "#f4efff",
        gradientEnd: "#e5d8ff",
        gradientDirection: "135deg"
    },

    {
        name: "Amarelo",
        background: "#fffbea",
        topbar: "#ffffff",
        text: "#4d420d",
        heading: "#3e3300",
        border: "#b58b00",
        button: "#e2b400",
        logo: "#876b00",
        gradientEnabled: true,
        gradientStart: "#fffbea",
        gradientEnd: "#fff1a8",
        gradientDirection: "135deg"
    },

    {
        name: "Azul + Verde",
        background: "#eefaf8",
        topbar: "#ffffff",
        text: "#173f45",
        heading: "#0c3035",
        border: "#197d78",
        button: "#168f83",
        logo: "#146b75",
        gradientEnabled: true,
        gradientStart: "#eaf6ff",
        gradientEnd: "#dff8eb",
        gradientDirection: "135deg"
    },

    {
        name: "Turquesa",
        background: "#e9fbfb",
        topbar: "#ffffff",
        text: "#164449",
        heading: "#08363b",
        border: "#178b91",
        button: "#16a6a8",
        logo: "#087278",
        gradientEnabled: true,
        gradientStart: "#e9fbfb",
        gradientEnd: "#c9f4f0",
        gradientDirection: "135deg"
    },

    {
        name: "Azul Royal",
        background: "#eef2ff",
        topbar: "#ffffff",
        text: "#172653",
        heading: "#091743",
        border: "#3154b8",
        button: "#4267d5",
        logo: "#2946a0",
        gradientEnabled: true,
        gradientStart: "#eef2ff",
        gradientEnd: "#dbe3ff",
        gradientDirection: "135deg"
    },

    {
        name: "Verde Esmeralda",
        background: "#edf9f3",
        topbar: "#ffffff",
        text: "#164132",
        heading: "#092d20",
        border: "#18875b",
        button: "#18a66d",
        logo: "#08754a",
        gradientEnabled: true,
        gradientStart: "#edf9f3",
        gradientEnd: "#d2f3e0",
        gradientDirection: "135deg"
    },

    {
        name: "Roxo + Azul",
        background: "#f1f1ff",
        topbar: "#ffffff",
        text: "#28284d",
        heading: "#171742",
        border: "#5853ad",
        button: "#625dd2",
        logo: "#44419a",
        gradientEnabled: true,
        gradientStart: "#f1f1ff",
        gradientEnd: "#e1ddff",
        gradientDirection: "135deg"
    },

    {
        name: "Laranja",
        background: "#fff4eb",
        topbar: "#ffffff",
        text: "#4d2c16",
        heading: "#3b1d0a",
        border: "#c46b24",
        button: "#df7b29",
        logo: "#a74f0c",
        gradientEnabled: true,
        gradientStart: "#fff4eb",
        gradientEnd: "#ffe0c2",
        gradientDirection: "135deg"
    },

    {
        name: "Rosa",
        background: "#fff0f6",
        topbar: "#ffffff",
        text: "#4c2335",
        heading: "#3b1025",
        border: "#b84f78",
        button: "#d76591",
        logo: "#9e3c67",
        gradientEnabled: true,
        gradientStart: "#fff0f6",
        gradientEnd: "#ffdce9",
        gradientDirection: "135deg"
    },

    {
        name: "Vermelho",
        background: "#fff0f0",
        topbar: "#ffffff",
        text: "#4b2020",
        heading: "#390d0d",
        border: "#b23b3b",
        button: "#d34d4d",
        logo: "#9c2929",
        gradientEnabled: true,
        gradientStart: "#fff0f0",
        gradientEnd: "#ffdada",
        gradientDirection: "135deg"
    },

    {
        name: "Ciano",
        background: "#eafaff",
        topbar: "#ffffff",
        text: "#153c47",
        heading: "#092d38",
        border: "#1985a0",
        button: "#20a8c5",
        logo: "#087891",
        gradientEnabled: true,
        gradientStart: "#eafaff",
        gradientEnd: "#d2f4ff",
        gradientDirection: "135deg"
    },

    {
        name: "Lavanda",
        background: "#f6f1ff",
        topbar: "#ffffff",
        text: "#3d3150",
        heading: "#281a3c",
        border: "#8665b5",
        button: "#9876cc",
        logo: "#69479c",
        gradientEnabled: true,
        gradientStart: "#f6f1ff",
        gradientEnd: "#e7dcff",
        gradientDirection: "135deg"
    },

    {
        name: "Escuro",
        background: "#17191c",
        topbar: "#22252a",
        text: "#eeeeee",
        heading: "#ffffff",
        border: "#ffffff",
        button: "#3d7cff",
        logo: "#6aa0ff",
        gradientEnabled: true,
        gradientStart: "#17191c",
        gradientEnd: "#252b38",
        gradientDirection: "135deg"
    }

];


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeSite
);


async function initializeSite() {

    setupEvents();

    renderThemePresets();

    updateAdminInterface();

    applyTheme(defaultTheme);

    await loadTheme();

    await loadFolders();

}


/* =====================================================
   EVENTOS
===================================================== */

function setupEvents() {

    /* ADMIN */

    on(
        "adminButton",
        "click",
        openAdminModal
    );

    on(
        "logoutButton",
        "click",
        logoutAdmin
    );

    on(
        "confirmAdminButton",
        "click",
        loginAdmin
    );


    const adminPasswordInput =
        document.getElementById(
            "adminPassword"
        );


    if (adminPasswordInput) {

        adminPasswordInput.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    loginAdmin();

                }

            }
        );

    }


    /* =================================================
       PASTAS
    ================================================= */

    on(
        "addFolderButton",
        "click",
        () => openFolderModal()
    );

    on(
        "saveFolderButton",
        "click",
        saveFolder
    );


    /* =================================================
       LINKS
    ================================================= */

    on(
        "addLinkButton",
        "click",
        () => openLinkModal()
    );

    on(
        "saveLinkButton",
        "click",
        saveLink
    );


    /* =================================================
       VOLTAR
    ================================================= */

    on(
        "backButton",
        "click",
        handleBackNavigation
    );


    /* =================================================
       ORGANIZAÇÃO
    ================================================= */

    on(
        "organizeButton",
        "click",
        () => toggleElement("organizePanel")
    );

    on(
        "organizeLinksButton",
        "click",
        () => toggleElement("organizeLinksPanel")
    );


    document
        .querySelectorAll(".sort-option")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    folderSort =
                        button.dataset.sort;

                    setActiveButton(
                        ".sort-option",
                        button
                    );

                    renderFolders();

                }
            );

        });


    document
        .querySelectorAll(".link-sort-option")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    linkSort =
                        button.dataset.sort;

                    setActiveButton(
                        ".link-sort-option",
                        button
                    );

                    renderCurrentFolderContents();

                }
            );

        });


    on(
        "itemsPerRow",
        "change",
        event => {

            foldersPerRow =
                Number(
                    event.target.value
                );

            applyLayout(
                document.getElementById(
                    "foldersGrid"
                ),
                foldersPerRow,
                folderLayout
            );

        }
    );


    on(
        "linksPerRow",
        "change",
        event => {

            linksPerRow =
                Number(
                    event.target.value
                );

            applyLayout(
                document.getElementById(
                    "linksGrid"
                ),
                linksPerRow,
                linkLayout
            );

        }
    );


    on(
        "layoutToggle",
        "click",
        toggleFolderLayout
    );

    on(
        "linkLayoutToggle",
        "click",
        toggleLinkLayout
    );


    /* =================================================
       TEMA
    ================================================= */

    on(
        "themeButton",
        "click",
        openThemeModal
    );

    on(
        "themeButtonLinks",
        "click",
        openThemeModal
    );

    on(
        "saveThemeButton",
        "click",
        saveTheme
    );

    on(
        "resetThemeButton",
        "click",
        resetTheme
    );


    /* =================================================
       CORES DOS CARDS
    ================================================= */

    on(
        "folderColor",
        "input",
        event => {

            const output =
                document.getElementById(
                    "folderColorValue"
                );

            if (output) {

                output.textContent =
                    event.target.value;

            }

        }
    );


    on(
        "linkColor",
        "input",
        event => {

            const output =
                document.getElementById(
                    "linkColorValue"
                );

            if (output) {

                output.textContent =
                    event.target.value;

            }

        }
    );


    /* =================================================
       LOGO
    ================================================= */

    on(
        "themeLogoImage",
        "change",
        handleLogoUpload
    );

    on(
        "removeLogoImageButton",
        "click",
        removeLogoImage
    );


    /* =================================================
       GRADIENTE
    ================================================= */

    on(
        "themeGradientEnabled",
        "change",
        updateThemePreview
    );

    on(
        "themeGradientStart",
        "input",
        updateThemePreview
    );

    on(
        "themeGradientEnd",
        "input",
        updateThemePreview
    );

    on(
        "themeGradientDirection",
        "change",
        updateThemePreview
    );


    /* =================================================
       CORES DO TEMA
    ================================================= */

    [
        "themeBackground",
        "themeTopbar",
        "themeText",
        "themeHeading",
        "themeBorder",
        "themeButtonColor",
        "themeLogo"
    ].forEach(id => {

        on(
            id,
            "input",
            updateThemePreview
        );

    });


    /* =================================================
       TAMANHOS
    ================================================= */

    on(
        "themeBorderWidth",
        "input",
        updateThemePreview
    );

    on(
        "themeFontScale",
        "input",
        updateThemePreview
    );


    /* =================================================
       MODAIS
    ================================================= */

    document
        .querySelectorAll(".modal-close")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    closeModal(
                        button.dataset.close
                    );

                }
            );

        });


    document
        .querySelectorAll(".modal-overlay")
        .forEach(overlay => {

            overlay.addEventListener(
                "click",
                event => {

                    if (
                        event.target === overlay
                    ) {

                        overlay.classList.add(
                            "hidden"
                        );

                    }

                }
            );

        });


    /* =================================================
       ESC
    ================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Escape"
            ) {

                return;

            }

            document
                .querySelectorAll(
                    ".modal-overlay:not(.hidden)"
                )
                .forEach(modal => {

                    modal.classList.add(
                        "hidden"
                    );

                });

        }
    );

}


/* =====================================================
   AUXILIAR DE EVENTOS
===================================================== */

function on(
    id,
    event,
    callback
) {

    const element =
        document.getElementById(id);

    if (!element) {

        return;

    }

    element.addEventListener(
        event,
        callback
    );

}


/* =====================================================
   CARREGAR PASTAS
===================================================== */

async function loadFolders() {

    const grid =
        document.getElementById(
            "foldersGrid"
        );

    if (!grid) {

        return;

    }

    showLoading(grid);


    const result =
        await supabaseClient
            .from("folders")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (result.error) {

        console.error(
            "Erro ao carregar pastas:",
            result.error
        );

        showError(
            grid,
            "Não foi possível carregar as pastas."
        );

        return;

    }


    folders =
        result.data || [];


    await loadFolderLinkCounts();

    renderFolders();


    /*
       Se já estamos dentro de uma pasta,
       atualiza também o conteúdo dela.
    */

    if (currentFolderId) {

        renderCurrentFolderContents();

    }

}


/* =====================================================
   CONTAGEM DE LINKS E SUBPASTAS
===================================================== */

async function loadFolderLinkCounts() {

    folders.forEach(
        folder => {

            folder.linkCount = 0;

            folder.childCount = 0;

        }
    );


    if (!folders.length) {

        return;

    }


    const result =
        await supabaseClient
            .from("links")
            .select(
                "id, folder_id"
            );


    if (result.error) {

        console.error(
            "Erro ao contar links:",
            result.error
        );

    } else {

        const counts = {};

        (result.data || []).forEach(
            link => {

                counts[link.folder_id] =
                    (
                        counts[link.folder_id] ||
                        0
                    ) + 1;

            }
        );


        folders.forEach(
            folder => {

                folder.linkCount =
                    counts[folder.id] || 0;

            }
        );

    }


    /*
       Conta quantas pastas estão
       diretamente dentro de cada pasta.
    */

    const childCounts = {};

    folders.forEach(
        folder => {

            if (folder.parent_id) {

                childCounts[folder.parent_id] =
                    (
                        childCounts[
                            folder.parent_id
                        ] || 0
                    ) + 1;

            }

        }
    );


    folders.forEach(
        folder => {

            folder.childCount =
                childCounts[folder.id] || 0;

        }
    );

}


/* =====================================================
   PASTAS VISÍVEIS
===================================================== */

function getVisibleFolders() {

    return folders.filter(
        folder => {

            if (currentFolderId === null) {

                return (
                    folder.parent_id === null ||
                    folder.parent_id === undefined
                );

            }

            return (
                String(folder.parent_id) ===
                String(currentFolderId)
            );

        }
    );

}


/* =====================================================
   RENDER PASTAS
===================================================== */

function renderFolders() {

    const grid =
        document.getElementById(
            "foldersGrid"
        );

    if (!grid) {

        return;

    }


    const visibleFolders =
        getVisibleFolders();


    if (!visibleFolders.length) {

        grid.innerHTML =
            emptyHTML(
                "📁",
                "Nenhuma pasta",
                currentFolderId === null
                    ? "Crie a primeira pasta para começar."
                    : "Esta pasta ainda não possui subpastas."
            );

        return;

    }


    const list =
        sortFolders(
            [...visibleFolders]
        );


    grid.innerHTML = "";


    list.forEach(
        folder => {

            const card =
                createFolderCard(
                    folder
                );

            grid.appendChild(
                card
            );

        }
    );


    applyLayout(
        grid,
        foldersPerRow,
        folderLayout
    );

}


/* =====================================================
   CRIAR CARD DE PASTA
===================================================== */

function createFolderCard(
    folder
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "card";


    card.style.background =
        createCardGradient(
            folder.color
        );


    const childText =
        Number(folder.childCount) === 1
            ? "pasta"
            : "pastas";


    const linkText =
        Number(folder.linkCount) === 1
            ? "link"
            : "links";


    card.innerHTML = `

        ${
            adminMode
                ? `
                <div class="card-actions">

                    <button
                        class="card-action edit-folder"
                        type="button"
                        title="Editar"
                    >
                        ✏️
                    </button>

                    <button
                        class="card-action delete delete-folder"
                        type="button"
                        title="Excluir"
                    >
                        🗑️
                    </button>

                </div>
                `
                : ""
        }


        <div>

            <div class="card-name">
                📁 ${escapeHTML(folder.name)}
            </div>

            <div class="card-description">

                ${
                    folder.childCount || 0
                }

                ${childText}

                •
                
                ${
                    folder.linkCount || 0
                }

                ${linkText}

            </div>

        </div>


        <div class="card-description">
            Clique para entrar
        </div>

    `;


    card.addEventListener(
        "click",
        () => {

            openFolder(
                folder.id
            );

        }
    );


    if (adminMode) {

        const edit =
            card.querySelector(
                ".edit-folder"
            );


        const del =
            card.querySelector(
                ".delete-folder"
            );


        if (edit) {

            edit.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    openFolderModal(
                        folder
                    );

                }
            );

        }


        if (del) {

            del.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    deleteFolder(
                        folder
                    );

                }
            );

        }

    }


    return card;

}


/* =====================================================
   ORDENAÇÃO DE PASTAS
===================================================== */

function sortFolders(list) {

    switch (folderSort) {

        case "oldest":

            return list.sort(
                (a, b) =>
                    new Date(
                        a.created_at
                    ) -
                    new Date(
                        b.created_at
                    )
            );


        case "most-links":

            return list.sort(
                (a, b) =>
                    (
                        b.linkCount || 0
                    ) -
                    (
                        a.linkCount || 0
                    )
            );


        case "least-links":

            return list.sort(
                (a, b) =>
                    (
                        a.linkCount || 0
                    ) -
                    (
                        b.linkCount || 0
                    )
            );


        case "color":

            return list.sort(
                (a, b) =>
                    String(
                        a.color || ""
                    ).localeCompare(
                        String(
                            b.color || ""
                        )
                    )
            );


        case "newest":

        default:

            return list.sort(
                (a, b) =>
                    new Date(
                        b.created_at
                    ) -
                    new Date(
                        a.created_at
                    )
            );

    }

}


/* =====================================================
   ABRIR PASTA
===================================================== */

async function openFolder(
    folderId
) {

    const folder =
        folders.find(
            item =>
                String(item.id) ===
                String(folderId)
        );


    if (!folder) {

        return;

    }


    currentFolderId =
        folder.id;


    const title =
        document.getElementById(
            "folderTitle"
        );


    if (title) {

        title.textContent =
            `📁 ${folder.name}`;

    }


    const homePage =
        document.getElementById(
            "homePage"
        );


    const folderPage =
        document.getElementById(
            "folderPage"
        );


    if (homePage) {

        homePage.classList.add(
            "hidden"
        );

    }


    if (folderPage) {

        folderPage.classList.remove(
            "hidden"
        );

    }


    updateBackButton();


    /*
       O mesmo botão de adicionar pasta
       agora cria uma subpasta.
    */

    await loadLinks(
        folder.id
    );


    renderCurrentFolderContents();

}


/* =====================================================
   VOLTAR
===================================================== */

async function handleBackNavigation() {

    if (currentFolderId === null) {

        showHome();

        return;

    }


    const currentFolder =
        folders.find(
            folder =>
                String(folder.id) ===
                String(currentFolderId)
        );


    if (
        !currentFolder ||
        !currentFolder.parent_id
    ) {

        showHome();

        return;

    }


    await openFolder(
        currentFolder.parent_id
    );

}


/* =====================================================
   ATUALIZAR BOTÃO VOLTAR
===================================================== */

function updateBackButton() {

    const button =
        document.getElementById(
            "backButton"
        );


    if (!button) {

        return;

    }


    if (currentFolderId === null) {

        button.textContent =
            "← Voltar";

        return;

    }


    const currentFolder =
        folders.find(
            folder =>
                String(folder.id) ===
                String(currentFolderId)
        );


    if (
        currentFolder &&
        currentFolder.parent_id
    ) {

        const parent =
            folders.find(
                folder =>
                    String(folder.id) ===
                    String(currentFolder.parent_id)
            );


        button.textContent =
            parent
                ? `← ${parent.name}`
                : "← Voltar";

    } else {

        button.textContent =
            "← Início";

    }

}


/* =====================================================
   CARREGAR LINKS
===================================================== */

async function loadLinks(
    folderId
) {

    const grid =
        document.getElementById(
            "linksGrid"
        );


    if (!grid) {

        return;

    }


    showLoading(grid);


    const result =
        await supabaseClient
            .from("links")
            .select("*")
            .eq(
                "folder_id",
                folderId
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (result.error) {

        console.error(
            "Erro ao carregar links:",
            result.error
        );

        showError(
            grid,
            "Não foi possível carregar os links."
        );

        return;

    }


    currentLinks =
        result.data || [];


    renderCurrentFolderContents();

}


/* =====================================================
   RENDER CONTEÚDO DA PASTA
===================================================== */

function renderCurrentFolderContents() {

    if (!currentFolderId) {

        return;

    }


    const grid =
        document.getElementById(
            "linksGrid"
        );


    if (!grid) {

        return;

    }


    const childFolders =
        sortFolders(
            folders.filter(
                folder =>
                    String(folder.parent_id) ===
                    String(currentFolderId)
            )
        );


    const sortedLinks =
        sortLinks(
            [...currentLinks]
        );


    grid.innerHTML = "";


    /*
       Primeiro aparecem as subpastas.
    */

    childFolders.forEach(
        folder => {

            grid.appendChild(
                createFolderCard(
                    folder
                )
            );

        }
    );


    /*
       Depois aparecem os links.
    */

    sortedLinks.forEach(
        link => {

            grid.appendChild(
                createLinkCard(
                    link
                )
            );

        }
    );


    if (
        childFolders.length === 0 &&
        sortedLinks.length === 0
    ) {

        grid.innerHTML =
            emptyHTML(
                "📂",
                "Pasta vazia",
                "Adicione uma subpasta ou um link."
            );

        return;

    }


    applyLayout(
        grid,
        linksPerRow,
        linkLayout
    );

}

/* =====================================================
   RENDER LINKS
===================================================== */

function renderLinks(
    links
) {

    const grid =
        document.getElementById(
            "linksGrid"
        );


    if (!grid) {

        return;

    }


    const list =
        sortLinks(
            [...links]
        );


    grid.innerHTML = "";


    list.forEach(
        link => {

            grid.appendChild(
                createLinkCard(
                    link
                )
            );

        }
    );


    applyLayout(
        grid,
        linksPerRow,
        linkLayout
    );

}


/* =====================================================
   CRIAR CARD DE LINK
===================================================== */

function createLinkCard(
    link
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "card";


    card.style.background =
        createCardGradient(
            link.color
        );


    card.innerHTML = `

        ${
            adminMode
                ? `
                <div class="card-actions">

                    <button
                        class="card-action edit-link"
                        type="button"
                        title="Editar"
                    >
                        ✏️
                    </button>

                    <button
                        class="card-action delete delete-link"
                        type="button"
                        title="Excluir"
                    >
                        🗑️
                    </button>

                </div>
                `
                : ""
        }


        <div>

            <div class="card-name">
                🔗 ${escapeHTML(link.name)}
            </div>

            <div class="card-description">
                ${escapeHTML(link.url)}
            </div>

        </div>


        <div class="card-description">
            Abrir link ↗
        </div>

    `;


    card.addEventListener(
        "click",
        () => {

            window.open(
                normalizeURL(link.url),
                "_blank",
                "noopener,noreferrer"
            );

        }
    );


    if (adminMode) {

        const edit =
            card.querySelector(
                ".edit-link"
            );


        const del =
            card.querySelector(
                ".delete-link"
            );


        if (edit) {

            edit.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    openLinkModal(
                        link
                    );

                }
            );

        }


        if (del) {

            del.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    deleteLink(
                        link
                    );

                }
            );

        }

    }


    return card;

}


/* =====================================================
   ORDENAÇÃO DOS LINKS
===================================================== */

function sortLinks(
    list
) {

    switch (linkSort) {

        case "oldest":

            return list.sort(
                (a, b) =>
                    new Date(
                        a.created_at
                    ) -
                    new Date(
                        b.created_at
                    )
            );


        case "color":

            return list.sort(
                (a, b) =>
                    String(
                        a.color || ""
                    ).localeCompare(
                        String(
                            b.color || ""
                        )
                    )
            );


        case "newest":

        default:

            return list.sort(
                (a, b) =>
                    new Date(
                        b.created_at
                    ) -
                    new Date(
                        a.created_at
                    )
            );

    }

}


/* =====================================================
   LAYOUT
===================================================== */

function applyLayout(
    grid,
    columns,
    layout
) {

    if (!grid) {

        return;

    }


    grid.style.setProperty(
        "--columns",
        columns
    );


    grid.classList.toggle(
        "vertical",
        layout === "vertical"
    );

}


function toggleFolderLayout() {

    folderLayout =
        folderLayout === "grid"
            ? "vertical"
            : "grid";


    const button =
        document.getElementById(
            "layoutToggle"
        );


    if (button) {

        button.textContent =
            folderLayout === "grid"
                ? "⬜ Grade"
                : "☰ Lista";

    }


    applyLayout(
        document.getElementById(
            "foldersGrid"
        ),
        foldersPerRow,
        folderLayout
    );

}


function toggleLinkLayout() {

    linkLayout =
        linkLayout === "grid"
            ? "vertical"
            : "grid";


    const button =
        document.getElementById(
            "linkLayoutToggle"
        );


    if (button) {

        button.textContent =
            linkLayout === "grid"
                ? "⬜ Grade"
                : "☰ Lista";

    }


    applyLayout(
        document.getElementById(
            "linksGrid"
        ),
        linksPerRow,
        linkLayout
    );

}


/* =====================================================
   ADMIN — MODAL
===================================================== */

function openAdminModal() {

    const modal =
        document.getElementById(
            "adminModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "hidden"
    );


    const input =
        document.getElementById(
            "adminPassword"
        );


    const error =
        document.getElementById(
            "adminError"
        );


    if (input) {

        input.value = "";

    }


    if (error) {

        error.textContent = "";

    }


    setTimeout(
        () => {

            if (input) {

                input.focus();

            }

        },
        50
    );

}


/* =====================================================
   ADMIN — LOGIN
===================================================== */

async function loginAdmin() {

    const input =
        document.getElementById(
            "adminPassword"
        );


    const error =
        document.getElementById(
            "adminError"
        );


    if (!input) {

        return;

    }


    const password =
        input.value.trim();


    if (!password) {

        if (error) {

            error.textContent =
                "Digite a senha.";

        }

        return;

    }


    const result =
        await supabaseClient.rpc(
            "check_admin_password",
            {
                p_password:
                    password
            }
        );


    if (result.error) {

        console.error(
            "Erro ao verificar senha:",
            result.error
        );


        if (error) {

            error.textContent =
                "Erro ao verificar a senha.";

        }

        return;

    }


    if (result.data !== true) {

        if (error) {

            error.textContent =
                "Senha incorreta.";

        }

        return;

    }


    adminMode =
        true;


    adminPassword =
        password;


    closeModal(
        "adminModal"
    );


    updateAdminInterface();

    renderFolders();


    if (currentFolderId) {

        renderCurrentFolderContents();

    }


    showToast(
        "Modo administrador ativado."
    );

}


/* =====================================================
   ADMIN — SAIR
===================================================== */

function logoutAdmin() {

    adminMode =
        false;

    adminPassword =
        "";

    updateAdminInterface();

    renderFolders();


    if (currentFolderId) {

        renderCurrentFolderContents();

    }


    showToast(
        "Modo administrador encerrado."
    );

}


/* =====================================================
   ADMIN — INTERFACE
===================================================== */

function updateAdminInterface() {

    document
        .querySelectorAll(
            ".admin-only"
        )
        .forEach(
            element => {

                element.classList.toggle(
                    "hidden",
                    !adminMode
                );

            }
        );


    const adminButton =
        document.getElementById(
            "adminButton"
        );


    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (adminButton) {

        adminButton.classList.toggle(
            "hidden",
            adminMode
        );

    }


    if (logoutButton) {

        logoutButton.classList.toggle(
            "hidden",
            !adminMode
        );

    }

}


/* =====================================================
   MODAL DE PASTA
===================================================== */

function openFolderModal(
    folder = null
) {

    editingFolderId =
        folder
            ? folder.id
            : null;


    const title =
        document.getElementById(
            "folderModalTitle"
        );


    const name =
        document.getElementById(
            "folderName"
        );


    const color =
        document.getElementById(
            "folderColor"
        );


    const colorValue =
        document.getElementById(
            "folderColorValue"
        );


    if (title) {

        title.textContent =
            folder
                ? "✏️ Editar pasta"
                : (
                    currentFolderId
                        ? "📁 Nova subpasta"
                        : "📁 Nova pasta"
                );

    }


    if (name) {

        name.value =
            folder
                ? folder.name
                : "";

    }


    const selectedColor =
        folder?.color ||
        "#4f7cff";


    if (color) {

        color.value =
            selectedColor;

    }


    if (colorValue) {

        colorValue.textContent =
            selectedColor;

    }


    const modal =
        document.getElementById(
            "folderModal"
        );


    if (modal) {

        modal.classList.remove(
            "hidden"
        );

    }

}


/* =====================================================
   SALVAR PASTA
===================================================== */

async function saveFolder() {

    const nameElement =
        document.getElementById(
            "folderName"
        );


    const colorElement =
        document.getElementById(
            "folderColor"
        );


    if (!nameElement || !colorElement) {

        return;

    }


    const name =
        nameElement.value.trim();


    const color =
        colorElement.value;


    if (!name) {

        showToast(
            "Digite um nome para a pasta."
        );

        return;

    }


    let result;


    if (editingFolderId) {

        if (!adminMode) {

            showToast(
                "Apenas o administrador pode editar pastas."
            );

            return;

        }


        result =
            await supabaseClient.rpc(
                "admin_update_folder",
                {
                    p_password:
                        adminPassword,

                    p_folder_id:
                        editingFolderId,

                    p_name:
                        name,

                    p_color:
                        color
                }
            );

    } else {

        /*
           AQUI ESTÁ A PRINCIPAL MUDANÇA:

           Se currentFolderId for null,
           a pasta fica na raiz.

           Se currentFolderId possuir um ID,
           a pasta será criada dentro dela.
        */

        result =
            await supabaseClient
                .from("folders")
                .insert({
                    name:
                        name,

                    color:
                        color,

                    parent_id:
                        currentFolderId
                });

    }


    if (result.error) {

        console.error(
            "Erro ao salvar pasta:",
            result.error
        );

        showToast(
            "Erro ao salvar a pasta."
        );

        return;

    }


    closeModal(
        "folderModal"
    );


    editingFolderId =
        null;


    await loadFolders();


    if (currentFolderId) {

        await loadLinks(
            currentFolderId
        );

    }


    showToast(
        currentFolderId
            ? "Subpasta criada."
            : "Pasta criada."
    );

}


/* =====================================================
   EXCLUIR PASTA
===================================================== */

async function deleteFolder(
    folder
) {

    if (!adminMode) {

        return;

    }


    const hasChildren =
        folders.some(
            item =>
                String(item.parent_id) ===
                String(folder.id)
        );


    let message =
        `Excluir "${folder.name}"`;


    if (hasChildren) {

        message +=
            " e todas as subpastas dentro dela?";

    } else {

        message +=
            " e os links dentro dela?";

    }


    const confirmed =
        confirm(
            message
        );


    if (!confirmed) {

        return;

    }


    const result =
        await supabaseClient.rpc(
            "admin_delete_folder",
            {
                p_password:
                    adminPassword,

                p_folder_id:
                    folder.id
            }
        );


    if (result.error) {

        console.error(
            "Erro ao excluir pasta:",
            result.error
        );

        showToast(
            "Erro ao excluir a pasta."
        );

        return;

    }


    /*
       Se excluímos a pasta atual
       ou alguma pasta acima dela,
       voltamos para um local seguro.
    */

    if (
        String(currentFolderId) ===
        String(folder.id)
    ) {

        showHome();

    }


    await loadFolders();


    if (currentFolderId) {

        await loadLinks(
            currentFolderId
        );

    }


    showToast(
        "Pasta excluída."
    );

}


/* =====================================================
   MODAL DE LINK
===================================================== */

function openLinkModal(
    link = null
) {

    if (!currentFolderId) {

        showToast(
            "Abra uma pasta primeiro."
        );

        return;

    }


    editingLinkId =
        link
            ? link.id
            : null;


    const title =
        document.getElementById(
            "linkModalTitle"
        );


    const name =
        document.getElementById(
            "linkName"
        );


    const url =
        document.getElementById(
            "linkUrl"
        );


    const color =
        document.getElementById(
            "linkColor"
        );


    const colorValue =
        document.getElementById(
            "linkColorValue"
        );


    if (title) {

        title.textContent =
            link
                ? "✏️ Editar link"
                : "🔗 Novo link";

    }


    if (name) {

        name.value =
            link
                ? link.name
                : "";

    }


    if (url) {

        url.value =
            link
                ? link.url
                : "";

    }


    const selectedColor =
        link?.color ||
        "#00a884";


    if (color) {

        color.value =
            selectedColor;

    }


    if (colorValue) {

        colorValue.textContent =
            selectedColor;

    }


    const modal =
        document.getElementById(
            "linkModal"
        );


    if (modal) {

        modal.classList.remove(
            "hidden"
        );

    }

}


/* =====================================================
   SALVAR LINK
===================================================== */

async function saveLink() {

    const nameElement =
        document.getElementById(
            "linkName"
        );


    const urlElement =
        document.getElementById(
            "linkUrl"
        );


    const colorElement =
        document.getElementById(
            "linkColor"
        );


    if (
        !nameElement ||
        !urlElement ||
        !colorElement
    ) {

        return;

    }


    const name =
        nameElement.value.trim();


    let url =
        urlElement.value.trim();


    const color =
        colorElement.value;


    if (!name || !url) {

        showToast(
            "Preencha o nome e o link."
        );

        return;

    }


    url =
        normalizeURL(
            url
        );


    if (!isValidURL(url)) {

        showToast(
            "Digite um link válido."
        );

        return;

    }


    let result;


    if (editingLinkId) {

        if (!adminMode) {

            showToast(
                "Apenas o administrador pode editar links."
            );

            return;

        }


        result =
            await supabaseClient.rpc(
                "admin_update_link",
                {
                    p_password:
                        adminPassword,

                    p_link_id:
                        editingLinkId,

                    p_name:
                        name,

                    p_url:
                        url,

                    p_color:
                        color
                }
            );

    } else {

        result =
            await supabaseClient
                .from("links")
                .insert({
                    folder_id:
                        currentFolderId,

                    name,

                    url,

                    color
                });

    }


    if (result.error) {

        console.error(
            "Erro ao salvar link:",
            result.error
        );

        showToast(
            "Erro ao salvar o link."
        );

        return;

    }


    closeModal(
        "linkModal"
    );


    editingLinkId =
        null;


    await loadLinks(
        currentFolderId
    );


    await loadFolders();


    showToast(
        "Link salvo."
    );

}


/* =====================================================
   EXCLUIR LINK
===================================================== */

async function deleteLink(
    link
) {

    if (!adminMode) {

        return;

    }


    const confirmed =
        confirm(
            `Excluir "${link.name}"?`
        );


    if (!confirmed) {

        return;

    }


    const result =
        await supabaseClient.rpc(
            "admin_delete_link",
            {
                p_password:
                    adminPassword,

                p_link_id:
                    link.id
            }
        );


    if (result.error) {

        console.error(
            "Erro ao excluir link:",
            result.error
        );

        showToast(
            "Erro ao excluir o link."
        );

        return;

    }


    await loadLinks(
        currentFolderId
    );


    await loadFolders();


    showToast(
        "Link excluído."
    );

}


/* =====================================================
   TEMA — CARREGAR
===================================================== */

async function loadTheme() {

    const result =
        await supabaseClient
            .from("site_settings")
            .select("value")
            .eq(
                "key",
                "theme"
            )
            .maybeSingle();


    if (result.error) {

        console.error(
            "Erro ao carregar tema:",
            result.error
        );

        applyTheme(
            defaultTheme
        );

        return;

    }


    if (!result.data) {

        applyTheme(
            defaultTheme
        );

        return;

    }


    try {

        const savedTheme =
            JSON.parse(
                result.data.value
            );


        currentTheme = {
            ...defaultTheme,
            ...savedTheme
        };


        applyTheme(
            currentTheme
        );

    } catch (error) {

        console.error(
            "Tema inválido:",
            error
        );

        applyTheme(
            defaultTheme
        );

    }

}


/* =====================================================
   TEMA — APLICAR
===================================================== */

function applyTheme(
    theme
) {

    currentTheme = {
        ...defaultTheme,
        ...theme
    };


    const root =
        document.documentElement;


    root.style.setProperty(
        "--background",
        currentTheme.background
    );

    root.style.setProperty(
        "--topbar",
        currentTheme.topbar
    );

    root.style.setProperty(
        "--text",
        currentTheme.text
    );

    root.style.setProperty(
        "--heading",
        currentTheme.heading
    );

    root.style.setProperty(
        "--border",
        currentTheme.border
    );

    root.style.setProperty(
        "--button",
        currentTheme.button
    );

    root.style.setProperty(
        "--logo",
        currentTheme.logo
    );

    root.style.setProperty(
        "--border-width",
        `${Number(currentTheme.borderWidth) || 2}px`
    );

    root.style.setProperty(
        "--font-scale",
        Number(currentTheme.fontScale) || 1
    );


    let backgroundValue;


    if (
        currentTheme.gradientEnabled
    ) {

        if (
            currentTheme.gradientDirection ===
            "radial"
        ) {

            backgroundValue =
                `radial-gradient(
                    circle,
                    ${currentTheme.gradientStart},
                    ${currentTheme.gradientEnd}
                )`;

        } else {

            backgroundValue =
                `linear-gradient(
                    ${currentTheme.gradientDirection},
                    ${currentTheme.gradientStart},
                    ${currentTheme.gradientEnd}
                )`;

        }

    } else {

        backgroundValue =
            currentTheme.background;

    }


    root.style.setProperty(
        "--page-background",
        backgroundValue
    );


    applyLogo();

    updateThemeControls();

}


/* =====================================================
   TEMA — MODAL
===================================================== */

function openThemeModal() {

    if (!adminMode) {

        return;

    }


    updateThemeControls();


    const modal =
        document.getElementById(
            "themeModal"
        );


    if (modal) {

        modal.classList.remove(
            "hidden"
        );

    }

}


/* =====================================================
   TEMA — CONTROLES
===================================================== */

function updateThemeControls() {

    setInput(
        "themeBackground",
        currentTheme.background
    );

    setInput(
        "themeTopbar",
        currentTheme.topbar
    );

    setInput(
        "themeText",
        currentTheme.text
    );

    setInput(
        "themeHeading",
        currentTheme.heading
    );

    setInput(
        "themeBorder",
        currentTheme.border
    );

    setInput(
        "themeButtonColor",
        currentTheme.button
    );

    setInput(
        "themeLogo",
        currentTheme.logo
    );


    const gradientEnabled =
        document.getElementById(
            "themeGradientEnabled"
        );


    if (gradientEnabled) {

        gradientEnabled.checked =
            Boolean(
                currentTheme.gradientEnabled
            );

    }


    setInput(
        "themeGradientStart",
        currentTheme.gradientStart
    );

    setInput(
        "themeGradientEnd",
        currentTheme.gradientEnd
    );


    const direction =
        document.getElementById(
            "themeGradientDirection"
        );


    if (direction) {

        direction.value =
            currentTheme.gradientDirection;

    }


    setInput(
        "themeBorderWidth",
        currentTheme.borderWidth
    );

    setInput(
        "themeFontScale",
        currentTheme.fontScale
    );


    updateRangeLabels();

    updateGradientControls();


    const imageInput =
        document.getElementById(
            "themeLogoImage"
        );


    if (imageInput) {

        imageInput.value = "";

    }


    const imageName =
        document.getElementById(
            "themeLogoImageName"
        );


    if (imageName) {

        imageName.textContent =
            currentTheme.logoImage
                ? "Imagem da logo salva"
                : "Nenhuma imagem selecionada";

    }

}


/* =====================================================
   TEMA — PREVIEW
===================================================== */

function updateThemePreview() {

    if (!adminMode) {

        return;

    }


    applyTheme(
        getThemeFromInputs()
    );

}


/* =====================================================
   TEMA — INPUTS
===================================================== */

function getThemeFromInputs() {

    return {

        ...currentTheme,

        background:
            getInputValue(
                "themeBackground",
                currentTheme.background
            ),

        topbar:
            getInputValue(
                "themeTopbar",
                currentTheme.topbar
            ),

        text:
            getInputValue(
                "themeText",
                currentTheme.text
            ),

        heading:
            getInputValue(
                "themeHeading",
                currentTheme.heading
            ),

        border:
            getInputValue(
                "themeBorder",
                currentTheme.border
            ),

        button:
            getInputValue(
                "themeButtonColor",
                currentTheme.button
            ),

        logo:
            getInputValue(
                "themeLogo",
                currentTheme.logo
            ),

        gradientEnabled:
            Boolean(
                document.getElementById(
                    "themeGradientEnabled"
                )?.checked
            ),

        gradientStart:
            getInputValue(
                "themeGradientStart",
                currentTheme.gradientStart
            ),

        gradientEnd:
            getInputValue(
                "themeGradientEnd",
                currentTheme.gradientEnd
            ),

        gradientDirection:
            getInputValue(
                "themeGradientDirection",
                currentTheme.gradientDirection
            ),

        borderWidth:
            Number(
                getInputValue(
                    "themeBorderWidth",
                    currentTheme.borderWidth
                )
            ) || 2,

        fontScale:
            Number(
                getInputValue(
                    "themeFontScale",
                    currentTheme.fontScale
                )
            ) || 1

    };

}


/* =====================================================
   TEMA — SALVAR
===================================================== */

async function saveTheme() {

    if (!adminMode) {

        return;

    }


    const theme =
        getThemeFromInputs();


    theme.logoImage =
        currentTheme.logoImage || "";


    const result =
        await supabaseClient.rpc(
            "admin_save_theme",
            {
                p_password:
                    adminPassword,

                p_theme:
                    JSON.stringify(theme)
            }
        );


    if (result.error) {

        console.error(
            "Erro ao salvar tema:",
            result.error
        );

        showToast(
            "Erro ao salvar o tema."
        );

        return;

    }


    currentTheme = {
        ...defaultTheme,
        ...theme
    };


    applyTheme(
        currentTheme
    );


    closeModal(
        "themeModal"
    );


    showToast(
        "Tema salvo na nuvem!"
    );

}


/* =====================================================
   TEMA — RESTAURAR
===================================================== */

function resetTheme() {

    if (!adminMode) {

        return;

    }


    currentTheme = {
        ...defaultTheme
    };


    updateThemeControls();

    applyTheme(
        currentTheme
    );


    showToast(
        "Tema restaurado. Clique em Salvar tema para confirmar."
    );

}


/* =====================================================
   TEMAS PRONTOS
===================================================== */

function renderThemePresets() {

    const container =
        document.getElementById(
            "themePresets"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    presetThemes.forEach(
        (preset, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";

            button.className =
                "theme-preset";

            button.title =
                preset.name;

            button.dataset.index =
                index;


            const background =
                preset.gradientEnabled
                    ? `linear-gradient(
                        ${preset.gradientDirection},
                        ${preset.gradientStart},
                        ${preset.gradientEnd}
                    )`
                    : preset.background;


            button.style.background =
                background;

            button.style.borderColor =
                preset.border;


            button.innerHTML = `

                <span
                    class="theme-preset-preview"
                    style="
                        background:${background};
                        border-color:${preset.border};
                    "
                ></span>

                <span
                    class="theme-preset-name"
                    style="
                        color:${preset.text};
                    "
                >
                    ${escapeHTML(preset.name)}
                </span>

            `;


            button.addEventListener(
                "click",
                () => {

                    applyPresetTheme(
                        preset
                    );

                }
            );


            container.appendChild(
                button
            );

        }
    );

}


/* =====================================================
   APLICAR PRESET
===================================================== */

function applyPresetTheme(
    preset
) {

    if (!adminMode) {

        return;

    }


    const preservedLogo =
        currentTheme.logoImage || "";


    currentTheme = {

        ...defaultTheme,

        ...preset,

        logoImage:
            preservedLogo

    };


    applyTheme(
        currentTheme
    );


    updateThemeControls();


    showToast(
        `"${preset.name}" aplicado. Clique em Salvar tema.`
    );

}


/* =====================================================
   GRADIENTE
===================================================== */

function updateGradientControls() {

    const enabled =
        document.getElementById(
            "themeGradientEnabled"
        )?.checked;


    const controls =
        document.getElementById(
            "gradientControls"
        );


    if (controls) {

        controls.classList.toggle(
            "hidden",
            !enabled
        );

    }

}


/* =====================================================
   RANGE LABELS
===================================================== */

function updateRangeLabels() {

    const borderWidth =
        document.getElementById(
            "themeBorderWidth"
        );

    const borderWidthValue =
        document.getElementById(
            "themeBorderWidthValue"
        );


    if (
        borderWidth &&
        borderWidthValue
    ) {

        borderWidthValue.textContent =
            `${borderWidth.value} px`;

    }


    const fontScale =
        document.getElementById(
            "themeFontScale"
        );

    const fontScaleValue =
        document.getElementById(
            "themeFontScaleValue"
        );


    if (
        fontScale &&
        fontScaleValue
    ) {

        fontScaleValue.textContent =
            `${Math.round(
                Number(fontScale.value) * 100
            )}%`;

    }


    updateGradientControls();

}


/* =====================================================
   LOGO
===================================================== */

async function handleLogoUpload(
    event
) {

    if (!adminMode) {

        return;

    }


    const file =
        event.target.files?.[0];


    if (!file) {

        return;

    }


    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        showToast(
            "Selecione uma imagem válida."
        );

        return;

    }


    try {

        showToast(
            "Processando logo..."
        );


        const dataURL =
            await resizeImage(
                file,
                700,
                0.85
            );


        currentTheme.logoImage =
            dataURL;


        const imageName =
            document.getElementById(
                "themeLogoImageName"
            );


        if (imageName) {

            imageName.textContent =
                file.name;

        }


        applyLogo();


        showToast(
            "Logo carregada. Clique em Salvar tema."
        );

    } catch (error) {

        console.error(
            "Erro ao processar logo:",
            error
        );

        showToast(
            "Não foi possível carregar a logo."
        );

    }

}


/* =====================================================
   REDIMENSIONAR IMAGEM
===================================================== */

function resizeImage(
    file,
    maxSize,
    quality
) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onerror =
                () => reject(
                    new Error(
                        "Erro ao ler imagem."
                    )
                );


            reader.onload =
                () => {

                    const image =
                        new Image();


                    image.onerror =
                        () => reject(
                            new Error(
                                "Imagem inválida."
                            )
                        );


                    image.onload =
                        () => {

                            let width =
                                image.width;

                            let height =
                                image.height;


                            const scale =
                                Math.min(
                                    1,
                                    maxSize /
                                        Math.max(
                                            width,
                                            height
                                        )
                                );


                            width =
                                Math.round(
                                    width * scale
                                );

                            height =
                                Math.round(
                                    height * scale
                                );


                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            canvas.width =
                                width;

                            canvas.height =
                                height;


                            const context =
                                canvas.getContext(
                                    "2d"
                                );


                            context.clearRect(
                                0,
                                0,
                                width,
                                height
                            );


                            context.drawImage(
                                image,
                                0,
                                0,
                                width,
                                height
                            );


                            canvas.toBlob(
                                blob => {

                                    if (!blob) {

                                        reject(
                                            new Error(
                                                "Não foi possível gerar imagem."
                                            )
                                        );

                                        return;

                                    }


                                    const blobReader =
                                        new FileReader();


                                    blobReader.onload =
                                        () => {

                                            resolve(
                                                blobReader.result
                                            );

                                        };


                                    blobReader.onerror =
                                        () => reject(
                                            new Error(
                                                "Erro ao converter imagem."
                                            )
                                        );


                                    blobReader.readAsDataURL(
                                        blob
                                    );

                                },

                                "image/webp",

                                quality
                            );

                        };


                    image.src =
                        reader.result;

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =====================================================
   APLICAR LOGO
===================================================== */

function applyLogo() {

    const image =
        document.getElementById(
            "siteLogoImage"
        );


    const text =
        document.getElementById(
            "siteLogoText"
        );


    if (!image || !text) {

        return;

    }


    if (
        currentTheme.logoImage
    ) {

        image.src =
            currentTheme.logoImage;

        image.classList.remove(
            "hidden"
        );

        text.classList.add(
            "hidden"
        );

    } else {

        image.src = "";

        image.classList.add(
            "hidden"
        );

        text.classList.remove(
            "hidden"
        );

    }

}


/* =====================================================
   REMOVER LOGO
===================================================== */

function removeLogoImage() {

    if (!adminMode) {

        return;

    }


    currentTheme.logoImage =
        "";


    const input =
        document.getElementById(
            "themeLogoImage"
        );


    if (input) {

        input.value = "";

    }


    const name =
        document.getElementById(
            "themeLogoImageName"
        );


    if (name) {

        name.textContent =
            "Nenhuma imagem selecionada";

    }


    applyLogo();


    showToast(
        "Logo removida. Clique em Salvar tema."
    );

}


/* =====================================================
   NAVEGAÇÃO — HOME
===================================================== */

function showHome() {

    currentFolderId =
        null;


    const folderPage =
        document.getElementById(
            "folderPage"
        );


    const homePage =
        document.getElementById(
            "homePage"
        );


    if (folderPage) {

        folderPage.classList.add(
            "hidden"
        );

    }


    if (homePage) {

        homePage.classList.remove(
            "hidden"
        );

    }


    updateBackButton();

    loadFolders();

}


/* =====================================================
   MODAIS
===================================================== */

function closeModal(
    id
) {

    const modal =
        document.getElementById(
            id
        );


    if (!modal) {

        return;

    }


    modal.classList.add(
        "hidden"
    );

}


function toggleElement(
    id
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return;

    }


    element.classList.toggle(
        "hidden"
    );

}


/* =====================================================
   BOTÃO ATIVO
===================================================== */

function setActiveButton(
    selector,
    selected
) {

    document
        .querySelectorAll(
            selector
        )
        .forEach(
            button => {

                button.classList.remove(
                    "active"
                );

            }
        );


    if (selected) {

        selected.classList.add(
            "active"
        );

    }

}


/* =====================================================
   GRADIENTE DOS CARDS
===================================================== */

function createCardGradient(
    color
) {

    const first =
        normalizeColor(
            color
        );


    const second =
        darkenColor(
            first,
            45
        );


    return `
        linear-gradient(
            135deg,
            ${first},
            ${second}
        )
    `;

}


/* =====================================================
   ESCURECER COR
===================================================== */

function darkenColor(
    hex,
    amount
) {

    const clean =
        String(hex || "")
            .replace(
                "#",
                ""
            );


    if (
        clean.length !== 6
    ) {

        return "#333333";

    }


    let r =
        parseInt(
            clean.substring(
                0,
                2
            ),
            16
        );


    let g =
        parseInt(
            clean.substring(
                2,
                4
            ),
            16
        );


    let b =
        parseInt(
            clean.substring(
                4,
                6
            ),
            16
        );


    r =
        Math.max(
            0,
            r - amount
        );


    g =
        Math.max(
            0,
            g - amount
        );


    b =
        Math.max(
            0,
            b - amount
        );


    return (
        "#" +
        r.toString(16).padStart(2, "0") +
        g.toString(16).padStart(2, "0") +
        b.toString(16).padStart(2, "0")
    );

}


/* =====================================================
   NORMALIZAR COR
===================================================== */

function normalizeColor(
    color
) {

    const value =
        String(
            color || ""
        ).trim();


    if (
        /^#[0-9a-fA-F]{6}$/.test(
            value
        )
    ) {

        return value;

    }


    return "#4f7cff";

}


/* =====================================================
   NORMALIZAR URL
===================================================== */

function normalizeURL(
    url
) {

    let value =
        String(
            url || ""
        ).trim();


    if (!value) {

        return "";

    }


    if (
        /^https?:\/\//i.test(
            value
        )
    ) {

        return value;

    }


    return (
        "https://" +
        value
    );

}


/* =====================================================
   VALIDAR URL
===================================================== */

function isValidURL(
    url
) {

    try {

        const parsed =
            new URL(
                url
            );


        return (
            parsed.protocol === "http:" ||
            parsed.protocol === "https:"
        );

    } catch {

        return false;

    }

}


/* =====================================================
   HTML SEGURO
===================================================== */

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value ?? "";


    return div.innerHTML;

}


/* =====================================================
   INPUTS
===================================================== */

function setInput(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.value =
            value ?? "";

    }

}


function getInputValue(
    id,
    fallback
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return fallback;

    }


    return element.value;

}


/* =====================================================
   LOADING
===================================================== */

function showLoading(
    element
) {

    if (!element) {

        return;

    }


    element.innerHTML = `

        <div class="empty">

            <div class="empty-icon">
                ⏳
            </div>

            <h2>
                Carregando...
            </h2>

        </div>

    `;

}


/* =====================================================
   ERRO
===================================================== */

function showError(
    element,
    message
) {

    if (!element) {

        return;

    }


    element.innerHTML = `

        <div class="empty">

            <div class="empty-icon">
                ⚠️
            </div>

            <h2>
                Erro
            </h2>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>

    `;

}


/* =====================================================
   VAZIO
===================================================== */

function emptyHTML(
    icon,
    title,
    description
) {

    return `

        <div class="empty">

            <div class="empty-icon">
                ${icon}
            </div>

            <h2>
                ${escapeHTML(title)}
            </h2>

            <p>
                ${escapeHTML(description)}
            </p>

        </div>

    `;

}


/* =====================================================
   TOAST
===================================================== */

function showToast(
    message
) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {

        return;

    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2800
        );

}


/* =====================================================
   LABELS DE TEMA
===================================================== */

document.addEventListener(
    "input",
    event => {

        if (
            event.target.id ===
            "themeBorderWidth" ||

            event.target.id ===
            "themeFontScale"
        ) {

            updateRangeLabels();

        }

    }
);


/* =====================================================
   GRADIENTE
===================================================== */

document.addEventListener(
    "change",
    event => {

        if (
            event.target.id ===
            "themeGradientEnabled"
        ) {

            updateGradientControls();

        }

    }
);


/* =====================================================
   ACESSO GLOBAL
===================================================== */

window.siteApp = {

    reloadFolders:
        loadFolders,

    reloadTheme:
        loadTheme,

    openFolder:
        openFolder,

    openTheme:
        openThemeModal,

    logout:
        logoutAdmin,

    isAdmin:
        () => adminMode

};


/* =====================================================
   FIM
===================================================== */
