/* =====================================================
   CONFIGURAÇÃO DO SUPABASE
===================================================== */

const SUPABASE_URL = "https://pdjbwcjehmqregimlryq.supabase.co";

const SUPABASE_KEY = "sb_publishable_d-ODS7kpWKsuBVTLYpDcjA_UyT9FEZJ";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* =====================================================
   ESTADO DO SITE
===================================================== */

let folders = [];

let currentFolderId = null;

let adminMode = false;

let currentAdminPassword = "";

let editingFolderId = null;

let editingLinkId = null;


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

const folderTitle =
    document.getElementById("folderTitle");

const adminButton =
    document.getElementById("adminButton");

const logoutButton =
    document.getElementById("logoutButton");


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initialize
);


async function initialize() {

    setupEvents();

    await loadFolders();

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


    /* PASTAS */

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


    /* LINKS */

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


    /* CORES */

    document
        .getElementById("folderColor")
        .addEventListener(
            "input",
            event => {

                document.getElementById(
                    "folderColorValue"
                ).textContent = event.target.value;

            }
        );


    document
        .getElementById("linkColor")
        .addEventListener(
            "input",
            event => {

                document.getElementById(
                    "linkColorValue"
                ).textContent = event.target.value;

            }
        );


    /* BOTÕES DE FECHAR */

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


    /* FECHAR MODAL CLICANDO FORA */

    document
        .querySelectorAll(".modal-overlay")
        .forEach(overlay => {

            overlay.addEventListener(
                "click",
                event => {

                    if (event.target === overlay) {

                        overlay.classList.add(
                            "hidden"
                        );

                    }

                }
            );

        });

}


/* =====================================================
   CARREGAR PASTAS
===================================================== */

async function loadFolders() {

    showLoading(foldersGrid);


    const {
        data,
        error
    } = await supabaseClient
        .from("folders")
        .select("*")
        .order("created_at", {
            ascending: true
        });


    if (error) {

        console.error(
            "Erro ao carregar pastas:",
            error
        );

        showError(
            foldersGrid,
            "Não foi possível carregar as pastas."
        );

        return;

    }


    folders = data || [];

    renderFolders();

}


/* =====================================================
   CARREGAR LINKS
===================================================== */

async function loadLinks(folderId) {

    showLoading(linksGrid);


    const {
        data,
        error
    } = await supabaseClient
        .from("links")
        .select("*")
        .eq("folder_id", folderId)
        .order("created_at", {
            ascending: true
        });


    if (error) {

        console.error(
            "Erro ao carregar links:",
            error
        );

        showError(
            linksGrid,
            "Não foi possível carregar os links."
        );

        return;

    }


    renderLinks(data || []);

}


/* =====================================================
   RENDERIZAR PASTAS
===================================================== */

function renderFolders() {

    if (!folders.length) {

        foldersGrid.innerHTML = emptyHTML(
            "📁",
            "Nenhuma pasta",
            "Crie a primeira pasta para começar."
        );

        return;

    }


    foldersGrid.innerHTML = "";


    folders.forEach(folder => {

        const card =
            document.createElement("div");


        card.className = "card";


        card.style.background =
            makeGradient(folder.color);


        /*
         * Os botões de edição/exclusão
         * só aparecem no modo administrador.
         */

        const actions =
            adminMode
                ? `
                    <div class="card-actions">

                        <button
                            class="card-action"
                            title="Editar pasta"
                            data-action="edit"
                        >
                            ✏️
                        </button>

                        <button
                            class="card-action delete"
                            title="Excluir pasta"
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
                    📁 ${escapeHTML(folder.name)}
                </div>

                <div class="card-description">
                    Abra para ver os links
                </div>

            </div>

            <div class="card-description">
                Clique para entrar
            </div>

        `;


        /*
         * Abrir pasta.
         */

        card.addEventListener(
            "click",
            () => openFolder(folder.id)
        );


        /*
         * Editar.
         */

        if (adminMode) {

            card
                .querySelector(
                    '[data-action="edit"]'
                )
                .addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        openFolderModal(folder);

                    }
                );


            /*
             * Excluir.
             */

            card
                .querySelector(
                    '[data-action="delete"]'
                )
                .addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        deleteFolder(folder);

                    }
                );

        }


        foldersGrid.appendChild(card);

    });

}


