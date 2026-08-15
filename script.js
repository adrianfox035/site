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

    borderWidth: "2px",
    fontSize: "16px",

    titleSize: "28px",
    cardTitleSize: "20px",
    cardTextSize: "14px",

    cardRadius: "12px",

    gradientEnabled: true,
    gradientDirection: "135deg"

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
        background: "#eef7ff",
        topbar: "#ffffff",
        text: "#102a43",
        heading: "#063970",
        border: "#063970",
        button: "#1261a0",
        logo: "#063970"
    },

    {
        name: "Verde Natureza",
        background: "#effaf3",
        topbar: "#ffffff",
        text: "#173b28",
        heading: "#14532d",
        border: "#14532d",
        button: "#15803d",
        logo: "#14532d"
    },

    {
        name: "Roxo",
        background: "#f6f0ff",
        topbar: "#ffffff",
        text: "#32145f",
        heading: "#581c87",
        border: "#581c87",
        button: "#7e22ce",
        logo: "#581c87"
    },

    {
        name: "Amarelo",
        background: "#fffbea",
        topbar: "#ffffff",
        text: "#493600",
        heading: "#854d0e",
        border: "#854d0e",
        button: "#ca8a04",
        logo: "#854d0e"
    },

    {
        name: "Azul + Verde",
        background: "#effcfb",
        topbar: "#ffffff",
        text: "#123c45",
        heading: "#075985",
        border: "#075985",
        button: "#059669",
        logo: "#075985"
    },

    {
        name: "Rosa",
        background: "#fff1f5",
        topbar: "#ffffff",
        text: "#4a1728",
        heading: "#9d174d",
        border: "#9d174d",
        button: "#db2777",
        logo: "#9d174d"
    },

    {
        name: "Vermelho",
        background: "#fff4f4",
        topbar: "#ffffff",
        text: "#4c1515",
        heading: "#991b1b",
        border: "#991b1b",
        button: "#dc2626",
        logo: "#991b1b"
    },

    {
        name: "Laranja",
        background: "#fff7ed",
        topbar: "#ffffff",
        text: "#4a2508",
        heading: "#9a3412",
        border: "#9a3412",
        button: "#ea580c",
        logo: "#9a3412"
    },

    {
        name: "Ciano",
        background: "#ecfeff",
        topbar: "#ffffff",
        text: "#164e63",
        heading: "#155e75",
        border: "#155e75",
        button: "#0891b2",
        logo: "#155e75"
    },

    {
        name: "Índigo",
        background: "#eef2ff",
        topbar: "#ffffff",
        text: "#1e1b4b",
        heading: "#3730a3",
        border: "#3730a3",
        button: "#4f46e5",
        logo: "#3730a3"
    },

    {
        name: "Turquesa",
        background: "#ecfdf5",
        topbar: "#ffffff",
        text: "#134e4a",
        heading: "#115e59",
        border: "#115e59",
        button: "#0d9488",
        logo: "#115e59"
    },

    {
        name: "Lavanda",
        background: "#faf5ff",
        topbar: "#ffffff",
        text: "#3b0764",
        heading: "#6b21a8",
        border: "#6b21a8",
        button: "#9333ea",
        logo: "#6b21a8"
    },

    {
        name: "Verde Limão",
        background: "#f7fee7",
        topbar: "#ffffff",
        text: "#365314",
        heading: "#3f6212",
        border: "#3f6212",
        button: "#65a30d",
        logo: "#3f6212"
    },

    {
        name: "Dourado",
        background: "#fffbeb",
        topbar: "#ffffff",
        text: "#451a03",
        heading: "#92400e",
        border: "#92400e",
        button: "#d97706",
        logo: "#92400e"
    },

    {
        name: "Escuro",
        background: "#171717",
        topbar: "#262626",
        text: "#f5f5f5",
        heading: "#ffffff",
        border: "#ffffff",
        button: "#404040",
        logo: "#ffffff"
    }

];


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupAllEvents();

        initializeSite();

    }
);


async function initializeSite() {

    try {

        await loadTheme();

    } catch (error) {

        console.error(
            "Erro ao carregar tema:",
            error
        );

        applyTheme(
            defaultTheme
        );

    }


    try {

        await loadFolders();

    } catch (error) {

        console.error(
            "Erro ao carregar pastas:",
            error
        );

        showError(
            document.getElementById(
                "foldersGrid"
            ),
            "Não foi possível carregar as pastas."
        );

    }


    updateAdminInterface();

}


