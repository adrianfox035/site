/* =====================================================
   LINKHUB
   SCRIPT PRINCIPAL
   PASTAS + LINKS UNIFICADOS, TRANCAS, ADMIN-ONLY, IMAGENS
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

let itemSort = "newest";

let groupMode = "mixed"; // mixed | folders-first | links-first

let itemLayout = "grid";

let itemsPerRow = 4;

let toastTimer = null;

let pendingUnlockFolderId = null;

const unlockedFolders = new Set();

let pendingFolderImage = null; // dataURL staged before save
let pendingLinkImage = null;


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
    radius: 14,

    logoImage: ""

};


let currentTheme = {
    ...defaultTheme
};


/* =====================================================
   TEMAS PRONTOS
===================================================== */

const presetThemes = [

    { name: "Azul Oceano", background: "#eaf4ff", topbar: "#ffffff", text: "#12304a", heading: "#062b49", border: "#0b4f71", button: "#087ea4", logo: "#064663", gradientEnabled: true, gradientStart: "#eaf4ff", gradientEnd: "#d9f3ff", gradientDirection: "135deg" },
    { name: "Verde Natureza", background: "#edf8f0", topbar: "#ffffff", text: "#183b2a", heading: "#0c4025", border: "#176b3a", button: "#159957", logo: "#0d6335", gradientEnabled: true, gradientStart: "#edf8f0", gradientEnd: "#d8f5df", gradientDirection: "135deg" },
    { name: "Roxo", background: "#f4efff", topbar: "#ffffff", text: "#35254d", heading: "#28103f", border: "#6b3fa0", button: "#7b4bb7", logo: "#542681", gradientEnabled: true, gradientStart: "#f4efff", gradientEnd: "#e5d8ff", gradientDirection: "135deg" },
    { name: "Amarelo", background: "#fffbea", topbar: "#ffffff", text: "#4d420d", heading: "#3e3300", border: "#b58b00", button: "#e2b400", logo: "#876b00", gradientEnabled: true, gradientStart: "#fffbea", gradientEnd: "#fff1a8", gradientDirection: "135deg" },
    { name: "Azul + Verde", background: "#eefaf8", topbar: "#ffffff", text: "#173f45", heading: "#0c3035", border: "#197d78", button: "#168f83", logo: "#146b75", gradientEnabled: true, gradientStart: "#eaf6ff", gradientEnd: "#dff8eb", gradientDirection: "135deg" },
    { name: "Turquesa", background: "#e9fbfb", topbar: "#ffffff", text: "#164449", heading: "#08363b", border: "#178b91", button: "#16a6a8", logo: "#087278", gradientEnabled: true, gradientStart: "#e9fbfb", gradientEnd: "#c9f4f0", gradientDirection: "135deg" },
    { name: "Azul Royal", background: "#eef2ff", topbar: "#ffffff", text: "#172653", heading: "#091743", border: "#3154b8", button: "#4267d5", logo: "#2946a0", gradientEnabled: true, gradientStart: "#eef2ff", gradientEnd: "#dbe3ff", gradientDirection: "135deg" },
    { name: "Verde Esmeralda", background: "#edf9f3", topbar: "#ffffff", text: "#164132", heading: "#092d20", border: "#18875b", button: "#18a66d", logo: "#08754a", gradientEnabled: true, gradientStart: "#edf9f3", gradientEnd: "#d2f3e0", gradientDirection: "135deg" },
    { name: "Roxo + Azul", background: "#f1f1ff", topbar: "#ffffff", text: "#28284d", heading: "#171742", border: "#5853ad", button: "#625dd2", logo: "#44419a", gradientEnabled: true, gradientStart: "#f1f1ff", gradientEnd: "#e1ddff", gradientDirection: "135deg" },
    { name: "Laranja", background: "#fff4eb", topbar: "#ffffff", text: "#4d2c16", heading: "#3b1d0a", border: "#c46b24", button: "#df7b29", logo: "#a74f0c", gradientEnabled: true, gradientStart: "#fff4eb", gradientEnd: "#ffe0c2", gradientDirection: "135deg" },
    { name: "Rosa", background: "#fff0f6", topbar: "#ffffff", text: "#4c2335", heading: "#3b1025", border: "#b84f78", button: "#d76591", logo: "#9e3c67", gradientEnabled: true, gradientStart: "#fff0f6", gradientEnd: "#ffdce9", gradientDirection: "135deg" },
    { name: "Vermelho", background: "#fff0f0", topbar: "#ffffff", text: "#4b2020", heading: "#390d0d", border: "#b23b3b", button: "#d34d4d", logo: "#9c2929", gradientEnabled: true, gradientStart: "#fff0f0", gradientEnd: "#ffdada", gradientDirection: "135deg" },
    { name: "Ciano", background: "#eafaff", topbar: "#ffffff", text: "#153c47", heading: "#092d38", border: "#1985a0", button: "#20a8c5", logo: "#087891", gradientEnabled: true, gradientStart: "#eafaff", gradientEnd: "#d2f4ff", gradientDirection: "135deg" },
    { name: "Lavanda", background: "#f6f1ff", topbar: "#ffffff", text: "#3d3150", heading: "#281a3c", border: "#8665b5", button: "#9876cc", logo: "#69479c", gradientEnabled: true, gradientStart: "#f6f1ff", gradientEnd: "#e7dcff", gradientDirection: "135deg" },
    { name: "Escuro", background: "#17191c", topbar: "#22252a", text: "#eeeeee", heading: "#ffffff", border: "#ffffff", button: "#3d7cff", logo: "#6aa0ff", gradientEnabled: true, gradientStart: "#17191c", gradientEnd: "#252b38", gradientDirection: "135deg" }

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

    await loadTheme();

    updateAdminInterface();

    await loadFolders();

    await loadHomeItems();

}


/* =====================================================
   EVENTOS
===================================================== */