/* =====================================================
   RENDERIZAR LINKS
===================================================== */

function renderLinks(links) {

    if (!links.length) {

        linksGrid.innerHTML = emptyHTML(
            "🔗",
            "Nenhum link",
            "Adicione o primeiro link desta pasta."
        );

        return;

    }


    linksGrid.innerHTML = "";


    links.forEach(link => {

        const card =
            document.createElement("div");


        card.className = "card";


        card.style.background =
            makeGradient(link.color);


        const actions =
            adminMode
                ? `
                    <div class="card-actions">

                        <button
                            class="card-action"
                            title="Editar link"
                            data-action="edit"
                        >
                            ✏️
                        </button>

                        <button
                            class="card-action delete"
                            title="Excluir link"
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


        /*
         * Abrir link.
         */

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

            /*
             * Editar link.
             */

            card
                .querySelector(
                    '[data-action="edit"]'
                )
                .addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        openLinkModal(link);

                    }
                );


            /*
             * Excluir link.
             */

            card
                .querySelector(
                    '[data-action="delete"]'
                )
                .addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        deleteLink(link);

                    }
                );

        }


        linksGrid.appendChild(card);

    });

}


/* =====================================================
   ABRIR PASTA
===================================================== */

async function openFolder(folderId) {

    const folder =
        folders.find(
            item => item.id === folderId
        );


    if (!folder) {
        return;
    }


    currentFolderId = folderId;


    folderTitle.textContent =
        `📁 ${folder.name}`;


    homePage.classList.add(
        "hidden"
    );


    folderPage.classList.remove(
        "hidden"
    );


    await loadLinks(folderId);

}


/* =====================================================
   VOLTAR PARA HOME
===================================================== */

function showHome() {

    currentFolderId = null;


    folderPage.classList.add(
        "hidden"
    );


    homePage.classList.remove(
        "hidden"
    );


    renderFolders();

}


/* =====================================================
   LOGIN ADMINISTRADOR
===================================================== */

async function loginAdmin() {

    const password =
        document
            .getElementById("adminPassword")
            .value
            .trim();


    if (!password) {

        document
            .getElementById("adminError")
            .textContent =
                "Digite a senha.";

        return;

    }


    const {
        data,
        error
    } = await supabaseClient.rpc(
        "check_admin_password",
        {
            p_password: password
        }
    );


    if (error) {

        console.error(
            "Erro ao verificar senha:",
            error
        );


        document
            .getElementById("adminError")
            .textContent =
                "Erro ao verificar a senha.";

        return;

    }


    if (data !== true) {

        document
            .getElementById("adminError")
            .textContent =
                "Senha incorreta.";

        return;

    }


    /*
     * A senha fica somente na memória
     * enquanto esta página estiver aberta.
     */

    currentAdminPassword = password;

    adminMode = true;


    closeModal(
        "adminModal"
    );


    adminButton.classList.add(
        "hidden"
    );


    logoutButton.classList.remove(
        "hidden"
    );


    if (currentFolderId) {

        await loadLinks(
            currentFolderId
        );

    } else {

        renderFolders();

    }


    showToast(
        "Modo administrador ativado."
    );

}


/* =====================================================
   ABRIR MODAL DE ADMIN
===================================================== */

function openAdminModal() {

    const modal =
        document.getElementById(
            "adminModal"
        );


    modal.classList.remove(
        "hidden"
    );


    document
        .getElementById("adminPassword")
        .value = "";


    document
        .getElementById("adminError")
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


/* =====================================================
   SAIR DO ADMIN
===================================================== */

function logoutAdmin() {

    adminMode = false;

    currentAdminPassword = "";


    adminButton.classList.remove(
        "hidden"
    );


    logoutButton.classList.add(
        "hidden"
    );


    if (currentFolderId) {

        loadLinks(
            currentFolderId
        );

    } else {

        renderFolders();

    }


    showToast(
        "Você saiu do modo administrador."
    );

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


    document
        .getElementById("folderModal")
        .classList.remove(
            "hidden"
        );

}


/* =====================================================
   SALVAR PASTA
===================================================== */

async function saveFolder() {

    const name =
        document
            .getElementById("folderName")
            .value
            .trim();


    const color =
        document
            .getElementById("folderColor")
            .value;


    if (!name) {

        showToast(
            "Digite um nome para a pasta."
        );

        return;

    }


    let result;


    /*
     * EDIÇÃO
     */

    if (editingFolderId) {

        if (!adminMode) {

            showToast(
                "Você precisa estar no modo administrador."
            );

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

    }


    /*
     * CRIAÇÃO
     */

    else {

        result =
            await supabaseClient
                .from("folders")
                .insert({
                    name: name,
                    color: color
                });

    }


    if (result.error) {

        console.error(
            "Erro ao salvar pasta:",
            result.error
        );


        showToast(
            "Não foi possível salvar a pasta."
        );

        return;

    }


    closeModal(
        "folderModal"
    );


    editingFolderId = null;


    await loadFolders();


    showToast(
        "Pasta salva com sucesso."
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
            `Excluir a pasta "${folder.name}" e todos os links dentro dela?`
        );


    if (!confirmed) {

        return;

    }


    const {
        error
    } = await supabaseClient.rpc(
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
            "Erro ao excluir pasta:",
            error
        );


        showToast(
            "Não foi possível excluir a pasta."
        );

        return;

    }


    await loadFolders();


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


    document
        .getElementById("linkModal")
        .classList.remove(
            "hidden"
        );

}


/* =====================================================
   SALVAR LINK
===================================================== */

async function saveLink() {

    const name =
        document
            .getElementById("linkName")
            .value
            .trim();


    let url =
        document
            .getElementById("linkUrl")
            .value
            .trim();


    const color =
        document
            .getElementById("linkColor")
            .value;


    if (!name || !url) {

        showToast(
            "Preencha o nome e o link."
        );

        return;

    }


    /*
     * Adiciona https:// automaticamente
     * quando o usuário não colocar.
     */

    if (
        !url.startsWith("http://") &&
        !url.startsWith("https://")
    ) {

        url =
            "https://" + url;

    }


    let result;


    /*
     * EDIÇÃO
     */

    if (editingLinkId) {

        if (!adminMode) {

            showToast(
                "Você precisa estar no modo administrador."
            );

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

    }


    /*
     * CRIAÇÃO
     */

    else {

        if (!currentFolderId) {

            showToast(
                "Nenhuma pasta selecionada."
            );

            return;

        }


        result =
            await supabaseClient
                .from("links")
                .insert({
                    folder_id:
                        currentFolderId,

                    name:
                        name,

                    url:
                        url,

                    color:
                        color
                });

    }


    if (result.error) {

        console.error(
            "Erro ao salvar link:",
            result.error
        );


        showToast(
            "Não foi possível salvar o link."
        );

        return;

    }


    closeModal(
        "linkModal"
    );


    editingLinkId = null;


    await loadLinks(
        currentFolderId
    );


    showToast(
        "Link salvo com sucesso."
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
            `Excluir o link "${link.name}"?`
        );


    if (!confirmed) {

        return;

    }


    const {
        error
    } = await supabaseClient.rpc(
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
            "Erro ao excluir link:",
            error
        );


        showToast(
            "Não foi possível excluir o link."
        );

        return;

    }


    await loadLinks(
        currentFolderId
    );


    showToast(
        "Link excluído."
    );

}


/* =====================================================
   FECHAR MODAL
===================================================== */

function closeModal(
    id
) {

    document
        .getElementById(id)
        .classList.add(
            "hidden"
        );

}


/* =====================================================
   GRADIENTE DOS CARDS
===================================================== */

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


/* =====================================================
   ESCURECER COR
===================================================== */

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


/* =====================================================
   PROTEÇÃO CONTRA HTML
===================================================== */

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


/* =====================================================
   ESTADO VAZIO
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
                ${title}
            </h2>

            <p>
                ${description}
            </p>

        </div>

    `;

}


/* =====================================================
   CARREGANDO
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


/* =====================================================
   ERRO
===================================================== */

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
                Ocorreu um erro
            </h2>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>

    `;

}


/* =====================================================
   TOAST
===================================================== */

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