/* =====================================================
   EVENTOS
===================================================== */

function setupAllEvents() {

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

                if (
                    event.key === "Enter"
                ) {

                    loginAdmin();

                }

            }
        );

    }


    /* PASTA */

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


    /* LINKS */

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


    /* VOLTAR */

    on(
        "backButton",
        "click",
        showHome
    );


    /* ORGANIZAÇÃO */

    on(
        "organizeButton",
        "click",
        () => {

            toggleElement(
                "organizePanel"
            );

        }
    );


    on(
        "organizeLinksButton",
        "click",
        () => {

            toggleElement(
                "organizeLinksPanel"
            );

        }
    );


    /* ORDENAÇÃO DAS PASTAS */

    document
        .querySelectorAll(
            ".sort-option"
        )
        .forEach(
            button => {

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

            }
        );


    /* ORDENAÇÃO DOS LINKS */

    document
        .querySelectorAll(
            ".link-sort-option"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        linkSort =
                            button.dataset.sort;

                        setActiveButton(
                            ".link-sort-option",
                            button
                        );

                        renderLinks(
                            currentLinks
                        );

                    }
                );

            }
        );


    /* QUANTIDADE POR LINHA */

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


    /* LAYOUT */

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


    /* TEMA */

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


    /* LOGO */

    on(
        "logoImageInput",
        "change",
        handleLogoImage
    );


    /* CORES DOS CARDS */

    on(
        "folderColor",
        "input",
        event => {

            const value =
                event.target.value;

            const output =
                document.getElementById(
                    "folderColorValue"
                );

            if (output) {

                output.textContent =
                    value;

            }

        }
    );


    on(
        "linkColor",
        "input",
        event => {

            const value =
                event.target.value;

            const output =
                document.getElementById(
                    "linkColorValue"
                );

            if (output) {

                output.textContent =
                    value;

            }

        }
    );


    /* =================================================
       X DOS MODAIS
    ================================================= */

    document
        .querySelectorAll(
            ".modal-close"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        event.stopPropagation();

                        const modalId =
                            button.dataset.close;

                        closeModal(
                            modalId
                        );

                    }
                );

            }
        );


    /* CLICAR FORA DO MODAL */

    document
        .querySelectorAll(
            ".modal-overlay"
        )
        .forEach(
            overlay => {

                overlay.addEventListener(
                    "click",
                    event => {

                        if (
                            event.target ===
                            overlay
                        ) {

                            overlay.classList.add(
                                "hidden"
                            );

                        }

                    }
                );

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

        console.warn(
            `Elemento #${id} não encontrado.`
        );

        return;

    }


    element.addEventListener(
        event,
        callback
    );

}


/* =====================================================
   LOGO
===================================================== */

function handleLogoImage(
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


    const reader =
        new FileReader();


    reader.onload =
        () => {

            currentTheme.logoImage =
                reader.result;

            applyTheme(
                currentTheme
            );

        };


    reader.readAsDataURL(
        file
    );

}


/* =====================================================
   PASTAS
===================================================== */

async function loadFolders() {

    const grid =
        document.getElementById(
            "foldersGrid"
        );


    if (!grid) {

        return;

    }


    showLoading(
        grid
    );


    const result =
        await supabaseClient
            .from("folders")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


    if (result.error) {

        console.error(
            result.error
        );

        showError(
            grid,
            "Erro ao carregar as pastas."
        );

        return;

    }


    folders =
        result.data || [];


    await loadFolderLinkCounts();

    renderFolders();

}


/* =====================================================
   CONTAGEM DE LINKS
===================================================== */

async function loadFolderLinkCounts() {

    for (
        const folder
        of folders
    ) {

        const result =
            await supabaseClient
                .from("links")
                .select(
                    "id",
                    {
                        count: "exact",
                        head: true
                    }
                )
                .eq(
                    "folder_id",
                    folder.id
                );


        folder.linkCount =
            result.count || 0;

    }

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


    if (
        !folders.length
    ) {

        grid.innerHTML =
            emptyHTML(
                "📁",
                "Nenhuma pasta",
                "Crie a primeira pasta para começar."
            );

        return;

    }


    const list =
        sortFolders(
            [...folders]
        );


    grid.innerHTML = "";


    list.forEach(
        folder => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card";


            card.style.background =
                createGradient(
                    folder.color
                );


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
                            folder.linkCount || 0
                        }

                        ${
                            (folder.linkCount || 0) === 1
                                ? "link"
                                : "links"
                        }

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


                edit.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        openFolderModal(
                            folder
                        );

                    }
                );


                del.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        deleteFolder(
                            folder
                        );

                    }
                );

            }


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
   ORDENAÇÃO DAS PASTAS