function setupEvents() {

    /* ADMIN */

    on("adminButton", "click", openAdminModal);
    on("logoutButton", "click", logoutAdmin);
    on("confirmAdminButton", "click", loginAdmin);

    const adminPasswordInput = document.getElementById("adminPassword");

    if (adminPasswordInput) {

        adminPasswordInput.addEventListener("keydown", event => {

            if (event.key === "Enter") {
                event.preventDefault();
                loginAdmin();
            }

        });

    }


    /* DESBLOQUEAR PASTA */

    on("confirmUnlockButton", "click", confirmUnlockFolder);

    const unlockInput = document.getElementById("unlockPassword");

    if (unlockInput) {

        unlockInput.addEventListener("keydown", event => {

            if (event.key === "Enter") {
                event.preventDefault();
                confirmUnlockFolder();
            }

        });

    }


    /* PASTAS */

    on("addFolderButton", "click", () => openFolderModal());
    on("saveFolderButton", "click", saveFolder);

    on("folderLocked", "change", event => {

        const row = document.getElementById("folderPasswordRow");

        if (row) {
            row.classList.toggle("hidden", !event.target.checked);
        }

    });

    on("folderImageInput", "change", event => handleItemImageUpload(event, "folder"));
    on("removeFolderImageButton", "click", () => removeItemImage("folder"));


    /* LINKS */

    on("addLinkButton", "click", () => openLinkModal());
    on("saveLinkButton", "click", saveLink);
    on("linkImageInput", "change", event => handleItemImageUpload(event, "link"));
    on("removeLinkImageButton", "click", () => removeItemImage("link"));


    /* VOLTAR */

    on("backButton", "click", handleBackNavigation);


    /* ORGANIZAÇÃO */

    on("organizeButton", "click", () => toggleElement("organizePanel"));

    document.querySelectorAll(".sort-option").forEach(button => {

        button.addEventListener("click", () => {

            itemSort = button.dataset.sort || "newest";
            setActiveButton(".sort-option", button);
            renderItems();

        });

    });

    on("groupModeToggle", "click", cycleGroupMode);

    on("itemsPerRow", "change", event => {

        itemsPerRow = Number(event.target.value) || 4;
        applyLayout(document.getElementById("itemsGrid"), itemsPerRow, itemLayout);

    });

    on("layoutToggle", "click", toggleItemLayout);


    /* TEMA */

    on("themeButton", "click", openThemeModal);
    on("saveThemeButton", "click", saveTheme);
    on("resetThemeButton", "click", resetTheme);


    /* CORES DOS CARDS (preview ao vivo) */

    on("folderColor", "input", event => {
        const output = document.getElementById("folderColorValue");
        if (output) output.textContent = event.target.value;
    });

    on("linkColor", "input", event => {
        const output = document.getElementById("linkColorValue");
        if (output) output.textContent = event.target.value;
    });


    /* LOGO */

    on("themeLogoImage", "change", handleLogoUpload);
    on("removeLogoImageButton", "click", removeLogoImage);


    /* GRADIENTE */

    on("themeGradientEnabled", "change", updateThemePreview);
    on("themeGradientStart", "input", updateThemePreview);
    on("themeGradientEnd", "input", updateThemePreview);
    on("themeGradientDirection", "change", updateThemePreview);


    /* CORES DO TEMA */

    [
        "themeBackground",
        "themeTopbar",
        "themeText",
        "themeHeading",
        "themeBorder",
        "themeButtonColor",
        "themeLogo"
    ].forEach(id => {
        on(id, "input", updateThemePreview);
    });


    /* TAMANHOS */

    on("themeBorderWidth", "input", updateThemePreview);
    on("themeFontScale", "input", updateThemePreview);
    on("themeRadius", "input", updateThemePreview);


    /* MODAIS */

    document.querySelectorAll(".modal-close").forEach(button => {

        button.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            closeModal(button.dataset.close);
        });

    });

    document.querySelectorAll(".modal-overlay").forEach(overlay => {

        overlay.addEventListener("click", event => {

            if (event.target === overlay) {
                overlay.classList.add("hidden");
            }

        });

    });


    /* ESC */

    document.addEventListener("keydown", event => {

        if (event.key !== "Escape") return;

        document.querySelectorAll(".modal-overlay:not(.hidden)").forEach(modal => {
            modal.classList.add("hidden");
        });

    });

}


/* =====================================================
   AUXILIAR DE EVENTOS
===================================================== */

function on(id, event, callback) {

    const element = document.getElementById(id);

    if (!element) return;

    element.addEventListener(event, callback);

}


/* =====================================================
   CARREGAR PASTAS
===================================================== */

async function loadFolders() {

    const result =
        await supabaseClient
            .from("folders")
            .select("*")
            .order("created_at", { ascending: false });

    if (result.error) {

        console.error("Erro ao carregar pastas:", result.error);

        const grid = document.getElementById("itemsGrid");

        if (grid) showError(grid, "Não foi possível carregar as pastas.");

        return;

    }

    folders = Array.isArray(result.data) ? result.data : [];

    await loadFolderLinkCounts();

    if (
        currentFolderId !== null &&
        !folders.some(folder => String(folder.id) === String(currentFolderId))
    ) {

        currentFolderId = null;
        showHomeInterfaceOnly();

    }

}


/* =====================================================
   CONTAGEM DE LINKS E SUBPASTAS
===================================================== */

async function loadFolderLinkCounts() {

    folders.forEach(folder => {
        folder.linkCount = 0;
        folder.childCount = 0;
    });

    if (!folders.length) return;

    const result =
        await supabaseClient
            .from("links")
            .select("id, folder_id, admin_only");

    if (result.error) {

        console.error("Erro ao contar links:", result.error);

    } else {

        const counts = {};

        (result.data || []).forEach(link => {

            if (link.folder_id === null || link.folder_id === undefined) return;

            if (link.admin_only && !adminMode) return;

            const key = String(link.folder_id);

            counts[key] = (counts[key] || 0) + 1;

        });

        folders.forEach(folder => {
            folder.linkCount = counts[String(folder.id)] || 0;
        });

    }

    const childCounts = {};

    folders.forEach(folder => {

        if (folder.parent_id === null || folder.parent_id === undefined) return;

        if (folder.admin_only && !adminMode) return;

        const key = String(folder.parent_id);

        childCounts[key] = (childCounts[key] || 0) + 1;

    });

    folders.forEach(folder => {
        folder.childCount = childCounts[String(folder.id)] || 0;
    });

}


/* =====================================================
   PASTAS VISÍVEIS
===================================================== */

function getVisibleFolders() {

    return folders.filter(folder => {

        if (folder.admin_only && !adminMode) return false;

        if (currentFolderId === null) {
            return folder.parent_id === null || folder.parent_id === undefined;
        }

        return String(folder.parent_id) === String(currentFolderId);

    });

}


/* =====================================================
   CARREGAR LINKS DA PASTA ATUAL / DO INÍCIO
===================================================== */

async function loadHomeItems() {

    const result =
        await supabaseClient
            .from("links")
            .select("*")
            .or("folder_id.is.null,pinned_home.eq.true")
            .order("created_at", { ascending: false });

    if (result.error) {

        console.error("Erro ao carregar links do início:", result.error);
        currentLinks = [];

    } else {

        currentLinks = Array.isArray(result.data) ? result.data : [];

    }

    renderItems();

}


