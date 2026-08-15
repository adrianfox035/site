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

let currentItems = [];

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
   TEMA
===================================================== */

const defaultTheme = {

    background: "#f3f3f3",
    topbar: "#ffffff",
    text: "#111111",
    heading: "#000000",
    border: "#000000",
    button: "#111111",
    logo: "#111111",
    logoImage: "",
    fontSize: "16",
    borderWidth: "2"

};


let currentTheme = {
    ...defaultTheme
};


/* =====================================================
   TEMAS PREDEFINIDOS
===================================================== */

const presetThemes = [

    {
        name: "Azul oceano",
        background: "#eef6ff",
        topbar: "#ffffff",
        text: "#102a43",
        heading: "#063970",
        border: "#1464a5",
        button: "#1464a5",
        logo: "#1464a5"
    },

    {
        name: "Verde natureza",
        background: "#eefaf3",
        topbar: "#ffffff",
        text: "#173b2a",
        heading: "#176b45",
        border: "#22945b",
        button: "#176b45",
        logo: "#176b45"
    },

    {
        name: "Roxo",
        background: "#f6f0ff",
        topbar: "#ffffff",
        text: "#2e1748",
        heading: "#542681",
        border: "#7b3fb2",
        button: "#542681",
        logo: "#542681"
    },

    {
        name: "Amarelo",
        background: "#fffbea",
        topbar: "#ffffff",
        text: "#493900",
        heading: "#8a6900",
        border: "#d6a900",
        button: "#8a6900",
        logo: "#8a6900"
    },

    {
        name: "Azul + verde",
        background: "#eefbf9",
        topbar: "#ffffff",
        text: "#123c40",
        heading: "#087f8c",
        border: "#159a88",
        button: "#087f8c",
        logo: "#087f8c"
    },

    {
        name: "Lavanda",
        background: "#f8f5ff",
        topbar: "#ffffff",
        text: "#33264d",
        heading: "#7654a5",
        border: "#9877c2",
        button: "#7654a5",
        logo: "#7654a5"
    },

    {
        name: "Verde escuro",
        background: "#edf5f0",
        topbar: "#ffffff",
        text: "#10261a",
        heading: "#145c32",
        border: "#237a47",
        button: "#145c32",
        logo: "#145c32"
    },

    {
        name: "Céu",
        background: "#eef8ff",
        topbar: "#ffffff",
        text: "#15324a",
        heading: "#2879b9",
        border: "#48a5df",
        button: "#2879b9",
        logo: "#2879b9"
    },

    {
        name: "Turquesa",
        background: "#edfbfa",
        topbar: "#ffffff",
        text: "#123b3a",
        heading: "#078c87",
        border: "#13aaa2",
        button: "#078c87",
        logo: "#078c87"
    },

    {
        name: "Rosa",
        background: "#fff2f7",
        topbar: "#ffffff",
        text: "#4c2031",
        heading: "#a83c68",
        border: "#cf5d89",
        button: "#a83c68",
        logo: "#a83c68"
    },

    {
        name: "Vermelho",
        background: "#fff2f2",
        topbar: "#ffffff",
        text: "#481818",
        heading: "#a52a2a",
        border: "#c94b4b",
        button: "#a52a2a",
        logo: "#a52a2a"
    },

    {
        name: "Laranja",
        background: "#fff6ed",
        topbar: "#ffffff",
        text: "#4a2b13",
        heading: "#b45a13",
        border: "#dc7727",
        button: "#b45a13",
        logo: "#b45a13"
    },

    {
        name: "Índigo",
        background: "#f1f3ff",
        topbar: "#ffffff",
        text: "#20264c",
        heading: "#3949ab",
        border: "#5967d2",
        button: "#3949ab",
        logo: "#3949ab"
    },

    {
        name: "Escuro",
        background: "#202124",
        topbar: "#151515",
        text: "#eeeeee",
        heading: "#ffffff",
        border: "#777777",
        button: "#eeeeee",
        logo: "#ffffff"
    },

    {
        name: "Preto e branco",
        background: "#eeeeee",
        topbar: "#ffffff",
        text: "#111111",
        heading: "#000000",
        border: "#000000",
        button: "#111111",
        logo: "#111111"
    }

];


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupEvents();

        initializeSite();

    }
);