===================================================== */

function sortFolders(
    list
) {

    switch (
        folderSort
    ) {

        case "oldest":

            return list.sort(
                (a, b) =>
                    new Date(a.created_at) -
                    new Date(b.created_at)
            );


        case "most-links":

            return list.sort(
                (a, b) =>
                    (b.linkCount || 0) -
                    (a.linkCount || 0)
            );


        case "least-links":

            return list.sort(
                (a, b) =>
                    (a.linkCount || 0) -
                    (b.linkCount || 0)
            );


        case "color":

            return list.sort(
                (a, b) =>
                    String(a.color)
                        .localeCompare(
                            String(b.color)
                        )
            );


        case "newest":

        default:

            return list.sort(
                (a, b) =>
                    new Date(b.created_at) -
                    new Date(a.created_at)
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
                item.id === folderId
        );


    if (!folder) {

        return;

    }


    currentFolderId =
        folderId;


    const folderTitle =
        document.getElementById(
            "folderTitle"
        );


    if (folderTitle) {

        folderTitle.textContent =
            `📁 ${folder.name}`;

    }


    document.getElementById(
        "homePage"
    ).classList.add(
        "hidden"
    );


    document.getElementById(
        "folderPage"
    ).classList.remove(
        "hidden"
    );


    await loadLinks(
        folderId
    );

}


/* =====================================================
   LINKS
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


    showLoading(
        grid
    );


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
                    ascending: true
                }
            );


    if (result.error) {

        console.error(
            result.error
        );

        showError(
            grid,
            "Erro ao carregar os links."
        );

        return;

    }


    currentLinks =
        result.data || [];


    renderLinks(
        currentLinks
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


    if (!links.length) {

        grid.innerHTML =
            emptyHTML(
                "🔗",
                "Nenhum link",
                "Adicione o primeiro link desta pasta."
            );

        return;

    }


    const list =
        sortLinks(
            [...links]
        );


    grid.innerHTML = "";


    list.forEach(
        link => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card";


            card.style.background =
                createGradient(
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
                        link.url,
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

                            event.stopPropagation();

                            deleteLink(
                                link
                            );

                        }
                    );

                }

            }


            grid.appendChild(
                card
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
   ORDENAÇÃO LINKS
===================================================== */

function sortLinks(
    list
) {

    switch (
        linkSort
    ) {

        case "oldest":

            return list.sort(
                (a, b) =>
                    new Date(a.created_at) -
                    new Date(b.created_at)
            );


        case "color":

            return list.sort(
                (a, b) =>
                    String(a.color)
                        .localeCompare(
                            String(b.color)
                        )
            );


        case "newest":

        default:

            return list.sort(
                (a, b) =>
                    new Date(b.created_at) -
                    new Date(a.created_at)
            );

    }

}


/* =====================================================
   LAYOUT
===================================================== */

/*
   IMPORTANTE:

   O CSS deve impedir que os cards sejam esticados.

   O JavaScript apenas informa a quantidade
   desejada de itens por linha através de
   --columns.

   O CSS será responsável por manter o tamanho
   natural dos cards e alinhá-los à esquerda.
*/

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


    grid.classList.toggle(
        "fixed-grid",
        layout === "grid"
    );

}


/* =====================================================
   ALTERAR LAYOUT DAS PASTAS
===================================================== */

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


/* =====================================================
   ALTERAR LAYOUT DOS LINKS
===================================================== */

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
   ADMIN
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


    const passwordInput =
        document.getElementById(
            "adminPassword"
        );


    if (passwordInput) {

        passwordInput.value = "";

    }


    const error =
        document.getElementById(
            "adminError"
        );


    if (error) {

        error.textContent = "";

    }


    setTimeout(
        () => {

            if (passwordInput) {

                passwordInput.focus();

            }

        },
        50
    );

}


/* =====================================================
   LOGIN ADMIN
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
            "Erro administrativo:",
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

        renderLinks(
            currentLinks
        );

    }


    showToast(
        "Modo administrador ativado."
    );

}


/* =====================================================
   LOGOUT
===================================================== */