async function loadLinks(folderId) {

    const result =
        await supabaseClient
            .from("links")
            .select("*")
            .eq("folder_id", folderId)
            .order("created_at", { ascending: false });

    if (result.error) {

        console.error("Erro ao carregar links:", result.error);
        currentLinks = [];

    } else {

        currentLinks = Array.isArray(result.data) ? result.data : [];

    }

    renderItems();

}


function getVisibleLinks() {

    return currentLinks.filter(link => {

        if (link.admin_only && !adminMode) return false;

        return true;

    });

}


/* =====================================================
   RENDER — PASTAS + LINKS JUNTOS
===================================================== */

function renderItems() {

    const grid = document.getElementById("itemsGrid");

    if (!grid) return;

    const items = getCombinedItems();

    if (!items.length) {

        grid.innerHTML =
            emptyHTML(
                currentFolderId === null ? "📁" : "📂",
                "Nada por aqui",
                adminMode
                    ? "Crie uma pasta ou um link para começar."
                    : "Ainda não há nada nesta pasta."
            );

        return;

    }

    grid.innerHTML = "";

    items.forEach(item => {

        grid.appendChild(
            item._type === "folder"
                ? createFolderCard(item)
                : createLinkCard(item)
        );

    });

    applyLayout(grid, itemsPerRow, itemLayout);

}


function getCombinedItems() {

    const folderItems =
        getVisibleFolders().map(folder => ({ ...folder, _type: "folder" }));

    const linkItems =
        getVisibleLinks().map(link => ({ ...link, _type: "link" }));

    let items = sortItems([...folderItems, ...linkItems]);

    if (groupMode === "folders-first") {

        items = [
            ...items.filter(item => item._type === "folder"),
            ...items.filter(item => item._type === "link")
        ];

    } else if (groupMode === "links-first") {

        items = [
            ...items.filter(item => item._type === "link"),
            ...items.filter(item => item._type === "folder")
        ];

    }

    return items;

}


function sortItems(list) {

    switch (itemSort) {

        case "oldest":

            return list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        case "name":

            return list.sort((a, b) =>
                String(a.name || "").localeCompare(String(b.name || ""), "pt-BR")
            );

        case "color":

            return list.sort((a, b) =>
                String(a.color || "").localeCompare(String(b.color || ""))
            );

        case "newest":
        default:

            return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    }

}


function cycleGroupMode() {

    const order = ["mixed", "folders-first", "links-first"];

    const nextIndex = (order.indexOf(groupMode) + 1) % order.length;

    groupMode = order[nextIndex];

    const labels = {
        "mixed": "🔀 Misturado",
        "folders-first": "📁 Pastas primeiro",
        "links-first": "🔗 Links primeiro"
    };

    const button = document.getElementById("groupModeToggle");

    if (button) button.textContent = labels[groupMode];

    renderItems();

}


/* =====================================================
   CRIAR CARD DE PASTA
===================================================== */

function createFolderCard(folder) {

    const card = document.createElement("div");

    card.className = "card";

    applyCardBackground(card, folder);

    const childText = Number(folder.childCount) === 1 ? "pasta" : "pastas";
    const linkText = Number(folder.linkCount) === 1 ? "link" : "links";

    const badges = `
        ${folder.locked ? '<span class="card-badge" title="Pasta trancada">🔒</span>' : ""}
        ${folder.admin_only ? '<span class="card-badge" title="Somente admin">👁️</span>' : ""}
    `;

    card.innerHTML = `

        ${adminMode ? `
            <div class="card-actions">
                <button class="card-action edit-folder" type="button" title="Editar" aria-label="Editar pasta">✏️</button>
                <button class="card-action delete delete-folder" type="button" title="Excluir" aria-label="Excluir pasta">🗑️</button>
            </div>
        ` : ""}

        <div class="card-badges">${badges}</div>

        <div>
            <div class="card-name">📁 ${escapeHTML(folder.name)}</div>
            <div class="card-description">
                ${Number(folder.childCount) || 0} ${childText} • ${Number(folder.linkCount) || 0} ${linkText}
            </div>
        </div>

        <div class="card-description">Clique para entrar</div>

    `;

    card.addEventListener("click", () => {
        requestOpenFolder(folder);
    });

    if (adminMode) {

        const edit = card.querySelector(".edit-folder");
        const del = card.querySelector(".delete-folder");

        if (edit) {
            edit.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                openFolderModal(folder);
            });
        }

        if (del) {
            del.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                deleteFolder(folder);
            });
        }

    }

    return card;

}


/* =====================================================
   CRIAR CARD DE LINK
===================================================== */

function createLinkCard(link) {

    const card = document.createElement("div");

    card.className = "card";

    applyCardBackground(card, link);

    const badges = `
        ${link.pinned_home ? '<span class="card-badge" title="Fixado no início">🏠</span>' : ""}
        ${link.admin_only ? '<span class="card-badge" title="Somente admin">👁️</span>' : ""}
    `;

    card.innerHTML = `

        ${adminMode ? `
            <div class="card-actions">
                <button class="card-action edit-link" type="button" title="Editar" aria-label="Editar link">✏️</button>
                <button class="card-action delete delete-link" type="button" title="Excluir" aria-label="Excluir link">🗑️</button>
            </div>
        ` : ""}

        <div class="card-badges">${badges}</div>

        <div>
            <div class="card-name">🔗 ${escapeHTML(link.name)}</div>
        </div>

        <div class="card-description">Abrir ↗</div>

    `;

    card.addEventListener("click", () => {

        const normalized = normalizeURL(link.url);

        if (isValidURL(normalized)) {
            window.open(normalized, "_blank", "noopener,noreferrer");
        }

    });

    if (adminMode) {

        const edit = card.querySelector(".edit-link");
        const del = card.querySelector(".delete-link");

        if (edit) {
            edit.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                openLinkModal(link);
            });
        }

        if (del) {
            del.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                deleteLink(link);
            });
        }

    }

    return card;

}


/* =====================================================
   FUNDO DO CARD (imagem ou gradiente de cor)
===================================================== */

function applyCardBackground(card, item) {

    if (item.image_url) {

        card.classList.add("has-image");

        card.style.backgroundImage =
            `linear-gradient(to top, rgba(0,0,0,.6), rgba(0,0,0,.1)), url("${item.image_url}")`;

        card.style.backgroundSize = "cover";
        card.style.backgroundPosition = "center";

    } else {

        card.style.background = createCardGradient(item.color);

    }

}


