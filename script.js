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


const defaultTheme = {

    background: "#f3f3f3",
    topbar: "#ffffff",
    text: "#111111",
    heading: "#000000",
    border: "#000000",
    button: "#111111",
    logo: "#111111"

};


let currentTheme = {
    ...defaultTheme
};


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


    /* CORES */

    on(
        "folderColor",
        "input",
        event => {

            const value =
                event.target.value;

            document.getElementById(
                "folderColorValue"
            ).textContent =
                value;

        }
    );


    on(
        "linkColor",
        "input",
        event => {

            const value =
                event.target.value;

            document.getElementById(
                "linkColorValue"
            ).textContent =
                value;

        }
    );


    /* TODOS OS X */

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
   PASTAS
===================================================== */

async function loadFolders() {

    const grid =
        document.getElementById(
            "foldersGrid"
        );


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
   ORDENAÇÃO PASTAS
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


    document.getElementById(
        "folderTitle"
    ).textContent =
        `📁 ${folder.name}`;


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
                            >
                                ✏️
                            </button>

                            <button
                                class="card-action delete delete-link"
                                type="button"
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

                card
                    .querySelector(
                        ".edit-link"
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
                        ".delete-link"
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

function applyLayout(
    grid,
    columns,
    layout
) {

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


    document.getElementById(
        "layoutToggle"
    ).textContent =
        folderLayout === "grid"
            ? "⬜ Grade"
            : "☰ Lista";


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


    document.getElementById(
        "linkLayoutToggle"
    ).textContent =
        linkLayout === "grid"
            ? "⬜ Grade"
            : "☰ Lista";


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


    modal.classList.remove(
        "hidden"
    );


    document.getElementById(
        "adminPassword"
    ).value = "";


    document.getElementById(
        "adminError"
    ).textContent = "";


    setTimeout(
        () => {

            document.getElementById(
                "adminPassword"
            ).focus();

        },
        50
    );

}


async function loginAdmin() {

    const password =
        document.getElementById(
            "adminPassword"
        ).value.trim();


    if (!password) {

        document.getElementById(
            "adminError"
        ).textContent =
            "Digite a senha.";

        return;

    }


    const result =
        await supabaseClient.rpc(
            "check_admin_password",
            {
                p_password: password
            }
        );


    if (result.error) {

        console.error(
            "Erro administrativo:",
            result.error
        );

        document.getElementById(
            "adminError"
        ).textContent =
            "Erro ao verificar a senha.";

        return;

    }


    if (result.data !== true) {

        document.getElementById(
            "adminError"
        ).textContent =
            "Senha incorreta.";

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


    document.getElementById(
        "adminButton"
    ).classList.toggle(
        "hidden",
        adminMode
    );


    document.getElementById(
        "logoutButton"
    ).classList.toggle(
        "hidden",
        !adminMode
    );

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


    document.getElementById(
        "folderModalTitle"
    ).textContent =
        folder
            ? "✏️ Editar pasta"
            : "📁 Nova pasta";


    document.getElementById(
        "folderName"
    ).value =
        folder
            ? folder.name
            : "";


    document.getElementById(
        "folderColor"
    ).value =
        folder
            ? folder.color
            : "#4f7cff";


    document.getElementById(
        "folderColorValue"
    ).textContent =
        folder
            ? folder.color
            : "#4f7cff";


    document.getElementById(
        "folderModal"
    ).classList.remove(
        "hidden"
    );

}


async function saveFolder() {

    const name =
        document.getElementById(
            "folderName"
        ).value.trim();


    const color =
        document.getElementById(
            "folderColor"
        ).value;


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


    document.getElementById(
        "linkModalTitle"
    ).textContent =
        link
            ? "✏️ Editar link"
            : "🔗 Novo link";


    document.getElementById(
        "linkName"
    ).value =
        link
            ? link.name
            : "";


    document.getElementById(
        "linkUrl"
    ).value =
        link
            ? link.url
            : "";


    document.getElementById(
        "linkColor"
    ).value =
        link
            ? link.color
            : "#00a884";


    document.getElementById(
        "linkColorValue"
    ).textContent =
        link
            ? link.color
            : "#00a884";


    document.getElementById(
        "linkModal"
    ).classList.remove(
        "hidden"
    );

}


/* =====================================================
   SALVAR LINK
===================================================== */

async function saveLink() {

    const name =
        document.getElementById(
            "linkName"
        ).value.trim();


    let url =
        document.getElementById(
            "linkUrl"
        ).value.trim();


    const color =
        document.getElementById(
            "linkColor"
        ).value;


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
            "https://" + url;

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

}


/* =====================================================
   ABRIR TEMA
===================================================== */

function openThemeModal() {

    if (!adminMode) {

        return;

    }


    document.getElementById(
        "themeBackground"
    ).value =
        currentTheme.background;


    document.getElementById(
        "themeTopbar"
    ).value =
        currentTheme.topbar;


    document.getElementById(
        "themeText"
    ).value =
        currentTheme.text;


    document.getElementById(
        "themeHeading"
    ).value =
        currentTheme.heading;


    document.getElementById(
        "themeBorder"
    ).value =
        currentTheme.border;


    document.getElementById(
        "themeButtonColor"
    ).value =
        currentTheme.button;


    document.getElementById(
        "themeLogo"
    ).value =
        currentTheme.logo;


    document.getElementById(
        "themeModal"
    ).classList.remove(
        "hidden"
    );

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
            document.getElementById(
                "themeBackground"
            ).value,

        topbar:
            document.getElementById(
                "themeTopbar"
            ).value,

        text:
            document.getElementById(
                "themeText"
            ).value,

        heading:
            document.getElementById(
                "themeHeading"
            ).value,

        border:
            document.getElementById(
                "themeBorder"
            ).value,

        button:
            document.getElementById(
                "themeButtonColor"
            ).value,

        logo:
            document.getElementById(
                "themeLogo"
            ).value

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
        "Tema salvo na nuvem!"
    );

}


/* =====================================================
   RESTAURAR TEMA
===================================================== */

function resetTheme() {

    document.getElementById(
        "themeBackground"
    ).value =
        defaultTheme.background;


    document.getElementById(
        "themeTopbar"
    ).value =
        defaultTheme.topbar;


    document.getElementById(
        "themeText"
    ).value =
        defaultTheme.text;


    document.getElementById(
        "themeHeading"
    ).value =
        defaultTheme.heading;


    document.getElementById(
        "themeBorder"
    ).value =
        defaultTheme.border;


    document.getElementById(
        "themeButtonColor"
    ).value =
        defaultTheme.button;


    document.getElementById(
        "themeLogo"
    ).value =
        defaultTheme.logo;

}


/* =====================================================
   NAVEGAÇÃO
===================================================== */

function showHome() {

    currentFolderId =
        null;


    document.getElementById(
        "folderPage"
    ).classList.add(
        "hidden"
    );


    document.getElementById(
        "homePage"
    ).classList.remove(
        "hidden"
    );


    loadFolders();

}


/* =====================================================
   MODAIS
===================================================== */

function closeModal(
    id
) {

    const modal =
        document.getElementById(id);


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
        document.getElementById(id);


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


    selected.classList.add(
        "active"
    );

}


/* =====================================================
   CORES DOS CARDS
===================================================== */

function createGradient(
    color
) {

    return `
        linear-gradient(
            135deg,
            ${color},
            ${darkenColor(color, 55)}
        )
    `;

}


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


    if (
        clean.length !== 6
    ) {

        return "#333333";

    }


    let r =
        parseInt(
            clean.substring(0, 2),
            16
        );


    let g =
        parseInt(
            clean.substring(2, 4),
            16
        );


    let b =
        parseInt(
            clean.substring(4, 6),
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
   ESTADOS
===================================================== */

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

let toastTimer = null;


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
