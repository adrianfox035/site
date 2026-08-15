/* =====================================================
   SUPABASE
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

let currentAdminPassword = "";

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

    logo: "#111111"

};


/* =====================================================
   ELEMENTOS
===================================================== */

const homePage =
    document.getElementById("homePage");

const folderPage =
    document.getElementById("folderPage");

const foldersGrid =
    document.getElementById("foldersGrid");

const linksGrid =
    document.getElementById("linksGrid");

const adminButton =
    document.getElementById("adminButton");

const logoutButton =
    document.getElementById("logoutButton");

const themeButton =
    document.getElementById("themeButton");

const themeButtonLinks =
    document.getElementById("themeButtonLinks");


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initialize
);


async function initialize() {

    setupEvents();

    await loadTheme();

    await loadFolders();

    updateAdminInterface();

}


/* =====================================================
   EVENTOS
===================================================== */

function setupEvents() {

    /* ADMIN */

    adminButton.addEventListener(
        "click",
        openAdminModal
    );


    logoutButton.addEventListener(
        "click",
        logoutAdmin
    );


    document
        .getElementById("confirmAdminButton")
        .addEventListener(
            "click",
            loginAdmin
        );


    document
        .getElementById("adminPassword")
        .addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    loginAdmin();

                }

            }
        );


    /* PASTA */

    document
        .getElementById("addFolderButton")
        .addEventListener(
            "click",
            () => openFolderModal()
        );


    document
        .getElementById("saveFolderButton")
        .addEventListener(
            "click",
            saveFolder
        );


    /* LINK */

    document
        .getElementById("addLinkButton")
        .addEventListener(
            "click",
            () => openLinkModal()
        );


    document
        .getElementById("saveLinkButton")
        .addEventListener(
            "click",
            saveLink
        );


    /* NAVEGAÇÃO */

    document
        .getElementById("backButton")
        .addEventListener(
            "click",
            showHome
        );


    /* ORGANIZAÇÃO */

    document
        .getElementById("organizeButton")
        .addEventListener(
            () => togglePanel(
                "organizePanel"
            )
        );


    document
        .getElementById("organizeLinksButton")
        .addEventListener(
            () => togglePanel(
                "organizeLinksPanel"
            )
        );


    document
        .querySelectorAll(".sort-option")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    folderSort =
                        button.dataset.sort;

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

                    renderLinks(
                        currentLinks
                    );

                }
            );

        });


    document
        .getElementById("itemsPerRow")
        .addEventListener(
            "change",
            event => {

                foldersPerRow =
                    Number(
                        event.target.value
                    );

                applyGrid(
                    foldersGrid,
                    foldersPerRow,
                    folderLayout
                );

            }
        );


    document
        .getElementById("linksPerRow")
        .addEventListener(
            "change",
            event => {

                linksPerRow =
                    Number(
                        event.target.value
                    );

                applyGrid(
                    linksGrid,
                    linksPerRow,
                    linkLayout
                );

            }
        );


    document
        .getElementById("layoutToggle")
        .addEventListener(
            toggleFolderLayout
        );


    document
        .getElementById("linkLayoutToggle")
        .addEventListener(
            toggleLinkLayout
        );


    /* TEMA */

    themeButton.addEventListener(
        "click",
        openThemeModal
    );


    themeButtonLinks.addEventListener(
        "click",
        openThemeModal
    );


    document
        .getElementById("saveThemeButton")
        .addEventListener(
            saveTheme
        );


    document
        .getElementById("resetThemeButton")
        .addEventListener(
            resetTheme
        );


    /* CORES */

    document
        .getElementById("folderColor")
        .addEventListener(
            "input",
            event => {

                document
                    .getElementById(
                        "folderColorValue"
                    )
                    .textContent =
                        event.target.value;

            }
        );


    document
        .getElementById("linkColor")
        .addEventListener(
            "input",
            event => {

                document
                    .getElementById(
                        "linkColorValue"
                    )
                    .textContent =
                        event.target.value;

            }
        );


    /* FECHAR MODAIS */

    document
        .querySelectorAll("[data-close]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

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

}


/* =====================================================
   PASTAS
===================================================== */

async function loadFolders() {

    showLoading(
        foldersGrid
    );


    const {
        data,
        error
    } =
        await supabaseClient
            .from("folders")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "Erro ao carregar pastas:",
            error
        );

        showError(
            foldersGrid,
            "Erro ao carregar as pastas."
        );

        return;

    }


    folders = data || [];


    await addLinkCounts();


    renderFolders();

}