/* =====================================================
   LAYOUT
===================================================== */

function applyLayout(grid, columns, layout) {

    if (!grid) return;

    const safeColumns = Math.max(1, Number(columns) || 1);

    grid.style.setProperty("--columns", safeColumns);

    grid.classList.toggle("vertical", layout === "vertical");

}


function toggleItemLayout() {

    itemLayout = itemLayout === "grid" ? "vertical" : "grid";

    const button = document.getElementById("layoutToggle");

    if (button) {
        button.textContent = itemLayout === "grid" ? "⬜ Grade" : "☰ Lista";
    }

    applyLayout(document.getElementById("itemsGrid"), itemsPerRow, itemLayout);

}


/* =====================================================
   ABRIR PASTA (com checagem de trava)
===================================================== */

function requestOpenFolder(folder) {

    const alreadyUnlocked = unlockedFolders.has(String(folder.id));

    if (folder.locked && !adminMode && !alreadyUnlocked) {

        pendingUnlockFolderId = folder.id;

        const errorEl = document.getElementById("unlockError");
        const input = document.getElementById("unlockPassword");

        if (errorEl) errorEl.textContent = "";
        if (input) input.value = "";

        const modal = document.getElementById("unlockModal");

        if (modal) modal.classList.remove("hidden");

        if (input) input.focus();

        return;

    }

    openFolder(folder.id);

}


function confirmUnlockFolder() {

    if (pendingUnlockFolderId === null) return;

    const folder = folders.find(
        item => String(item.id) === String(pendingUnlockFolderId)
    );

    const input = document.getElementById("unlockPassword");
    const errorEl = document.getElementById("unlockError");

    const typed = input ? input.value : "";

    if (!folder || typed !== (folder.folder_password || "")) {

        if (errorEl) errorEl.textContent = "Senha incorreta.";
        return;

    }

    unlockedFolders.add(String(folder.id));

    closeModal("unlockModal");

    const targetId = pendingUnlockFolderId;
    pendingUnlockFolderId = null;

    openFolder(targetId);

}


async function openFolder(folderId) {

    const folder = folders.find(item => String(item.id) === String(folderId));

    if (!folder) return;

    currentFolderId = folder.id;

    const title = document.getElementById("folderTitle");

    if (title) {
        title.textContent = `${folder.locked ? "🔒 " : "📁 "}${folder.name}`;
    }

    const backButton = document.getElementById("backButton");
    const subtitle = document.getElementById("pageSubtitle");
    const linkPinnedRow = document.getElementById("linkPinnedRow");

    if (backButton) backButton.classList.remove("hidden");
    if (subtitle) subtitle.classList.add("hidden");
    if (linkPinnedRow) linkPinnedRow.classList.remove("hidden");

    updateBackButton();

    await loadLinks(folder.id);

    renderItems();

}


/* =====================================================
   VOLTAR
===================================================== */

async function handleBackNavigation() {

    if (currentFolderId === null) {
        await showHome();
        return;
    }

    const currentFolder = folders.find(
        folder => String(folder.id) === String(currentFolderId)
    );

    if (!currentFolder) {
        await showHome();
        return;
    }

    if (currentFolder.parent_id !== null && currentFolder.parent_id !== undefined) {
        await openFolder(currentFolder.parent_id);
        return;
    }

    await showHome();

}


function updateBackButton() {

    const button = document.getElementById("backButton");

    if (!button) return;

    if (currentFolderId === null) {
        button.textContent = "← Voltar";
        return;
    }

    const currentFolder = folders.find(
        folder => String(folder.id) === String(currentFolderId)
    );

    if (currentFolder && currentFolder.parent_id !== null && currentFolder.parent_id !== undefined) {

        const parent = folders.find(
            folder => String(folder.id) === String(currentFolder.parent_id)
        );

        button.textContent = parent ? `← ${parent.name}` : "← Voltar";

    } else {

        button.textContent = "← Início";

    }

}


/* =====================================================
   MOSTRAR INÍCIO
===================================================== */

async function showHome() {

    if (currentFolderId !== null) {

        const currentFolder = folders.find(
            folder => String(folder.id) === String(currentFolderId)
        );

        if (currentFolder && currentFolder.parent_id !== null && currentFolder.parent_id !== undefined) {
            await openFolder(currentFolder.parent_id);
            return;
        }

    }

    currentFolderId = null;

    showHomeInterfaceOnly();

    await loadFolders();
    await loadHomeItems();

}


function showHomeInterfaceOnly() {

    currentFolderId = null;

    const backButton = document.getElementById("backButton");
    const subtitle = document.getElementById("pageSubtitle");
    const title = document.getElementById("folderTitle");
    const linkPinnedRow = document.getElementById("linkPinnedRow");

    if (backButton) backButton.classList.add("hidden");
    if (subtitle) subtitle.classList.remove("hidden");
    if (title) title.textContent = "📁 Pastas";
    if (linkPinnedRow) linkPinnedRow.classList.add("hidden");

    updateBackButton();

}


/* =====================================================
   ADMIN — MODAL
===================================================== */

function openAdminModal() {

    if (adminMode) return;

    const modal = document.getElementById("adminModal");

    if (!modal) return;

    modal.classList.remove("hidden");

    const input = document.getElementById("adminPassword");
    const error = document.getElementById("adminError");

    if (input) {
        input.value = "";
        input.focus();
    }

    if (error) error.textContent = "";

}


async function loginAdmin() {

    const input = document.getElementById("adminPassword");
    const error = document.getElementById("adminError");

    if (!input) return;

    const password = input.value.trim();

    if (!password) {
        if (error) error.textContent = "Digite a senha.";
        return;
    }

    const result = await supabaseClient.rpc("check_admin_password", {
        p_password: password
    });

    if (result.error) {
        console.error("Erro ao verificar senha:", result.error);
        if (error) error.textContent = "Erro ao verificar a senha.";
        return;
    }

    if (result.data !== true) {
        if (error) error.textContent = "Senha incorreta.";
        return;
    }

    adminMode = true;
    adminPassword = password;

    closeModal("adminModal");

    updateAdminInterface();

    await loadFolders();

    if (currentFolderId !== null) {
        await loadLinks(currentFolderId);
    } else {
        await loadHomeItems();
    }

    showToast("Modo administrador ativado.");

}


function logoutAdmin() {

    adminMode = false;
    adminPassword = "";
    editingFolderId = null;
    editingLinkId = null;

    updateAdminInterface();

    renderItems();

}