function logoutAdmin() {

    adminMode =
        false;


    adminPassword =
        "";


    updateAdminInterface();


    renderFolders();


    if (currentFolderId) {

        renderLinks(
            currentLinks
        );

    }


    showToast(
        "Modo administrador encerrado."
    );

}


/* =====================================================
   INTERFACE ADMIN
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
   MODAL PASTA
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


    if (title) {

        title.textContent =
            folder
                ? "✏️ Editar pasta"
                : "📁 Nova pasta";

    }


    const name =
        document.getElementById(
            "folderName"
        );


    if (name) {

        name.value =
            folder
                ? folder.name
                : "";

    }


    const color =
        document.getElementById(
            "folderColor"
        );


    const colorValue =
        document.getElementById(
            "folderColorValue"
        );


    const selectedColor =
        folder
            ? folder.color
            : "#4f7cff";


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

    const name =
        document.getElementById(
            "folderName"
        )?.value.trim();


    const color =
        document.getElementById(
            "folderColor"
        )?.value;


    if (!name) {

        showToast(
            "Digite um nome para a pasta."
        );

        return;

    }


    let result;


    if (editingFolderId) {

        if (!adminMode) {

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

        result =
            await supabaseClient
                .from("folders")
                .insert({
                    name,
                    color
                });

    }


    if (result.error) {

        console.error(
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


    showToast(
        "Pasta salva."
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


    const confirmed =
        confirm(
            `Excluir "${folder.name}" e todos os links dentro dela?`
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
            result.error
        );

        showToast(
            "Erro ao excluir a pasta."
        );

        return;

    }


    await loadFolders();


    if (
        currentFolderId ===
        folder.id
    ) {

        showHome();

    }


    showToast(
        "Pasta excluída."
    );

}


/* =====================================================
   MODAL LINK
===================================================== */

