import { invoke } from "@tauri-apps/api";

function CreateFromTemplate(name: String) {
    invoke("create_from_template", { name: name });
}

document.getElementById("blank")?.addEventListener("click", () => CreateFromTemplate("blank"));