function updateAdminInterface() {

    document.querySelectorAll(".admin-only").forEach(element => {
        element.classList.toggle("hidden", !adminMode);
    });

    const adminButton = document.getElementById("adminButton");
    const logoutButton = document.getElementById("logoutButton");

    if (adminButton) adminButton.classList.toggle("hidden", adminMode);
    if (logoutButton) logoutButton.classList.toggle("hidden", !adminMode);

    renderItems();

}


/* =====================================================
   MODAL DE PASTA
===================================================== */

function openFolderModal(folder = null) {

    if (!adminMode) {
        showToast("Apenas o administrador pode criar ou editar pastas.");
        return;
    }

    editingFolderId = folder ? folder.id : null;
    pendingFolderImage = folder ? (folder.image_url || null) : null;

    const title = document.getElementById("folderModalTitle");
    const name = document.getElementById("folderName");
    const color = document.getElementById("folderColor");
    const colorValue = document.getElementById("folderColorValue");
    const locked = document.getElementById("folderLocked");
    const passwordRow = document.getElementById("folderPasswordRow");
    const passwordInput = document.getElementById("folderPasswordInput");
    const adminOnly = document.getElementById("folderAdminOnly");
    const imageName = document.getElementById("folderImageName");
    const imageInput = document.getElementById("folderImageInput");

    if (title) {
        title.textContent = folder
            ? "✏️ Editar pasta"
            : (currentFolderId !== null ? "📁 Nova subpasta" : "📁 Nova pasta");
    }

    if (name) name.value = folder ? folder.name : "";

    const selectedColor = folder?.color || "#4f7cff";

    if (color) color.value = normalizeColor(selectedColor);
    if (colorValue) colorValue.textContent = normalizeColor(selectedColor);

    if (locked) locked.checked = Boolean(folder?.locked);
    if (passwordRow) passwordRow.classList.toggle("hidden", !folder?.locked);
    if (passwordInput) passwordInput.value = folder?.folder_password || "";
    if (adminOnly) adminOnly.checked = Boolean(folder?.admin_only);
    if (imageInput) imageInput.value = "";
    if (imageName) imageName.textContent = pendingFolderImage ? "Imagem salva" : "Nenhuma imagem selecionada";

    const modal = document.getElementById("folderModal");

    if (modal) modal.classList.remove("hidden");

}


async function saveFolder() {

    if (!adminMode) {
        showToast("Apenas o administrador pode salvar pastas.");
        return;
    }

    const nameElement = document.getElementById("folderName");
    const colorElement = document.getElementById("folderColor");
    const lockedElement = document.getElementById("folderLocked");
    const passwordElement = document.getElementById("folderPasswordInput");
    const adminOnlyElement = document.getElementById("folderAdminOnly");

    if (!nameElement || !colorElement) return;

    const name = nameElement.value.trim();
    const color = normalizeColor(colorElement.value);
    const locked = Boolean(lockedElement?.checked);
    const folderPassword = passwordElement?.value || "";
    const adminOnly = Boolean(adminOnlyElement?.checked);

    if (!name) {
        showToast("Digite um nome para a pasta.");
        return;
    }

    if (locked && !folderPassword) {
        showToast("Digite uma senha para a pasta trancada.");
        return;
    }

    let result;

    if (editingFolderId !== null) {

        result = await supabaseClient.rpc("admin_update_folder", {
            p_password: adminPassword,
            p_folder_id: editingFolderId,
            p_name: name,
            p_color: color
        });

        if (!result.error) {

            result = await supabaseClient
                .from("folders")
                .update({
                    locked,
                    folder_password: locked ? folderPassword : null,
                    admin_only: adminOnly,
                    image_url: pendingFolderImage || null
                })
                .eq("id", editingFolderId);

        }

    } else {

        result = await supabaseClient
            .from("folders")
            .insert({
                name,
                color,
                parent_id: currentFolderId !== null ? currentFolderId : null,
                locked,
                folder_password: locked ? folderPassword : null,
                admin_only: adminOnly,
                image_url: pendingFolderImage || null
            });

    }

    if (result.error) {
        console.error("Erro ao salvar pasta:", result.error);
        showToast("Erro ao salvar a pasta.");
        return;
    }

    closeModal("folderModal");

    editingFolderId = null;
    pendingFolderImage = null;

    await loadFolders();

    if (currentFolderId !== null) {
        await loadLinks(currentFolderId);
    } else {
        await loadHomeItems();
    }

    showToast("Pasta salva.");

}


async function deleteFolder(folder) {

    if (!adminMode) return;

    if (!folder || folder.id === null) return;

    const hasChildren = folders.some(
        item => String(item.parent_id) === String(folder.id)
    );

    let message = `Excluir "${folder.name}"`;

    message += hasChildren
        ? " e todas as subpastas dentro dela?"
        : " e os links dentro dela?";

    const confirmed = window.confirm(message);

    if (!confirmed) return;

    const result = await supabaseClient.rpc("admin_delete_folder", {
        p_password: adminPassword,
        p_folder_id: folder.id
    });

    if (result.error) {
        console.error("Erro ao excluir pasta:", result.error);
        showToast("Erro ao excluir a pasta.");
        return;
    }

    const deletingCurrentTree =
        currentFolderId !== null &&
        isFolderInsideTree(currentFolderId, folder.id);

    if (deletingCurrentTree) {

        currentFolderId = null;
        currentLinks = [];
        showHomeInterfaceOnly();

    }

    await loadFolders();

    if (currentFolderId !== null) {
        await loadLinks(currentFolderId);
    } else {
        await loadHomeItems();
    }

    showToast("Pasta excluída.");

}


function isFolderInsideTree(folderId, rootFolderId) {

    let currentId = folderId;

    const visited = new Set();

    while (currentId !== null && currentId !== undefined) {

        const key = String(currentId);

        if (visited.has(key)) return false;

        visited.add(key);

        if (key === String(rootFolderId)) return true;

        const folder = folders.find(item => String(item.id) === key);

        if (!folder) return false;

        currentId = folder.parent_id;

    }

    return false;

}


/* =====================================================
   MODAL DE LINK
===================================================== */