async function addLinkCounts() {

    for (
        const folder
        of folders
    ) {

        const {
            count
        } =
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
            count || 0;

    }

}


/* =====================================================
   RENDERIZAR PASTAS
===================================================== */

function renderFolders() {

    if (!folders.length) {

        foldersGrid.innerHTML =
            emptyHTML(
                "📁",
                "Nenhuma pasta",
                "Crie a primeira pasta para começar."
            );

        return;

    }


    let list =
        [...folders];


    list =
        sortFolders(list);


    foldersGrid.innerHTML = "";


    list.forEach(
        folder => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card";


            card.style.background =
                makeGradient(
                    folder.color
                );


            const actions =
                adminMode
                    ? `

                        <div class="card-actions">

                            <button
                                class="card-action"
                                data-action="edit"
                                title="Editar"
                            >
                                ✏️
                            </button>

                            <button
                                class="card-action delete"
                                data-action="delete"
                                title="Excluir"
                            >
                                🗑️
                            </button>

                        </div>

                    `
                    : "";


            card.innerHTML = `

                ${actions}

                <div>

                    <div class="card-name">
                        📁 ${escapeHTML(folder.name)}
                    </div>

                    <div class="card-description">
                        ${folder.linkCount || 0}
                        ${(folder.linkCount || 0) === 1 ? "link" : "links"}
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

                card
                    .querySelector(
                        '[data-action="edit"]'
                    )
                    .addEventListener(
                        "click",
                        event => {

                            event.stopPropagation();

                            openFolderModal(
                                folder
                            );

                        }
                    );


                card
                    .querySelector(
                        '[data-action="delete"]'
                    )
                    .addEventListener(
                        "click",
                        event => {

                            event.stopPropagation();

                            deleteFolder(
                                folder
                            );

                        }
                    );

            }


            foldersGrid.appendChild(
                card
            );

        }
    );


    applyGrid(
        foldersGrid,
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

    if (
        folderSort === "newest"
    ) {

        return list.sort(
            (a, b) =>
                new Date(b.created_at) -
                new Date(a.created_at)
        );

    }


    if (
        folderSort === "oldest"
    ) {

        return list.sort(
            (a, b) =>
                new Date(a.created_at) -
                new Date(b.created_at)
        );

    }


    if (
        folderSort === "most-links"
    ) {

        return list.sort(
            (a, b) =>
                (b.linkCount || 0) -
                (a.linkCount || 0)
        );

    }


    if (
        folderSort === "least-links"
    ) {

        return list.sort(
            (a, b) =>
                (a.linkCount || 0) -
                (b.linkCount || 0)
        );

    }


    if (
        folderSort === "color"
    ) {

        return list.sort(
            (a, b) =>
                a.color.localeCompare(
                    b.color
                )
        );

    }


    return list;

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


    document
        .getElementById(
            "folderTitle"
        )
        .textContent =
            `📁 ${folder.name}`;


    homePage.classList.add(
        "hidden"
    );


    folderPage.classList.remove(
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

    showLoading(
        linksGrid
    );


    const {
        data,
        error
    } =
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


    if (error) {

        console.error(
            "Erro ao carregar links:",
            error
        );

        showError(
            linksGrid,
            "Erro ao carregar os links."
        );

        return;

    }


    currentLinks =
        data || [];


    renderLinks(
        currentLinks
    );

}


function renderLinks(
    links
) {

    if (!links.length) {

        linksGrid.innerHTML =
            emptyHTML(
                "🔗",
                "Nenhum link",
                "Adicione o primeiro link desta pasta."
            );

        return;

    }


    let list =
        [...links];


    list =
        sortLinks(list);


    linksGrid.innerHTML = "";


    list.forEach(
        link => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card";


            card.style.background =
                makeGradient(
                    link.color
                );


            const actions =
                adminMode
                    ? `

                        <div class="card-actions">

                            <button
                                class="card-action"
                                data-action="edit"
                            >
                                ✏️
                            </button>

                            <button
                                class="card-action delete"
                                data-action="delete"
                            >
                                🗑️
                            </button>

                        </div>

                    `
                    : "";


            card.innerHTML = `

                ${actions}

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

                card
                    .querySelector(
                        '[data-action="edit"]'
                    )
                    .addEventListener(
                        "click",
                        event => {

                            event.stopPropagation();

                            openLinkModal(
                                link
                            );

                        }
                    );


                card
                    .querySelector(
                        '[data-action="delete"]'
                    )
                    .addEventListener(
                        "click",
                        event => {

                            event.stopPropagation();

                            deleteLink(
                                link
                            );

                        }
                    );

            }


            linksGrid.appendChild(
                card
            );

        }
    );


    applyGrid(
        linksGrid,
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

    if (
        linkSort === "newest"
    ) {

        return list.sort(
            (a, b) =>
                new Date(b.created_at) -
                new Date(a.created_at)
        );

    }


    if (
        linkSort === "oldest"
    ) {

        return list.sort(
            (a, b) =>
                new Date(a.created_at) -
                new Date(b.created_at)
        );

    }


    if (
        linkSort === "color"
    ) {

        return list.sort(
            (a, b) =>
                a.color.localeCompare(
                    b.color
                )
        );

    }


    return list;

}