async function initializeSite() {

    await loadTheme();

    await loadFolders();

    renderPresetThemes();

    updateAdminInterface();

}


/* =====================================================
   EVENTOS
===================================================== */

function setupEvents() {

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


    on(
        "addFolderButton",
        "click",
        () => openFolderModal()
    );


    on(
        "addSubfolderButton",
        "click",
        () => openFolderModal()
    );


    on(
        "saveFolderButton",
        "click",
        saveFolder
    );


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


    on(
        "backButton",
        "click",
        goBack
    );


    on(
        "organizeButton",
        "click",
        () => toggle("organizePanel")
    );


    on(
        "organizeLinksButton",
        "click",
        () => toggle("organizeLinksPanel")
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


    on(
        "itemsPerRow",
        "change",
        event => {

            foldersPerRow =
                Number(event.target.value);

            renderCurrentView();

        }
    );


    on(
        "linksPerRow",
        "change",
        event => {

            linksPerRow =
                Number(event.target.value);

            renderCurrentView();

        }
    );


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


    on(
        "themeFontSize",
        "input",
        event => {

            document.getElementById(
                "themeFontSizeValue"
            ).textContent =
                `${event.target.value}px`;

        }
    );


    on(
        "themeBorderWidth",
        "input",
        event => {

            document.getElementById(
                "themeBorderWidthValue"
            ).textContent =
                `${event.target.value}px`;

        }
    );


    document
        .querySelectorAll(".sort-option")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    folderSort =
                        button.dataset.sort;

                    setActive(
                        ".sort-option",
                        button
                    );

                    renderCurrentView();

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

                    setActive(
                        ".link-sort-option",
                        button
                    );

                    renderCurrentView();

                }
            );

        });


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


    const password =
        document.getElementById(
            "adminPassword"
        );

    if (password) {

        password.addEventListener(
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

}


/* =====================================================
   AUXILIAR
===================================================== */

function on(id, event, callback) {

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
   CARREGAR PASTAS
===================================================== */

async function loadFolders() {

    const grid =
        document.getElementById(
            "foldersGrid"
        );

    showLoading(grid);


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

        console.error(result.error);

        showError(
            grid,
            "Erro ao carregar as pastas."
        );

        return;

    }


    folders =
        result.data || [];


    await loadFolderCounts();

    renderCurrentView();

}


/* =====================================================
   CONTAGEM
===================================================== */

async function loadFolderCounts() {

    for (
        const folder of folders
    ) {

        const links =
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


        const children =
            folders.filter(
                item =>
                    item.parent_folder_id ===
                    folder.id
            ).length;


        folder.linkCount =
            links.count || 0;

        folder.childCount =
            children;

    }

}


/* =====================================================
   RENDERIZAÇÃO PRINCIPAL
===================================================== */

function renderCurrentView() {

    if (
        currentFolderId === null
    ) {

        renderHome();

    } else {

        renderFolderPage();

    }

}


/* =====================================================
   HOME
===================================================== */

function renderHome() {

    document.getElementById(
        "homePage"
    ).classList.remove("hidden");

    document.getElementById(
        "folderPage"
    ).classList.add("hidden");


    const rootFolders =
        folders.filter(
            folder =>
                !folder.parent_folder_id
        );


    renderFolderCards(
        rootFolders,
        "foldersGrid"
    );

}


/* =====================================================
   PÁGINA DA PASTA
===================================================== */

async function renderFolderPage() {

    const folder =
        folders.find(
            item =>
                item.id === currentFolderId
        );


    if (!folder) {

        currentFolderId = null;

        renderHome();

        return;

    }


    document.getElementById(
        "homePage"
    ).classList.add("hidden");

    document.getElementById(
        "folderPage"
    ).classList.remove("hidden");


    document.getElementById(
        "folderTitle"
    ).textContent =
        `📁 ${folder.name}`;


    await loadCurrentFolderItems();

}


/* =====================================================
   CARREGAR ITENS DA PASTA
===================================================== */

async function loadCurrentFolderItems() {

    const grid =
        document.getElementById(
            "linksGrid"
        );

    showLoading(grid);


    const childFolders =
        folders.filter(
            folder =>
                folder.parent_folder_id ===
                currentFolderId
        );


    const result =
        await supabaseClient
            .from("links")
            .select("*")
            .eq(
                "folder_id",
                currentFolderId
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


    if (result.error) {

        console.error(result.error);

        showError(
            grid,
            "Erro ao carregar os links."
        );

        return;

    }


    const links =
        result.data || [];


    currentItems = [

        ...childFolders.map(
            folder => ({
                type: "folder",
                data: folder
            })
        ),

        ...links.map(
            link => ({
                type: "link",
                data: link
            })
        )

    ];


    renderCurrentFolderItems();

}


/* =====================================================
   RENDER ITENS
===================================================== */

function renderCurrentFolderItems() {

    const grid =
        document.getElementById(
            "linksGrid"
        );


    if (!currentItems.length) {

        grid.innerHTML =
            emptyHTML(
                "📂",
                "Pasta vazia",
                "Adicione um link ou uma nova pasta."
            );

        return;

    }


    let items =
        [...currentItems];


    if (
        linkSort === "oldest"
    ) {

        items.sort(
            compareOldest
        );

    } else if (
        linkSort === "color"
    ) {

        items.sort(
            compareColor
        );

    } else {

        items.sort(
            compareNewest
        );

    }


    grid.innerHTML = "";


    items.forEach(
        item => {

            if (
                item.type === "folder"
            ) {

                createFolderCard(
                    item.data,
                    grid
                );

            } else {

                createLinkCard(
                    item.data,
                    grid
                );

            }

        }
    );


    applyLayout(
        grid,
        linksPerRow,
        linkLayout
    );

}


/* =====================================================
   PASTAS DA HOME
===================================================== */

function renderFolderCards(
    list,
    containerId
) {

    const grid =
        document.getElementById(
            containerId
        );


    if (!list.length) {

        grid.innerHTML =
            emptyHTML(
                "📁",
                "Nenhuma pasta",
                "Crie a primeira pasta para começar."
            );

        return;

    }


    const sorted =
        sortFolders(
            [...list]
        );


    grid.innerHTML = "";


    sorted.forEach(
        folder => {

            createFolderCard(
                folder,
                grid
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
    folder,
    grid
) {

    const card =
        document.createElement("div");


    card.className =
        "card folder-card";


    card.style.background =
        createGradient(
            folder.color
        );


    const children =
        folder.childCount || 0;

    const links =
        folder.linkCount || 0;


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

                ${children}
                ${
                    children === 1
                        ? "subpasta"
                        : "subpastas"
                }

                ·

                ${links}
                ${
                    links === 1
                        ? "link"
                        : "links"
                }

            </div>

        </div>


        <div class="card-description">
            Clique para entrar ↗
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
            .querySelector(".edit-folder")
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
            .querySelector(".delete-folder")
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


    grid.appendChild(card);

}


/* =====================================================
   CRIAR CARD DE LINK
===================================================== */

function createLinkCard(
    link,
    grid
) {

    const card =
        document.createElement("div");


    card.className =
        "card link-card";


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
            .querySelector(".edit-link")
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
            .querySelector(".delete-link")
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


    grid.appendChild(card);

}


/* =====================================================
   ORDENAÇÃO
===================================================== */

function sortFolders(list) {

    switch (folderSort) {

        case "oldest":

            return list.sort(
                compareOldest
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
                compareColor
            );


        default:

            return list.sort(
                compareNewest
            );

    }

}


function compareNewest(a, b) {

    return (
        new Date(b.data?.created_at || b.created_at) -
        new Date(a.data?.created_at || a.created_at)
    );

}


function compareOldest(a, b) {

    return (
        new Date(a.data?.created_at || a.created_at) -
        new Date(b.data?.created_at || b.created_at)
    );

}


function compareColor(a, b) {

    const colorA =
        a.data?.color || a.color || "";

    const colorB =
        b.data?.color || b.color || "";


    return colorA.localeCompare(
        colorB
    );

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


    await renderFolderPage();

}


/* =====================================================
   VOLTAR
===================================================== */

function goBack() {

    if (
        currentFolderId === null
    ) {

        return;

    }


    const currentFolder =
        folders.find(
            folder =>
                folder.id ===
                currentFolderId
        );


    if (
        currentFolder &&
        currentFolder.parent_folder_id
    ) {

        currentFolderId =
            currentFolder.parent_folder_id;

        renderFolderPage();

        return;

    }


    currentFolderId =
        null;


    renderHome();

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


    document.getElementById(
        "folderModalTitle"
    ).textContent =
        folder
            ? "✏️ Editar pasta"
            : currentFolderId
                ? "📁 Nova subpasta"
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


/* =====================================================
   SALVAR PASTA
===================================================== */

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

            showToast(
                "Apenas o administrador pode editar."
            );

            return;

        }


        const folder =
            folders.find(
                item =>
                    item.id ===
                    editingFolderId
            );


        const parentId =
            folder
                ? folder.parent_folder_id
                : null;


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
                        color,

                    p_parent_folder_id:
                        parentId

                }
            );

    } else {

        result =
            await supabaseClient
                .from("folders")
                .insert({

                    name: name,

                    color: color,

                    parent_folder_id:
                        currentFolderId

                });

    }


    if (result.error) {

        console.error(result.error);

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


    if (
        currentFolderId !== null
    ) {

        await renderFolderPage();

    }


    showToast(
        "Pasta salva!"
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
            `Excluir "${folder.name}" e todo o conteúdo dentro dela?`
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

        console.error(result.error);

        showToast(
            "Erro ao excluir a pasta."
        );

        return;

    }


    if (
        currentFolderId ===
        folder.id
    ) {

        currentFolderId =
            folder.parent_folder_id || null;

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
        !url.startsWith("http://") &&
        !url.startsWith("https://")
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

        if (
            currentFolderId === null
        ) {

            showToast(
                "Entre em uma pasta primeiro."
            );

            return;

        }


        result =
            await supabaseClient
                .from("links")
                .insert({

                    folder_id:
                        currentFolderId,

                    name: name,

                    url: url,

                    color: color

                });

    }


    if (result.error) {

        console.error(result.error);

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


    await loadFolders();

    await loadCurrentFolderItems();


    showToast(
        "Link salvo!"
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

        console.error(result.error);

        showToast(
            "Erro ao excluir o link."
        );

        return;

    }


    await loadFolders();

    await loadCurrentFolderItems();


    showToast(
        "Link excluído."
    );

}


/* =====================================================
   ADMIN
===================================================== */

function openAdminModal() {

    document.getElementById(
        "adminModal"
    ).classList.remove(
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


    if (
        result.error ||
        result.data !== true
    ) {

        document.getElementById(
            "adminError"
        ).textContent =
            result.error
                ? "Erro ao verificar a senha."
                : "Senha incorreta.";

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

    renderCurrentView();


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

    renderCurrentView();


    showToast(
        "Modo administrador encerrado."
    );

}


function updateAdminInterface() {

    document
        .querySelectorAll(".admin-only")
        .forEach(element => {

            element.classList.toggle(
                "hidden",
                !adminMode
            );

        });


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

        const saved =
            JSON.parse(
                result.data.value
            );


        currentTheme = {

            ...defaultTheme,

            ...saved

        };


        applyTheme(
            currentTheme
        );

    } catch {

        applyTheme(
            defaultTheme
        );

    }

}


function applyTheme(theme) {

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
        "--font-size",
        `${currentTheme.fontSize || 16}px`
    );

    root.style.setProperty(
        "--border-width",
        `${currentTheme.borderWidth || 2}px`
    );


    const logo =
        document.getElementById(
            "logoContainer"
        );


    if (
        logo &&
        currentTheme.logoImage
    ) {

        logo.innerHTML = `

            <img
                src="${escapeAttribute(
                    currentTheme.logoImage
                )}"
                alt="Logo"
            >

        `;

    } else if (logo) {

        logo.innerHTML = `
            <span>🗂️</span>
        `;

    }

}


function openThemeModal() {

    if (!adminMode) {

        return;

    }


    setValue(
        "themeBackground",
        currentTheme.background
    );

    setValue(
        "themeTopbar",
        currentTheme.topbar
    );

    setValue(
        "themeText",
        currentTheme.text
    );

    setValue(
        "themeHeading",
        currentTheme.heading
    );

    setValue(
        "themeBorder",
        currentTheme.border
    );

    setValue(
        "themeButtonColor",
        currentTheme.button
    );

    setValue(
        "themeLogo",
        currentTheme.logo
    );

    setValue(
        "themeFontSize",
        currentTheme.fontSize || 16
    );

    setValue(
        "themeBorderWidth",
        currentTheme.borderWidth || 2
    );

    setValue(
        "themeLogoImage",
        currentTheme.logoImage || ""
    );


    document.getElementById(
        "themeFontSizeValue"
    ).textContent =
        `${currentTheme.fontSize || 16}px`;


    document.getElementById(
        "themeBorderWidthValue"
    ).textContent =
        `${currentTheme.borderWidth || 2}px`;


    document.getElementById(
        "themeModal"
    ).classList.remove(
        "hidden"
    );

}


async function saveTheme() {

    if (!adminMode) {

        return;

    }


    const theme = {

        background:
            getValue("themeBackground"),

        topbar:
            getValue("themeTopbar"),

        text:
            getValue("themeText"),

        heading:
            getValue("themeHeading"),

        border:
            getValue("themeBorder"),

        button:
            getValue("themeButtonColor"),

        logo:
            getValue("themeLogo"),

        fontSize:
            getValue("themeFontSize"),

        borderWidth:
            getValue("themeBorderWidth"),

        logoImage:
            getValue("themeLogoImage")

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

        console.error(result.error);

        showToast(
            "Erro ao salvar o tema."
        );

        return;

    }


    applyTheme(theme);

    closeModal(
        "themeModal"
    );


    showToast(
        "Tema salvo na nuvem!"
    );

}


function resetTheme() {

    applyTheme(
        defaultTheme
    );


    openThemeModal();

}


/* =====================================================
   TEMAS PRONTOS
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
        theme => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "preset-theme";


            button.style.background =
                `linear-gradient(
                    135deg,
                    ${theme.background},
                    ${theme.heading}
                )`;


            button.innerHTML = `

                <span>
                    ${escapeHTML(
                        theme.name
                    )}
                </span>

            `;


            button.addEventListener(
                "click",
                () => {

                    if (!adminMode) {

                        return;

                    }


                    currentTheme = {

                        ...currentTheme,

                        ...theme

                    };


                    applyTheme(
                        currentTheme
                    );


                    openThemeModal();


                    showToast(
                        `Tema "${theme.name}" aplicado.`
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


    document.getElementById(
        "layoutToggle"
    ).textContent =
        folderLayout === "grid"
            ? "⬜ Grade"
            : "☰ Lista";


    renderCurrentView();

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


    renderCurrentView();

}


/* =====================================================
   GRADIENTE
===================================================== */

function createGradient(color) {

    return `
        linear-gradient(
            135deg,
            ${color},
            ${darkenColor(color, 45)}
        )
    `;

}


function darkenColor(
    hex,
    amount
) {

    let clean =
        String(hex)
            .replace("#", "");


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
   MODAIS
===================================================== */

function closeModal(id) {

    const modal =
        document.getElementById(id);


    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }

}


function toggle(id) {

    const element =
        document.getElementById(id);


    if (element) {

        element.classList.toggle(
            "hidden"
        );

    }

}


/* =====================================================
   AUXILIARES
===================================================== */

function setValue(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {

        element.value =
            value;

    }

}


function getValue(id) {

    const element =
        document.getElementById(id);

    return element
        ? element.value
        : "";

}


function setActive(
    selector,
    selected
) {

    document
        .querySelectorAll(selector)
        .forEach(button => {

            button.classList.remove(
                "active"
            );

        });


    selected.classList.add(
        "active"
    );

}


/* =====================================================
   SEGURANÇA
===================================================== */

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value ?? "";


    return div.innerHTML;

}


function escapeAttribute(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

}


/* =====================================================
   ESTADOS
===================================================== */

function showLoading(element) {

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


function showToast(message) {

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