function openLinkModal(link = null) {

    if (!adminMode) {
        showToast("Apenas o administrador pode criar ou editar links.");
        return;
    }

    editingLinkId = link ? link.id : null;
    pendingLinkImage = link ? (link.image_url || null) : null;

    const title = document.getElementById("linkModalTitle");
    const name = document.getElementById("linkName");
    const url = document.getElementById("linkUrl");
    const color = document.getElementById("linkColor");
    const colorValue = document.getElementById("linkColorValue");
    const pinned = document.getElementById("linkPinnedHome");
    const pinnedRow = document.getElementById("linkPinnedRow");
    const adminOnly = document.getElementById("linkAdminOnly");
    const imageName = document.getElementById("linkImageName");
    const imageInput = document.getElementById("linkImageInput");

    if (title) title.textContent = link ? "✏️ Editar link" : "🔗 Novo link";
    if (name) name.value = link ? link.name : "";
    if (url) url.value = link ? link.url : "";

    const selectedColor = link?.color || "#00a884";

    if (color) color.value = normalizeColor(selectedColor);
    if (colorValue) colorValue.textContent = normalizeColor(selectedColor);

    const atHome = currentFolderId === null;

    if (pinned) pinned.checked = link ? Boolean(link.pinned_home) : atHome;
    if (pinned) pinned.disabled = atHome && !link;
    if (pinnedRow) pinnedRow.classList.toggle("hidden", atHome && !link);

    if (adminOnly) adminOnly.checked = Boolean(link?.admin_only);
    if (imageInput) imageInput.value = "";
    if (imageName) imageName.textContent = pendingLinkImage ? "Imagem salva" : "Nenhuma imagem selecionada";

    const modal = document.getElementById("linkModal");

    if (modal) modal.classList.remove("hidden");

}


async function saveLink() {

    if (!adminMode) {
        showToast("Apenas o administrador pode salvar links.");
        return;
    }

    const nameElement = document.getElementById("linkName");
    const urlElement = document.getElementById("linkUrl");
    const colorElement = document.getElementById("linkColor");
    const pinnedElement = document.getElementById("linkPinnedHome");
    const adminOnlyElement = document.getElementById("linkAdminOnly");

    if (!nameElement || !urlElement || !colorElement) return;

    const name = nameElement.value.trim();
    let url = urlElement.value.trim();
    const color = normalizeColor(colorElement.value);

    if (!name || !url) {
        showToast("Preencha o nome e o link.");
        return;
    }

    url = normalizeURL(url);

    if (!isValidURL(url)) {
        showToast("Digite um link válido.");
        return;
    }

    const atHome = currentFolderId === null;
    const pinnedHome = atHome ? true : Boolean(pinnedElement?.checked);
    const adminOnly = Boolean(adminOnlyElement?.checked);

    let result;

    if (editingLinkId !== null) {

        result = await supabaseClient.rpc("admin_update_link", {
            p_password: adminPassword,
            p_link_id: editingLinkId,
            p_name: name,
            p_url: url,
            p_color: color
        });

        if (!result.error) {

            result = await supabaseClient
                .from("links")
                .update({
                    pinned_home: pinnedHome,
                    admin_only: adminOnly,
                    image_url: pendingLinkImage || null
                })
                .eq("id", editingLinkId);

        }

    } else {

        result = await supabaseClient
            .from("links")
            .insert({
                folder_id: currentFolderId,
                name,
                url,
                color,
                pinned_home: pinnedHome,
                admin_only: adminOnly,
                image_url: pendingLinkImage || null
            });

    }

    if (result.error) {
        console.error("Erro ao salvar link:", result.error);
        showToast("Erro ao salvar o link.");
        return;
    }

    closeModal("linkModal");

    editingLinkId = null;
    pendingLinkImage = null;

    if (currentFolderId !== null) {
        await loadLinks(currentFolderId);
    } else {
        await loadHomeItems();
    }

    await loadFolders();

    renderItems();

    showToast("Link salvo.");

}


async function deleteLink(link) {

    if (!adminMode) return;

    const confirmed = window.confirm(`Excluir o link "${link.name}"?`);

    if (!confirmed) return;

    const result = await supabaseClient.rpc("admin_delete_link", {
        p_password: adminPassword,
        p_link_id: link.id
    });

    if (result.error) {
        console.error("Erro ao excluir link:", result.error);
        showToast("Erro ao excluir o link.");
        return;
    }

    if (currentFolderId !== null) {
        await loadLinks(currentFolderId);
    } else {
        await loadHomeItems();
    }

    await loadFolders();

    renderItems();

    showToast("Link excluído.");

}


/* =====================================================
   IMAGEM DE PASTA / LINK
===================================================== */

async function handleItemImageUpload(event, kind) {

    if (!adminMode) return;

    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        showToast("Selecione uma imagem válida.");
        return;
    }

    try {

        showToast("Processando imagem...");

        const dataURL = await resizeImage(file, 600, 0.82);

        if (kind === "folder") {

            pendingFolderImage = dataURL;

            const name = document.getElementById("folderImageName");
            if (name) name.textContent = file.name;

        } else {

            pendingLinkImage = dataURL;

            const name = document.getElementById("linkImageName");
            if (name) name.textContent = file.name;

        }

        showToast("Imagem pronta. Clique em Salvar.");

    } catch (error) {

        console.error("Erro ao processar imagem:", error);
        showToast("Não foi possível carregar a imagem.");

    }

}


function removeItemImage(kind) {

    if (kind === "folder") {

        pendingFolderImage = null;

        const input = document.getElementById("folderImageInput");
        const name = document.getElementById("folderImageName");

        if (input) input.value = "";
        if (name) name.textContent = "Nenhuma imagem selecionada";

    } else {

        pendingLinkImage = null;

        const input = document.getElementById("linkImageInput");
        const name = document.getElementById("linkImageName");

        if (input) input.value = "";
        if (name) name.textContent = "Nenhuma imagem selecionada";

    }

}


/* =====================================================
   TEMA — CARREGAR
===================================================== */

async function loadTheme() {

    const result =
        await supabaseClient
            .from("site_settings")
            .select("value")
            .eq("key", "theme")
            .maybeSingle();

    if (result.error) {

        console.error("Erro ao carregar tema:", result.error);
        applyTheme(defaultTheme);
        return;

    }

    if (!result.data) {

        applyTheme(defaultTheme);
        return;

    }

    try {

        const savedTheme =
            typeof result.data.value === "string"
                ? JSON.parse(result.data.value)
                : result.data.value;

        currentTheme = { ...defaultTheme, ...(savedTheme || {}) };

        applyTheme(currentTheme);

    } catch (error) {

        console.error("Tema inválido:", error);

        currentTheme = { ...defaultTheme };

        applyTheme(defaultTheme);

    }

}


/* =====================================================
   TEMA — APLICAR
===================================================== */