/* =====================================================
   GRID / LISTA
===================================================== */

function applyGrid(
    element,
    columns,
    layout
) {

    element.style.setProperty(
        "--columns",
        columns
    );


    if (
        layout === "vertical"
    ) {

        element.classList.add(
            "vertical"
        );

    } else {

        element.classList.remove(
            "vertical"
        );

    }

}


function toggleFolderLayout() {

    folderLayout =
        folderLayout === "grid"
            ? "vertical"
            : "grid";


    document
        .getElementById(
            "layoutToggle"
        )
        .textContent =
            folderLayout === "grid"
                ? "⬜ Grade"
                : "☰ Lista";


    applyGrid(
        foldersGrid,
        foldersPerRow,
        folderLayout
    );

}


function toggleLinkLayout() {

    linkLayout =
        linkLayout === "grid"
            ? "vertical"
            : "grid";


    document
        .getElementById(
            "linkLayoutToggle"
        )
        .textContent =
            linkLayout === "grid"
                ? "⬜ Grade"
                : "☰ Lista";


    applyGrid(
        linksGrid,
        linksPerRow,
        linkLayout
    );

}


/* =====================================================
   ADMIN
===================================================== */

function openAdminModal() {

    document
        .getElementById(
            "adminModal"
        )
        .classList.remove(
            "hidden"
        );


    document
        .getElementById(
            "adminPassword"
        )
        .value = "";


    document
        .getElementById(
            "adminError"
        )
        .textContent = "";


    setTimeout(
        () => {

            document
                .getElementById(
                    "adminPassword"
                )
                .focus();

        },
        50
    );

}


async function loginAdmin() {

    const password =
        document
            .getElementById(
                "adminPassword"
            )
            .value
            .trim();


    if (!password) {

        document
            .getElementById(
                "adminError"
            )
            .textContent =
                "Digite a senha.";

        return;

    }


    const {
        data,
        error
    } =
        await supabaseClient.rpc(
            "check_admin_password",
            {
                p_password:
                    password
            }
        );


    if (error) {

        console.error(
            "Erro no login:",
            error
        );


        document
            .getElementById(
                "adminError"
            )
            .textContent =
                "Erro ao verificar a senha.";

        return;

    }


    if (data !== true) {

        document
            .getElementById(
                "adminError"
            )
            .textContent =
                "Senha incorreta.";

        return;

    }


    adminMode =
        true;

    currentAdminPassword =
        password;


    closeModal(
        "adminModal"
    );


    updateAdminInterface();


    showToast(
        "Modo administrador ativado."
    );

}


function logoutAdmin() {

    adminMode =
        false;

    currentAdminPassword =
        "";


    updateAdminInterface();


    if (currentFolderId) {

        renderLinks(
            currentLinks
        );

    } else {

        renderFolders();

    }


    showToast(
        "Você saiu do modo administrador."
    );

}


function updateAdminInterface() {

    if (adminMode) {

        adminButton.classList.add(
            "hidden"
        );

        logoutButton.classList.remove(
            "hidden"
        );

        themeButton.classList.remove(
            "hidden"
        );

        themeButtonLinks.classList.remove(
            "hidden"
        );

    } else {

        adminButton.classList.remove(
            "hidden"
        );

        logoutButton.classList.add(
            "hidden"
        );

        themeButton.classList.add(
            "hidden"
        );

        themeButtonLinks.classList.add(
            "hidden"
        );

    }

}