function openLinkModal(
    link = null
) {

    editingLinkId =
        link
            ? link.id
            : null;


    const title =
        document.getElementById(
            "linkModalTitle"
        );


    if (title) {

        title.textContent =
            link
                ? "✏️ Editar link"
                : "🔗 Novo link";

    }


    const name =
        document.getElementById(
            "linkName"
        );


    if (name) {

        name.value =
            link
                ? link.name
                : "";

    }


    const url =
        document.getElementById(
            "linkUrl"
        );


    if (url) {

        url.value =
            link
                ? link.url
                : "";

    }


    const color =
        document.getElementById(
            "linkColor"
        );


    const colorValue =
        document.getElementById(
            "linkColorValue"
        );


    const selectedColor =
        link
            ? link.color
            : "#00a884";


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

    const name =
        document.getElementById(
            "linkName"
        )?.value.trim();


    let url =
        document.getElementById(
            "linkUrl"
        )?.value.trim();


    const color =
        document.getElementById(
            "linkColor"
        )?.value;


    if (
        !name ||
        !url
    ) {

        showToast(
            "Preencha o nome e o link."
        );

        return;

    }


    if (
        !url.startsWith(
            "http://"
        ) &&
        !url.startsWith(
            "https://"
        )
    ) {

        url =
            "https://" +
            url;

    }


    let result;


    if (editingLinkId) {

        if (!adminMode) {

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
   TEMA
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


    if (
        result.error ||
        !result.data
    ) {

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
   APLICAR TEMA
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
        currentTheme.borderWidth ||
        "2px"
    );


    root.style.setProperty(
        "--font-size",
        currentTheme.fontSize ||
        "16px"
    );


    root.style.setProperty(
        "--title-size",
        currentTheme.titleSize ||
        "28px"
    );


    root.style.setProperty(
        "--card-title-size",
        currentTheme.cardTitleSize ||
        "20px"
    );


    root.style.setProperty(
        "--card-text-size",
        currentTheme.cardTextSize ||
        "14px"
    );


    root.style.setProperty(
        "--card-radius",
        currentTheme.cardRadius ||
        "12px"
    );


    /*
       Imagem da logo
    */

    const logoImage =
        document.getElementById(
            "logoImage"
        );


    const logoText =
        document.getElementById(
            "logoText"
        );


    if (
        logoImage &&
        currentTheme.logoImage
    ) {

        logoImage.src =
            currentTheme.logoImage;

        logoImage.classList.remove(
            "hidden"
        );


        if (logoText) {

            logoText.classList.add(
                "hidden"
            );

        }

    } else {

        if (logoImage) {

            logoImage.classList.add(
                "hidden"
            );

        }


        if (logoText) {

            logoText.classList.remove(
                "hidden"
            );

        }

    }

}


/* =====================================================
   ABRIR TEMA
===================================================== */

function openThemeModal() {

    if (!adminMode) {

        showToast(
            "Apenas o administrador pode alterar o tema."
        );

        return;

    }


    const modal =
        document.getElementById(
            "themeModal"
        );


    if (!modal) {

        return;

    }


    /*
       Cores
    */

    setColorInput(
        "themeBackground",
        currentTheme.background
    );


    setColorInput(
        "themeTopbar",
        currentTheme.topbar
    );


    setColorInput(
        "themeText",
        currentTheme.text
    );


    setColorInput(
        "themeHeading",
        currentTheme.heading
    );


    setColorInput(
        "themeBorder",
        currentTheme.border
    );


    setColorInput(
        "themeButtonColor",
        currentTheme.button
    );


    setColorInput(
        "themeLogo",
        currentTheme.logo
    );


    /*
       Espessura das bordas
    */

    const borderWidth =
        document.getElementById(
            "themeBorderWidth"
        );


    if (borderWidth) {

        borderWidth.value =
            parseInt(
                currentTheme.borderWidth ||
                "2"
            );

    }


    /*
       Tamanho da fonte
    */

    const fontSize =
        document.getElementById(
            "themeFontSize"
        );


    if (fontSize) {

        fontSize.value =
            parseInt(
                currentTheme.fontSize ||
                "16"
            );

    }


    /*
       Tamanho do título
    */

    const titleSize =
        document.getElementById(
            "themeTitleSize"
        );


    if (titleSize) {

        titleSize.value =
            parseInt(
                currentTheme.titleSize ||
                "28"
            );

    }


    /*
       Tamanho do texto dos cards
    */

    const cardTextSize =
        document.getElementById(
            "themeCardTextSize"
        );


    if (cardTextSize) {

        cardTextSize.value =
            parseInt(
                currentTheme.cardTextSize ||
                "14"
            );

    }


    /*
       Arredondamento
    */

    const radius =
        document.getElementById(
            "themeCardRadius"
        );


    if (radius) {

        radius.value =
            parseInt(
                currentTheme.cardRadius ||
                "12"
            );

    }


    /*
       Gradiente
    */

    const gradient =
        document.getElementById(
            "themeGradient"
        );


    if (gradient) {

        gradient.checked =
            currentTheme.gradientEnabled !== false;

    }


    /*
       Direção do gradiente
    */

    const direction =
        document.getElementById(
            "themeGradientDirection"
        );


    if (direction) {

        direction.value =
            currentTheme.gradientDirection ||
            "135deg";

    }


    /*
       Abre modal
    */

    modal.classList.remove(
        "hidden"
    );

}


/* =====================================================
   AUXILIAR — INPUT DE COR
===================================================== */

function setColorInput(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.value =
            value ||
            "#000000";

    }

}


/* =====================================================
   SALVAR TEMA NA NUVEM
===================================================== */

async function saveTheme() {

    if (!adminMode) {

        return;

    }


    const theme = {

        background:
            getInputValue(
                "themeBackground",
                defaultTheme.background
            ),

        topbar:
            getInputValue(
                "themeTopbar",
                defaultTheme.topbar
            ),

        text:
            getInputValue(
                "themeText",
                defaultTheme.text
            ),

        heading:
            getInputValue(
                "themeHeading",
                defaultTheme.heading
            ),

        border:
            getInputValue(
                "themeBorder",
                defaultTheme.border
            ),

        button:
            getInputValue(
                "themeButtonColor",
                defaultTheme.button
            ),

        logo:
            getInputValue(
                "themeLogo",
                defaultTheme.logo
            ),


        /*
           Novas configurações
        */

        borderWidth:
            getNumberInput(
                "themeBorderWidth",
                2
            ) + "px",


        fontSize:
            getNumberInput(
                "themeFontSize",
                16
            ) + "px",


        titleSize:
            getNumberInput(
                "themeTitleSize",
                28
            ) + "px",


        cardTextSize:
            getNumberInput(
                "themeCardTextSize",
                14
            ) + "px",


        cardRadius:
            getNumberInput(
                "themeCardRadius",
                12
            ) + "px",


        gradientEnabled:
            document.getElementById(
                "themeGradient"
            )?.checked !== false,


        gradientDirection:
            getInputValue(
                "themeGradientDirection",
                "135deg"
            ),


        /*
           Mantém a imagem da logo
        */

        logoImage:
            currentTheme.logoImage ||
            null

    };


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


    applyTheme(
        theme
    );


    closeModal(
        "themeModal"
    );


    showToast(
        "Tema salvo na nuvem! ☁️"
    );

}


/* =====================================================
   AUXILIARES DE INPUT
===================================================== */

function getInputValue(
    id,
    fallback
) {

    const element =
        document.getElementById(
            id
        );


    if (
        !element ||
        !element.value
    ) {

        return fallback;

    }


    return element.value;

}


function getNumberInput(
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


    const value =
        Number(
            element.value
        );


    if (
        !Number.isFinite(
            value
        )
    ) {

        return fallback;

    }


    return value;

}


/* =====================================================
   RESTAURAR TEMA
===================================================== */

function resetTheme() {

    if (!adminMode) {

        return;

    }


    /*
       Cores
    */

    setColorInput(
        "themeBackground",
        defaultTheme.background
    );


    setColorInput(
        "themeTopbar",
        defaultTheme.topbar
    );


    setColorInput(
        "themeText",
        defaultTheme.text
    );


    setColorInput(
        "themeHeading",
        defaultTheme.heading
    );


    setColorInput(
        "themeBorder",
        defaultTheme.border
    );


    setColorInput(
        "themeButtonColor",
        defaultTheme.button
    );


    setColorInput(
        "themeLogo",
        defaultTheme.logo
    );


    /*
       Tamanhos
    */

    setInputValue(
        "themeBorderWidth",
        parseInt(
            defaultTheme.borderWidth
        )
    );


    setInputValue(
        "themeFontSize",
        parseInt(
            defaultTheme.fontSize
        )
    );


    setInputValue(
        "themeTitleSize",
        parseInt(
            defaultTheme.titleSize
        )
    );


    setInputValue(
        "themeCardTextSize",
        parseInt(
            defaultTheme.cardTextSize
        )
    );


    setInputValue(
        "themeCardRadius",
        parseInt(
            defaultTheme.cardRadius
        )
    );


    /*
       Gradiente
    */

    const gradient =
        document.getElementById(
            "themeGradient"
        );


    if (gradient) {

        gradient.checked =
            defaultTheme.gradientEnabled;

    }


    setInputValue(
        "themeGradientDirection",
        defaultTheme.gradientDirection
    );


    /*
       Remove logo personalizada
    */

    currentTheme.logoImage =
        null;


    showToast(
        "Tema restaurado. Clique em salvar para aplicar."
    );

}


/* =====================================================
   APLICAR TEMA PRONTO
===================================================== */

function applyPresetTheme(
    index
) {

    if (!adminMode) {

        return;

    }


    const preset =
        presetThemes[index];


    if (!preset) {

        return;

    }


    currentTheme = {

        ...currentTheme,

        ...preset

    };


    /*
       Atualiza os inputs
    */

    setColorInput(
        "themeBackground",
        preset.background
    );


    setColorInput(
        "themeTopbar",
        preset.topbar
    );


    setColorInput(
        "themeText",
        preset.text
    );


    setColorInput(
        "themeHeading",
        preset.heading
    );


    setColorInput(
        "themeBorder",
        preset.border
    );


    setColorInput(
        "themeButtonColor",
        preset.button
    );


    setColorInput(
        "themeLogo",
        preset.logo
    );


    /*
       Aplica imediatamente apenas visualmente.
       Ainda será necessário clicar em salvar.
    */

    applyTheme(
        currentTheme
    );


    showToast(
        `Tema "${preset.name}" selecionado.`
    );

}


/* =====================================================
   CRIAR LISTA DE TEMAS
===================================================== */

function renderPresetThemes() {

    const container =
        document.getElementById(
            "presetThemes"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    presetThemes.forEach(
        (theme, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "preset-theme";


            button.title =
                theme.name;


            button.style.background =
                `linear-gradient(
                    135deg,
                    ${theme.background},
                    ${theme.button}
                )`;


            button.innerHTML = `

                <span
                    class="preset-theme-preview"
                    style="
                        background:
                        linear-gradient(
                            135deg,
                            ${theme.button},
                            ${theme.logo}
                        );
                    "
                ></span>

                <span>
                    ${escapeHTML(theme.name)}
                </span>

            `;


            button.addEventListener(
                "click",
                () => {

                    applyPresetTheme(
                        index
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
   GRADIENTE DOS CARDS
===================================================== */

function createGradient(
    color
) {

    /*
       Se o gradiente estiver desativado,
       retorna somente a cor.
    */

    if (
        currentTheme.gradientEnabled ===
        false
    ) {

        return color;

    }


    const direction =
        currentTheme.gradientDirection ||
        "135deg";


    return `
        linear-gradient(
            ${direction},
            ${color},
            ${darkenColor(
                color,
                55
            )}
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

    let clean =
        String(hex)
            .replace(
                "#",
                ""
            );


    /*
       Suporte para cores no formato
       RGB simples ou HEX inválido.
    */

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


    if (
        Number.isNaN(r) ||
        Number.isNaN(g) ||
        Number.isNaN(b)
    ) {

        return "#333333";

    }


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
        r.toString(
            16
        ).padStart(
            2,
            "0"
        ) +

        g.toString(
            16
        ).padStart(
            2,
            "0"
        ) +

        b.toString(
            16
        ).padStart(
            2,
            "0"
        )
    );

}


/* =====================================================
   PEQUENO AJUSTE DE COR
===================================================== */

function lightenColor(
    hex,
    amount
) {

    let clean =
        String(hex)
            .replace(
                "#",
                ""
            );


    if (
        clean.length !== 6
    ) {

        return "#ffffff";

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
        Math.min(
            255,
            r + amount
        );


    g =
        Math.min(
            255,
            g + amount
        );


    b =
        Math.min(
            255,
            b + amount
        );


    return (
        "#" +
        r.toString(16).padStart(2, "0") +
        g.toString(16).padStart(2, "0") +
        b.toString(16).padStart(2, "0")
    );

}

/* =====================================================
   LOGO — IMAGEM
===================================================== */

function setupLogoUpload() {

    const input =
        document.getElementById(
            "logoImageInput"
        );


    if (!input) {

        return;

    }


    input.addEventListener(
        "change",
        event => {

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


            /*
               Limite de aproximadamente 2 MB.
            */

            if (
                file.size >
                2 * 1024 * 1024
            ) {

                showToast(
                    "A imagem deve ter no máximo 2 MB."
                );

                input.value = "";

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                event => {

                    const image =
                        event.target.result;


                    /*
                       A imagem é salva como
                       Base64 dentro do tema.
                    */

                    currentTheme.logoImage =
                        image;


                    const preview =
                        document.getElementById(
                            "logoPreview"
                        );


                    if (preview) {

                        preview.src =
                            image;

                        preview.classList.remove(
                            "hidden"
                        );

                    }


                    const logo =
                        document.getElementById(
                            "logoImage"
                        );


                    if (logo) {

                        logo.src =
                            image;

                        logo.classList.remove(
                            "hidden"
                        );

                    }


                    const logoText =
                        document.getElementById(
                            "logoText"
                        );


                    if (logoText) {

                        logoText.classList.add(
                            "hidden"
                        );

                    }


                    showToast(
                        "Logo carregada. Clique em salvar tema."
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =====================================================
   REMOVER LOGO
===================================================== */

function removeLogo() {

    if (!adminMode) {

        return;

    }


    currentTheme.logoImage =
        null;


    const input =
        document.getElementById(
            "logoImageInput"
        );


    if (input) {

        input.value = "";

    }


    const preview =
        document.getElementById(
            "logoPreview"
        );


    if (preview) {

        preview.src = "";

        preview.classList.add(
            "hidden"
        );

    }


    const logo =
        document.getElementById(
            "logoImage"
        );


    if (logo) {

        logo.src = "";

        logo.classList.add(
            "hidden"
        );

    }


    const logoText =
        document.getElementById(
            "logoText"
        );


    if (logoText) {

        logoText.classList.remove(
            "hidden"
        );

    }


    showToast(
        "Logo removida. Clique em salvar tema."
    );

}


/* =====================================================
   SALVAR LOGO NO TEMA
===================================================== */

function saveLogoToTheme() {

    if (!adminMode) {

        return;

    }


    /*
       Não salva diretamente.
       A logo será enviada junto com
       admin_save_theme().
    */

    showToast(
        "Logo pronta para ser salva."
    );

}


/* =====================================================
   PRESETS DE CORES
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

        gradientDirection: "135deg"

    }

];


/* =====================================================
   SELETORES DE PRESET
===================================================== */

function setupPresetThemes() {

    renderPresetThemes();

}


/* =====================================================
   BOTÕES DE TAMANHO
===================================================== */

function setupThemeControls() {

    const controls = [

        "themeBorderWidth",

        "themeFontSize",

        "themeTitleSize",

        "themeCardTextSize",

        "themeCardRadius"

    ];


    controls.forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );


            if (!element) {

                return;

            }


            element.addEventListener(
                "input",
                () => {

                    /*
                       Pré-visualização em tempo real.
                    */

                    const previewTheme = {

                        ...currentTheme,

                        borderWidth:
                            getNumberInput(
                                "themeBorderWidth",
                                2
                            ) + "px",

                        fontSize:
                            getNumberInput(
                                "themeFontSize",
                                16
                            ) + "px",

                        titleSize:
                            getNumberInput(
                                "themeTitleSize",
                                28
                            ) + "px",

                        cardTextSize:
                            getNumberInput(
                                "themeCardTextSize",
                                14
                            ) + "px",

                        cardRadius:
                            getNumberInput(
                                "themeCardRadius",
                                12
                            ) + "px"

                    };


                    applyTheme(
                        previewTheme
                    );

                }
            );

        }
    );

}


/* =====================================================
   VALORES DE ENTRADA
===================================================== */

function setInputValue(
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


/* =====================================================
   ATUALIZAÇÃO DO TÍTULO
===================================================== */

function updatePageTitle() {

    const title =
        document.getElementById(
            "pageTitle"
        );


    if (!title) {

        return;

    }


    /*
       O HTML pode definir
       data-default-title.
    */

    const defaultTitle =
        title.dataset.defaultTitle ||
        "Minha Página";


    /*
       Mantém o título existente.
    */

    if (
        !title.textContent.trim()
    ) {

        title.textContent =
            defaultTitle;

    }

}


/* =====================================================
   EVENTOS EXTRAS
===================================================== */

function setupExtraEvents() {

    setupLogoUpload();

    setupPresetThemes();

    setupThemeControls();

    updatePageTitle();


    /*
       Botão remover logo
    */

    on(
        "removeLogoButton",
        "click",
        removeLogo
    );


    /*
       Botão salvar logo
    */

    on(
        "saveLogoButton",
        "click",
        saveLogoToTheme
    );


    /*
       Gradiente
    */

    on(
        "themeGradient",
        "change",
        event => {

            const previewTheme = {

                ...currentTheme,

                gradientEnabled:
                    event.target.checked

            };


            applyTheme(
                previewTheme
            );

        }
    );


    /*
       Direção do gradiente
    */

    on(
        "themeGradientDirection",
        "change",
        event => {

            const previewTheme = {

                ...currentTheme,

                gradientDirection:
                    event.target.value

            };


            applyTheme(
                previewTheme
            );

        }
    );

}


/* =====================================================
   GARANTIR EXECUÇÃO DOS EVENTOS EXTRAS
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupExtraEvents();

    }
);


/* =====================================================
   MELHORAR X DOS MODAIS
===================================================== */

function setupModalCloseButtons() {

    document
        .querySelectorAll(
            "[data-close]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        event.stopPropagation();


                        const target =
                            button.dataset.close;


                        closeModal(
                            target
                        );

                    }
                );

            }
        );

}


/* =====================================================
   ESC PARA FECHAR MODAL
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        document
            .querySelectorAll(
                ".modal-overlay:not(.hidden)"
            )
            .forEach(
                modal => {

                    modal.classList.add(
                        "hidden"
                    );

                }
            );

    }
);


/* =====================================================
   CORREÇÃO DE LINKS
===================================================== */

function normalizeURL(
    url
) {

    url =
        String(
            url || ""
        ).trim();


    if (!url) {

        return "";

    }


    /*
       Aceita HTTP e HTTPS.
    */

    if (
        /^https?:\/\//i.test(
            url
        )
    ) {

        return url;

    }


    /*
       Adiciona HTTPS.
    */

    return (
        "https://" +
        url
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
                normalizeURL(
                    url
                )
            );


        return (
            parsed.protocol ===
                "http:" ||

            parsed.protocol ===
                "https:"
        );

    } catch {

        return false;

    }

}


/* =====================================================
   EXPORTAR ALGUMAS FUNÇÕES
   PARA DEBUG NO CONSOLE
===================================================== */

window.siteApp = {

    reloadFolders:
        loadFolders,

    reloadTheme:
        loadTheme,

    applyTheme:
        applyTheme,

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
   FIM DO SCRIPT
===================================================== */