function applyTheme(theme) {

    currentTheme = { ...defaultTheme, ...(theme || {}) };

    const root = document.documentElement;

    root.style.setProperty("--background", currentTheme.background);
    root.style.setProperty("--topbar", currentTheme.topbar);
    root.style.setProperty("--text", currentTheme.text);
    root.style.setProperty("--heading", currentTheme.heading);
    root.style.setProperty("--border", currentTheme.border);
    root.style.setProperty("--button", currentTheme.button);
    root.style.setProperty("--logo", currentTheme.logo);
    root.style.setProperty("--border-width", `${Number(currentTheme.borderWidth) || 2}px`);
    root.style.setProperty("--font-scale", Number(currentTheme.fontScale) || 1);
    root.style.setProperty("--radius", `${Number(currentTheme.radius) || 14}px`);

    let backgroundValue;

    if (currentTheme.gradientEnabled) {

        backgroundValue =
            currentTheme.gradientDirection === "radial"
                ? `radial-gradient(circle, ${currentTheme.gradientStart}, ${currentTheme.gradientEnd})`
                : `linear-gradient(${currentTheme.gradientDirection}, ${currentTheme.gradientStart}, ${currentTheme.gradientEnd})`;

    } else {

        backgroundValue = currentTheme.background;

    }

    root.style.setProperty("--page-background", backgroundValue);

    applyLogo();

    if (document.getElementById("themeModal")) {
        updateThemeControls();
    }

}


/* =====================================================
   TEMA — MODAL
===================================================== */

function openThemeModal() {

    if (!adminMode) return;

    updateThemeControls();

    const modal = document.getElementById("themeModal");

    if (modal) modal.classList.remove("hidden");

}


function updateThemeControls() {

    setInput("themeBackground", currentTheme.background);
    setInput("themeTopbar", currentTheme.topbar);
    setInput("themeText", currentTheme.text);
    setInput("themeHeading", currentTheme.heading);
    setInput("themeBorder", currentTheme.border);
    setInput("themeButtonColor", currentTheme.button);
    setInput("themeLogo", currentTheme.logo);

    const gradientEnabled = document.getElementById("themeGradientEnabled");

    if (gradientEnabled) gradientEnabled.checked = Boolean(currentTheme.gradientEnabled);

    setInput("themeGradientStart", currentTheme.gradientStart);
    setInput("themeGradientEnd", currentTheme.gradientEnd);

    const direction = document.getElementById("themeGradientDirection");

    if (direction) direction.value = currentTheme.gradientDirection;

    setInput("themeBorderWidth", currentTheme.borderWidth);
    setInput("themeFontScale", currentTheme.fontScale);
    setInput("themeRadius", currentTheme.radius);

    updateRangeLabels();
    updateGradientControls();

    const imageInput = document.getElementById("themeLogoImage");

    if (imageInput) imageInput.value = "";

    const imageName = document.getElementById("themeLogoImageName");

    if (imageName) {
        imageName.textContent = currentTheme.logoImage ? "Imagem da logo salva" : "Nenhuma imagem selecionada";
    }

}


function updateThemePreview() {

    if (!adminMode) return;

    applyTheme(getThemeFromInputs());

}


function getThemeFromInputs() {

    return {

        ...currentTheme,

        background: getInputValue("themeBackground", currentTheme.background),
        topbar: getInputValue("themeTopbar", currentTheme.topbar),
        text: getInputValue("themeText", currentTheme.text),
        heading: getInputValue("themeHeading", currentTheme.heading),
        border: getInputValue("themeBorder", currentTheme.border),
        button: getInputValue("themeButtonColor", currentTheme.button),
        logo: getInputValue("themeLogo", currentTheme.logo),

        gradientEnabled: Boolean(document.getElementById("themeGradientEnabled")?.checked),
        gradientStart: getInputValue("themeGradientStart", currentTheme.gradientStart),
        gradientEnd: getInputValue("themeGradientEnd", currentTheme.gradientEnd),
        gradientDirection: getInputValue("themeGradientDirection", currentTheme.gradientDirection),

        borderWidth: Number(getInputValue("themeBorderWidth", currentTheme.borderWidth)) || 2,
        fontScale: Number(getInputValue("themeFontScale", currentTheme.fontScale)) || 1,
        radius: Number(getInputValue("themeRadius", currentTheme.radius)) || 14

    };

}


async function saveTheme() {

    if (!adminMode) return;

    const theme = getThemeFromInputs();

    theme.logoImage = currentTheme.logoImage || "";

    const result = await supabaseClient.rpc("admin_save_theme", {
        p_password: adminPassword,
        p_theme: JSON.stringify(theme)
    });

    if (result.error) {
        console.error("Erro ao salvar tema:", result.error);
        showToast("Erro ao salvar o tema.");
        return;
    }

    currentTheme = { ...defaultTheme, ...theme };

    applyTheme(currentTheme);

    closeModal("themeModal");

    showToast("Tema salvo na nuvem!");

}


function resetTheme() {

    if (!adminMode) return;

    currentTheme = { ...defaultTheme };

    applyTheme(currentTheme);

    updateThemeControls();

    showToast("Tema restaurado. Clique em Salvar tema para confirmar.");

}


/* =====================================================
   TEMAS PRONTOS
===================================================== */

function renderThemePresets() {

    const container = document.getElementById("themePresets");

    if (!container) return;

    container.innerHTML = "";

    presetThemes.forEach((preset, index) => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "theme-preset";
        button.title = preset.name;
        button.dataset.index = index;

        const background = preset.gradientEnabled
            ? `linear-gradient(${preset.gradientDirection}, ${preset.gradientStart}, ${preset.gradientEnd})`
            : preset.background;

        button.style.background = background;
        button.style.borderColor = preset.border;

        button.innerHTML = `
            <span class="theme-preset-preview" style="background:${background}; border-color:${preset.border};"></span>
            <span class="theme-preset-name" style="color:${preset.text};">${escapeHTML(preset.name)}</span>
        `;

        button.addEventListener("click", () => applyPresetTheme(preset));

        container.appendChild(button);

    });

}


function applyPresetTheme(preset) {

    if (!adminMode) return;

    const preservedLogo = currentTheme.logoImage || "";
    const preservedRadius = currentTheme.radius;

    currentTheme = {
        ...defaultTheme,
        ...preset,
        logoImage: preservedLogo,
        radius: preservedRadius
    };

    applyTheme(currentTheme);

    updateThemeControls();

    showToast(`"${preset.name}" aplicado. Clique em Salvar tema.`);

}


/* =====================================================
   GRADIENTE
===================================================== */

function updateGradientControls() {

    const enabled = document.getElementById("themeGradientEnabled")?.checked;

    const controls = document.getElementById("gradientControls");

    if (controls) controls.classList.toggle("hidden", !enabled);

}