/* =====================================================
   PASTA — MODAL
===================================================== */

function openFolderModal(
    folder = null
) {

    editingFolderId =
        folder
            ? folder.id
            : null;


    document
        .getElementById(
            "folderModalTitle"
        )
        .textContent =
            folder
                ? "✏️ Editar pasta"
                : "📁 Nova pasta";


    document
        .getElementById(
            "folderName"
        )
        .value =
            folder
                ? folder.name
                : "";


    document
        .getElementById(
            "folderColor"
        )
        .value =
            folder
                ? folder.color
                : "#4f7cff";


    document
        .getElementById(
            "folderColorValue"
        )
        .textContent =
            folder
                ? folder.color
                : "#4f7cff";


    document
        .getElementById(
            "folderModal"
        )
        .classList.remove(
            "hidden"
        );

}


async function saveFolder() {

    const name =
        document
            .getElementById(
                "folderName"
            )
            .value
            .trim();


    const color =
        document
            .getElementById(
                "folderColor"
            )
            .value;


    if (!name) {

        showToast(
            "Digite um nome."
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
                        currentAdminPassword,

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
            "Erro ao salvar pasta."
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


async function deleteFolder(
    folder
) {

    if (!adminMode) {

        return;

    }


    if (
        !confirm(
            `Excluir "${folder.name}" e todos os links dentro dela?`
        )
    ) {

        return;

    }


    const {
        error
    } =
        await supabaseClient.rpc(
            "admin_delete_folder",
            {
                p_password:
                    currentAdminPassword,

                p_folder_id:
                    folder.id
            }
        );


    if (error) {

        console.error(
            error
        );

        showToast(
            "Erro ao excluir pasta."
        );

        return;

    }


    await loadFolders();


    showToast(
        "Pasta excluída."
    );

}


/* =====================================================
   LINK — MODAL
===================================================== */

function openLinkModal(
    link = null
) {

    editingLinkId =
        link
            ? link.id
            : null;


    document
        .getElementById(
            "linkModalTitle"
        )
        .textContent =
            link
                ? "✏️ Editar link"
                : "🔗 Novo link";


    document
        .getElementById(
            "linkName"
        )
        .value =
            link
                ? link.name
                : "";


    document
        .getElementById(
            "linkUrl"
        )
        .value =
            link
                ? link.url
                : "";


    document
        .getElementById(
            "linkColor"
        )
        .value =
            link
                ? link.color
                : "#00a884";


    document
        .getElementById(
            "linkColorValue"
        )
        .textContent =
            link
                ? link.color
                : "#00a884";


    document
        .getElementById(
            "linkModal"
        )
        .classList.remove(
            "hidden"
        );

}


async function saveLink() {

    const name =
        document
            .getElementById(
                "linkName"
            )
            .value
            .trim();


    let url =
        document
            .getElementById(
                "linkUrl"
            )
            .value
            .trim();


    const color =
        document
            .getElementById(
                "linkColor"
            )
            .value;


    if (
        !name ||
        !url
    ) {

        showToast(
            "Preencha nome e link."
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
                        currentAdminPassword,

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
            "Erro ao salvar link."
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


async function deleteLink(
    link
) {

    if (!adminMode) {

        return;

    }


    if (
        !confirm(
            `Excluir "${link.name}"?`
        )
    ) {

        return;

    }


    const {
        error
    } =
        await supabaseClient.rpc(
            "admin_delete_link",
            {
                p_password:
                    currentAdminPassword,

                p_link_id:
                    link.id
            }
        );


    if (error) {

        console.error(
            error
        );

        showToast(
            "Erro ao excluir link."
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

let currentTheme = {
    ...defaultTheme
};


async function loadTheme() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("site_settings")
            .select("value")
            .eq(
                "key",
                "theme"
            )
            .maybeSingle();


    if (
        error ||
        !data
    ) {

        applyTheme(
            defaultTheme
        );

        return;

    }


    try {

        currentTheme =
            {
                ...defaultTheme,
                ...JSON.parse(
                    data.value
                )
            };

    } catch {

        currentTheme =
            {
                ...defaultTheme
            };

    }


    applyTheme(
        currentTheme
    );

}


function applyTheme(
    theme
) {

    const root =
        document.documentElement;


    root.style.setProperty(
        "--background",
        theme.background
    );


    root.style.setProperty(
        "--topbar",
        theme.topbar
    );


    root.style.setProperty(
        "--text",
        theme.text
    );


    root.style.setProperty(
        "--heading",
        theme.heading
    );


    root.style.setProperty(
        "--border",
        theme.border
    );


    root.style.setProperty(
        "--button",
        theme.button
    );


    root.style.setProperty(
        "--logo",
        theme.logo
    );


    currentTheme =
        {
            ...defaultTheme,
            ...theme
        };

}


function openThemeModal() {

    if (!adminMode) {

        return;

    }


    document
        .getElementById(
            "themeBackground"
        )
        .value =
            currentTheme.background;


    document
        .getElementById(
            "themeTopbar"
        )
        .value =
            currentTheme.topbar;


    document
        .getElementById(
            "themeText"
        )
        .value =
            currentTheme.text;


    document
        .getElementById(
            "themeHeading"
        )
        .value =
            currentTheme.heading;


    document
        .getElementById(
            "themeBorder"
        )
        .value =
            currentTheme.border;


    document
        .getElementById(
            "themeButtonColor"
        )
        .value =
            currentTheme.button;


    document
        .getElementById(
            "themeLogo"
        )
        .value =
            currentTheme.logo;


    document
        .getElementById(
            "themeModal"
        )
        .classList.remove(
            "hidden"
        );

}


async function saveTheme() {

    if (!adminMode) {

        return;

    }


    const theme = {

        background:
            document
                .getElementById(
                    "themeBackground"
                )
                .value,

        topbar:
            document
                .getElementById(
                    "themeTopbar"
                )
                .value,

        text:
            document
                .getElementById(
                    "themeText"
                )
                .value,

        heading:
            document
                .getElementById(
                    "themeHeading"
                )
                .value,

        border:
            document
                .getElementById(
                    "themeBorder"
                )
                .value,

        button:
            document
                .getElementById(
                    "themeButtonColor"
                )
                .value,

        logo:
            document
                .getElementById(
                    "themeLogo"
                )
                .value

    };


    const {
        error
    } =
        await supabaseClient.rpc(
            "admin_save_theme",
            {
                p_password:
                    currentAdminPassword,

                p_theme:
                    JSON.stringify(theme)
            }
        );


    if (error) {

        console.error(
            error
        );

        showToast(
            "Erro ao salvar tema."
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
        "Tema atualizado para todos."
    );

}


function resetTheme() {

    document
        .getElementById(
            "themeBackground"
        )
        .value =
            defaultTheme.background;


    document
        .getElementById(
            "themeTopbar"
        )
        .value =
            defaultTheme.topbar;


    document
        .getElementById(
            "themeText"
        )
        .value =
            defaultTheme.text;


    document
        .getElementById(
            "themeHeading"
        )
        .value =
            defaultTheme.heading;


    document
        .getElementById(
            "themeBorder"
        )
        .value =
            defaultTheme.border;


    document
        .getElementById(
            "themeButtonColor"
        )
        .value =
            defaultTheme.button;


    document
        .getElementById(
            "themeLogo"
        )
        .value =
            defaultTheme.logo;

}


/* =====================================================
   UTILITÁRIOS
===================================================== */

function togglePanel(
    id
) {

    document
        .getElementById(id)
        .classList.toggle(
            "hidden"
        );

}


function showHome() {

    currentFolderId =
        null;

    folderPage.classList.add(
        "hidden"
    );

    homePage.classList.remove(
        "hidden"
    );

    renderFolders();

}


function closeModal(
    id
) {

    document
        .getElementById(id)
        .classList.add(
            "hidden"
        );

}


function makeGradient(
    color
) {

    return `
        linear-gradient(
            135deg,
            ${color},
            ${darken(color, 55)}
        )
    `;

}


function darken(
    hex,
    amount
) {

    hex =
        hex.replace(
            "#",
            ""
        );


    let r =
        parseInt(
            hex.substring(0, 2),
            16
        );


    let g =
        parseInt(
            hex.substring(2, 4),
            16
        );


    let b =
        parseInt(
            hex.substring(4, 6),
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


function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        value;

    return div.innerHTML;

}


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
                ${title}
            </h2>

            <p>
                ${description}
            </p>

        </div>

    `;

}


function showLoading(
    element
) {

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


function showError(
    element,
    message
) {

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


let toastTimeout;


function showToast(
    message
) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2800
        );

}