/* =====================================================
   RANGE LABELS
===================================================== */

function updateRangeLabels() {

    const borderWidth = document.getElementById("themeBorderWidth");
    const borderWidthValue = document.getElementById("themeBorderWidthValue");

    if (borderWidth && borderWidthValue) {
        borderWidthValue.textContent = `${borderWidth.value}px`;
    }

    const fontScale = document.getElementById("themeFontScale");
    const fontScaleValue = document.getElementById("themeFontScaleValue");

    if (fontScale && fontScaleValue) {
        fontScaleValue.textContent = `${Math.round(Number(fontScale.value) * 100)}%`;
    }

    const radius = document.getElementById("themeRadius");
    const radiusValue = document.getElementById("themeRadiusValue");

    if (radius && radiusValue) {
        radiusValue.textContent = `${radius.value}px`;
    }

    updateGradientControls();

}


/* =====================================================
   LOGO
===================================================== */

async function handleLogoUpload(event) {

    if (!adminMode) return;

    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        showToast("Selecione uma imagem válida.");
        return;
    }

    try {

        showToast("Processando logo...");

        const dataURL = await resizeImage(file, 400, 0.85);

        currentTheme.logoImage = dataURL;

        const imageName = document.getElementById("themeLogoImageName");

        if (imageName) imageName.textContent = file.name;

        applyLogo();

        showToast("Logo carregada. Clique em Salvar tema.");

    } catch (error) {

        console.error("Erro ao processar logo:", error);
        showToast("Não foi possível carregar a logo.");

    }

}


function resizeImage(file, maxSize, quality) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onerror = () => reject(new Error("Erro ao ler imagem."));

        reader.onload = () => {

            const image = new Image();

            image.onerror = () => reject(new Error("Imagem inválida."));

            image.onload = () => {

                let width = image.width;
                let height = image.height;

                const scale = Math.min(1, maxSize / Math.max(width, height));

                width = Math.max(1, Math.round(width * scale));
                height = Math.max(1, Math.round(height * scale));

                const canvas = document.createElement("canvas");

                canvas.width = width;
                canvas.height = height;

                const context = canvas.getContext("2d");

                if (!context) {
                    reject(new Error("Canvas não suportado."));
                    return;
                }

                context.clearRect(0, 0, width, height);
                context.drawImage(image, 0, 0, width, height);

                canvas.toBlob(blob => {

                    if (!blob) {
                        reject(new Error("Não foi possível gerar imagem."));
                        return;
                    }

                    const blobReader = new FileReader();

                    blobReader.onload = () => resolve(blobReader.result);
                    blobReader.onerror = () => reject(new Error("Erro ao converter imagem."));

                    blobReader.readAsDataURL(blob);

                }, "image/webp", quality);

            };

            image.src = reader.result;

        };

        reader.readAsDataURL(file);

    });

}


function applyLogo() {

    const image = document.getElementById("siteLogoImage");
    const text = document.getElementById("siteLogoText");

    if (!image || !text) return;

    if (currentTheme.logoImage) {

        image.src = currentTheme.logoImage;
        image.classList.remove("hidden");
        text.classList.add("hidden");

    } else {

        image.removeAttribute("src");
        image.classList.add("hidden");
        text.classList.remove("hidden");

    }

}


function removeLogoImage() {

    if (!adminMode) return;

    currentTheme.logoImage = "";

    const input = document.getElementById("themeLogoImage");

    if (input) input.value = "";

    const name = document.getElementById("themeLogoImageName");

    if (name) name.textContent = "Nenhuma imagem selecionada";

    applyLogo();

    showToast("Logo removida. Clique em Salvar tema.");

}


/* =====================================================
   MODAIS
===================================================== */

function closeModal(id) {

    if (!id) return;

    const modal = document.getElementById(id);

    if (!modal) return;

    modal.classList.add("hidden");

}


function toggleElement(id) {

    const element = document.getElementById(id);

    if (!element) return;

    element.classList.toggle("hidden");

}


function setActiveButton(selector, selected) {

    document.querySelectorAll(selector).forEach(button => {
        button.classList.remove("active");
    });

    if (selected) selected.classList.add("active");

}


/* =====================================================
   GRADIENTE DOS CARDS
===================================================== */

function createCardGradient(color) {

    const first = normalizeColor(color);
    const second = darkenColor(first, 45);

    return `linear-gradient(135deg, ${first}, ${second})`;

}


function darkenColor(hex, amount) {

    const clean = String(hex || "").replace("#", "");

    if (!/^[0-9a-fA-F]{6}$/.test(clean)) return "#333333";

    let r = parseInt(clean.substring(0, 2), 16);
    let g = parseInt(clean.substring(2, 4), 16);
    let b = parseInt(clean.substring(4, 6), 16);

    const safeAmount = Math.max(0, Number(amount) || 0);

    r = Math.max(0, r - safeAmount);
    g = Math.max(0, g - safeAmount);
    b = Math.max(0, b - safeAmount);

    return (
        "#" +
        r.toString(16).padStart(2, "0") +
        g.toString(16).padStart(2, "0") +
        b.toString(16).padStart(2, "0")
    );

}


function normalizeColor(color) {

    const value = String(color || "").trim();

    if (/^#[0-9a-fA-F]{6}$/.test(value)) return value;

    return "#4f7cff";

}


function normalizeURL(url) {

    let value = String(url || "").trim();

    if (!value) return "";

    if (!/^https?:\/\//i.test(value)) {
        value = `https://${value}`;
    }

    return value;

}


function isValidURL(url) {

    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }

}


function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = String(value ?? "");

    return div.innerHTML;

}


function setInput(id, value) {

    const element = document.getElementById(id);

    if (!element) return;

    element.value = value ?? "";

}


function getInputValue(id, fallback) {

    const element = document.getElementById(id);

    if (!element) return fallback;

    return element.value;

}


function showLoading(container) {

    if (!container) return;

    container.innerHTML = `<div class="empty"><div class="empty-icon">⏳</div><p>Carregando...</p></div>`;

}


function showError(container, message) {

    if (!container) return;

    container.innerHTML = `<div class="empty"><div class="empty-icon">⚠️</div><p>${escapeHTML(message)}</p></div>`;

}


function emptyHTML(icon, title, description) {

    return `
        <div class="empty">
            <div class="empty-icon">${icon}</div>
            <h2>${escapeHTML(title)}</h2>
            <p>${escapeHTML(description)}</p>
        </div>
    `;

}


function showToast(message) {

    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);

}
