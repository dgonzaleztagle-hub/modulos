const state = {
  registry: null,
  view: "overview",
  query: "",
  activeKey: "",
};

const searchInput = document.querySelector("#search-input");
const viewTabs = document.querySelector("#view-tabs");
const listContent = document.querySelector("#list-content");
const detailContent = document.querySelector("#detail-content");
const listTitle = document.querySelector("#list-title");
const listCopy = document.querySelector("#list-copy");
const heroCopy = document.querySelector("#hero-copy");
const stats = document.querySelector("#stats");
const overviewPanel = document.querySelector("#overview-panel");
const overviewGrid = document.querySelector("#overview-grid");
const stackPanel = document.querySelector("#stack-panel");
const builderPanel = document.querySelector("#builder-panel");
const searchSpotlight = document.querySelector("#search-spotlight");
const searchTitle = document.querySelector("#search-title");
const searchCopy = document.querySelector("#search-copy");
const searchPreview = document.querySelector("#search-preview");
const clearSearchButton = document.querySelector("#clear-search-button");
const builderBlueprint = document.querySelector("#builder-blueprint");
const builderCapabilities = document.querySelector("#builder-capabilities");
const builderSummary = document.querySelector("#builder-summary");
const builderBrief = document.querySelector("#builder-brief");
const copyBriefButton = document.querySelector("#copy-brief-button");
const gridLayout = document.querySelector(".grid-layout");

document.querySelectorAll("[data-blueprint]").forEach((button) => {
  button.addEventListener("click", () => {
    const blueprintId = button.getAttribute("data-blueprint");
    state.view = "blueprints";
    selectBlueprint(blueprintId);
  });
});

builderBlueprint.addEventListener("change", () => {
  state.activeKey = "";
  renderBuilder();
});

copyBriefButton.addEventListener("click", async () => {
  if (!builderBrief.value) return;

  try {
    await navigator.clipboard.writeText(builderBrief.value);
    copyBriefButton.textContent = "Brief copiado";
    setTimeout(() => {
      copyBriefButton.textContent = "Copiar brief";
    }, 1200);
  } catch {
    copyBriefButton.textContent = "No se pudo copiar";
    setTimeout(() => {
      copyBriefButton.textContent = "Copiar brief";
    }, 1200);
  }
});

searchInput.addEventListener("input", () => {
  state.query = searchInput.value.trim().toLowerCase();
  state.activeKey = "";
  render();
});

viewTabs.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    state.view = button.dataset.view || "overview";
    state.activeKey = "";
    render();
  });
});

clearSearchButton.addEventListener("click", () => {
  state.query = "";
  searchInput.value = "";
  state.activeKey = "";
  render();
});

init().catch((error) => {
  heroCopy.textContent = `No pude cargar el registry: ${error.message}`;
});

async function init() {
  const response = await fetch("/registry/modulos-registry.json");
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  state.registry = normalizeRegistry(await response.json());
  heroCopy.textContent =
    "El explorer ya se alimenta del registry central y muestra piezas, stacks y casos sin reabrir cada repo fuente.";
  renderBuilderControls();
  renderStats();
  render();
}

function renderStats() {
  const { modules, blueprints, cases } = state.registry;
  const hardened = modules.filter((item) => item.status.includes("endurecido")).length;
  const markup = [
    statCard(modules.length, "módulos"),
    statCard(blueprints.length, "blueprints"),
    statCard(cases.length, "casos"),
    statCard(hardened, "endurecidos"),
  ].join("");
  stats.innerHTML = markup;
}

function render() {
  if (!state.registry) return;

  syncViewTabs();
  renderBuilder();
  renderOverviewPanel();

  if (shouldShowOverview()) {
    toggleBuilderVisibility(false);
    searchSpotlight.hidden = true;
    stackPanel.className = "stack-panel";
    stackPanel.innerHTML = "";
    gridLayout.hidden = true;
    return;
  }

  const collection = resolveCollection();
  renderSearchSpotlight(collection);
  gridLayout.hidden = false;
  renderList(collection);
  renderDefaultDetail(collection);
}

function resolveCollection() {
  const { modules, blueprints, cases } = state.registry;

  if (state.view === "modules") {
    toggleBuilderVisibility(false);
    listTitle.textContent = "Módulos";
    listCopy.textContent = "Piezas técnicas reutilizables y su estado actual.";
    return filterItems(modules, moduleSearchText);
  }

  if (state.view === "blueprints") {
    toggleBuilderVisibility(false);
    listTitle.textContent = "Blueprints";
    listCopy.textContent = "Recetas por vertical para decidir qué stack conviene.";
    return filterItems(blueprints, blueprintSearchText);
  }

  if (state.view === "cases") {
    toggleBuilderVisibility(false);
    listTitle.textContent = "Casos";
    listCopy.textContent = "Soluciones reales ya ensambladas y útiles como referencia.";
    return filterItems(cases, caseSearchText);
  }

  if (state.view === "builder") {
    toggleBuilderVisibility(!hasActiveQuery());
    listTitle.textContent = "Stack sugerido";
    listCopy.textContent = "Usa el builder y luego inspecciona las piezas sugeridas.";
    return buildBuilderCollection();
  }

  toggleBuilderVisibility(!hasActiveQuery());
  listTitle.textContent = hasActiveQuery() ? "Resultados" : "Resumen";
  listCopy.textContent = hasActiveQuery()
    ? `Coincidencias visibles para "${state.query}".`
    : "Vista general del sistema: categorías, stacks y referencias principales.";

  const overviewItems = [
    ...blueprints.map((item) => ({ type: "blueprint", payload: item })),
    ...cases.map((item) => ({ type: "case", payload: item })),
    ...modules.map((item) => ({ type: "module", payload: item })),
  ];

  return filterItems(overviewItems, overviewSearchText);
}

function renderList(items) {
  if (items.length === 0) {
    listContent.innerHTML = `<div class="list-item"><p>No encontré resultados con ese filtro.</p></div>`;
    detailContent.className = "detail-content empty";
    detailContent.innerHTML = "<p>Ajusta la búsqueda o cambia de vista.</p>";
    stackPanel.className = "stack-panel";
    stackPanel.innerHTML = "";
    return;
  }

  listContent.innerHTML = items.map(renderListItem).join("");

  listContent.querySelectorAll(".list-item").forEach((element) => {
    element.addEventListener("click", () => {
      const key = element.dataset.key;
      state.activeKey = key;
      renderSelection(findByKey(key));
      listContent.querySelectorAll(".list-item").forEach((item) => item.classList.remove("active"));
      element.classList.add("active");
    });
  });
}

function renderDefaultDetail(items) {
  if (state.view === "builder" && !hasActiveQuery()) {
    detailContent.className = "detail-content empty";
    detailContent.innerHTML = "<p>Usa el Stack Builder para generar una propuesta y luego abre un módulo, caso o blueprint sugerido.</p>";
    stackPanel.className = "stack-panel";
    stackPanel.innerHTML = "";
    return;
  }

  if (state.activeKey) {
    const current = findByKey(state.activeKey);
    if (current) {
      renderSelection(current);
      const activeNode = listContent.querySelector(`[data-key="${CSS.escape(state.activeKey)}"]`);
      activeNode?.classList.add("active");
      return;
    }
  }

  if (hasActiveQuery() && items.length > 0) {
    const firstKey = normalizeItem(items[0]).key;
    state.activeKey = firstKey;
    renderSelection(findByKey(firstKey));
    const activeNode = listContent.querySelector(`[data-key="${CSS.escape(firstKey)}"]`);
    activeNode?.classList.add("active");
    return;
  }

  stackPanel.className = "stack-panel";
  stackPanel.innerHTML = "";
  detailContent.className = "detail-content empty";
  detailContent.innerHTML = "<p>Selecciona algo a la izquierda para ver relaciones, fuentes y rutas.</p>";
}

function renderSelection(selection) {
  if (!selection) return;

  if (selection.kind === "blueprint") {
    renderBlueprintDetail(selection.item);
    return;
  }

  if (selection.kind === "case") {
    renderCaseDetail(selection.item);
    return;
  }

  renderModuleDetail(selection.item);
}

function renderBuilderControls() {
  const options = state.registry.blueprints.map((blueprint) =>
    `<option value="${escapeAttribute(blueprint.id)}">${escapeHtml(blueprint.id)}</option>`,
  ).join("");
  builderBlueprint.innerHTML = options;

  const capabilities = collectCapabilities();
  builderCapabilities.innerHTML = capabilities.map((capability) =>
    `<button class="capability-toggle" type="button" data-capability="${escapeAttribute(capability)}">${escapeHtml(capability)}</button>`,
  ).join("");

  builderCapabilities.querySelectorAll(".capability-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("active");
      state.activeKey = "";
      renderBuilder();
      if (state.view === "builder") {
        render();
      }
    });
  });
}

function renderBuilder() {
  if (!state.registry) return;

  const blueprint = resolveBuilderBlueprint();
  if (!blueprint) return;

  syncQuickActionState(blueprint.id);

  const selectedCapabilities = getSelectedCapabilities();
  const suggestedModules = resolveBuilderModules(blueprint, selectedCapabilities);
  const suggestedCases = resolveBuilderCases(blueprint, selectedCapabilities);
  const gaps = resolveBuilderGaps(blueprint, selectedCapabilities, suggestedModules);
  const brief = buildTechnicalBrief(blueprint, selectedCapabilities, suggestedModules, suggestedCases, gaps);

  builderSummary.innerHTML = `
    <div class="builder-banner">
      <strong>${escapeHtml(blueprint.id)}</strong>
      <span class="muted">${escapeHtml(blueprint.description)}</span>
    </div>
    <div class="builder-summary-grid">
      <article class="builder-card">
        <h4>Módulos sugeridos</h4>
        <ul>${suggestedModules.map((item) => `<li>${escapeHtml(item.id)}</li>`).join("")}</ul>
      </article>
      <article class="builder-card">
        <h4>Casos cercanos</h4>
        <ul>${suggestedCases.length > 0 ? suggestedCases.map((item) => `<li>${escapeHtml(item.id)}</li>`).join("") : "<li>No hay caso claro todavía.</li>"}</ul>
      </article>
      <article class="builder-card">
        <h4>Capacidades activas</h4>
        <div class="detail-meta">${[...new Set([...blueprint.capabilities, ...selectedCapabilities])].map((item) => badge(item, "neutral")).join("")}</div>
      </article>
      <article class="builder-card">
        <h4>Puntos a revisar</h4>
        <ul>${gaps.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>
    </div>
  `;
  builderBrief.value = brief;
}

function renderOverviewPanel() {
  const visible = shouldShowOverview();
  overviewPanel.hidden = !visible;

  if (!visible) {
    return;
  }

  const blueprintCards = state.registry.blueprints.slice(0, 4).map((item) => `
    <article class="overview-card" data-overview-key="blueprint:${escapeAttribute(item.id)}">
      <p class="eyebrow">Stack</p>
      <strong>${escapeHtml(item.id)}</strong>
      <p class="muted">${escapeHtml(item.description)}</p>
      <div class="detail-meta">${item.capabilities.slice(0, 4).map((capability) => badge(capability, "neutral")).join("")}</div>
    </article>
  `).join("");

  const caseCards = state.registry.cases.slice(0, 3).map((item) => `
    <article class="overview-card" data-overview-key="case:${escapeAttribute(item.id)}">
      <p class="eyebrow">Caso real</p>
      <strong>${escapeHtml(item.id)}</strong>
      <p class="muted">${escapeHtml(item.project_type)}</p>
      <ul>${ensureArray(item.tags).slice(0, 3).map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>
    </article>
  `).join("");

  const categoryCards = summarizeModuleCategories().slice(0, 3).map((item) => `
    <article class="overview-card" data-view-jump="modules" data-query-jump="${escapeAttribute(item.label.toLowerCase())}">
      <p class="eyebrow">Familia</p>
      <strong>${escapeHtml(item.label)}</strong>
      <p class="muted">${item.count} módulo(s) catalogados.</p>
      <ul>${item.examples.map((example) => `<li>${escapeHtml(example)}</li>`).join("")}</ul>
    </article>
  `).join("");

  overviewGrid.innerHTML = `${blueprintCards}${caseCards}${categoryCards}`;

  overviewGrid.querySelectorAll("[data-overview-key]").forEach((element) => {
    element.addEventListener("click", () => {
      const key = element.dataset.overviewKey;
      if (!key) return;
      const [kind] = key.split(":");
      state.view = kind === "blueprint" ? "blueprints" : kind === "case" ? "cases" : "modules";
      state.activeKey = key;
      render();
    });
  });

  overviewGrid.querySelectorAll("[data-view-jump]").forEach((element) => {
    element.addEventListener("click", () => {
      state.view = element.dataset.viewJump || "modules";
      state.query = (element.dataset.queryJump || "").toLowerCase();
      searchInput.value = state.query;
      state.activeKey = "";
      render();
    });
  });
}

function renderSearchSpotlight(items) {
  const queryActive = hasActiveQuery();
  searchSpotlight.hidden = !queryActive;
  gridLayout.classList.toggle("results-mode", queryActive);

  if (!queryActive) {
    searchPreview.innerHTML = "";
    return;
  }

  const count = items.length;
  searchTitle.textContent = `Resultados para "${state.query}"`;
  searchCopy.textContent = count > 0
    ? `${count} coincidencia(s). Te dejo las más relevantes arriba para que no tengas que bajar hasta la lista gigante.`
    : "No encontré coincidencias con esa búsqueda.";

  const previewItems = items.slice(0, 4);
  searchPreview.innerHTML = previewItems.length > 0
    ? previewItems.map((item) => {
        const normalized = normalizeItem(item);
        return `
          <article class="search-preview-card" data-key="${escapeAttribute(normalized.key)}">
            <div class="detail-meta">${normalized.badges.join("")}</div>
            <strong>${escapeHtml(normalized.title)}</strong>
            <p class="muted">${escapeHtml(normalized.subtitle)}</p>
          </article>
        `;
      }).join("")
    : `<div class="search-preview-card"><strong>Sin resultados</strong><p class="muted">Prueba con otro término o cambia la vista.</p></div>`;

  searchPreview.querySelectorAll(".search-preview-card[data-key]").forEach((element) => {
    element.addEventListener("click", () => {
      const key = element.dataset.key;
      state.activeKey = key;
      renderSelection(findByKey(key));
      const activeNode = listContent.querySelector(`[data-key="${CSS.escape(key)}"]`);
      listContent.querySelectorAll(".list-item").forEach((item) => item.classList.remove("active"));
      activeNode?.classList.add("active");
      activeNode?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });
}

function buildBuilderCollection() {
  const blueprint = resolveBuilderBlueprint();
  if (!blueprint) return [];

  const selectedCapabilities = getSelectedCapabilities();
  const modules = resolveBuilderModules(blueprint, selectedCapabilities).map((item) => ({ type: "module", payload: item }));
  const cases = resolveBuilderCases(blueprint, selectedCapabilities).map((item) => ({ type: "case", payload: item }));
  const header = [{ type: "blueprint", payload: blueprint }];

  return filterItems([...header, ...cases, ...modules], overviewSearchText);
}

function renderBlueprintDetail(blueprint) {
  const modules = blueprint.recommended_modules
    .map((id) => state.registry.modules.find((item) => item.id === id))
    .filter(Boolean);
  const cases = blueprint.reference_cases
    .map((id) => state.registry.cases.find((item) => item.id === id))
    .filter(Boolean);

  stackPanel.className = "stack-panel visible";
  stackPanel.innerHTML = `
    <p class="eyebrow">Stack sugerido</p>
    <h3>${escapeHtml(blueprint.id)}</h3>
    <p class="muted">${escapeHtml(blueprint.description)}</p>
    <div class="stack-grid">
      ${modules.map((item) => `
        <article class="stack-card">
          <div class="detail-meta">
            ${badge(item.status)}
            ${badge(item.category, "neutral")}
          </div>
          <h4>${escapeHtml(item.id)}</h4>
          <p class="muted">${escapeHtml(item.capabilities.join(" · "))}</p>
        </article>
      `).join("")}
    </div>
  `;

  detailContent.className = "detail-content";
  detailContent.innerHTML = `
    <section>
      <h4>${escapeHtml(blueprint.id)}</h4>
      <p>${escapeHtml(blueprint.description)}</p>
      <div class="detail-meta">${blueprint.capabilities.map((item) => badge(item, "neutral")).join("")}</div>
    </section>
    <section>
      <h4>Módulos recomendados</h4>
      <ul>${modules.map((item) => `<li>${escapeHtml(item.id)}</li>`).join("")}</ul>
    </section>
    <section>
      <h4>Casos de referencia</h4>
      <ul>${cases.length > 0 ? cases.map((item) => `<li>${escapeHtml(item.id)}</li>`).join("") : "<li>No hay casos asociados todavía.</li>"}</ul>
    </section>
    <section>
      <h4>Ruta</h4>
      <div class="detail-links">
        <a href="/${escapeAttribute(blueprint.path)}" target="_blank" rel="noreferrer">Abrir blueprint</a>
      </div>
    </section>
  `;
}

function renderCaseDetail(item) {
  const modules = item.modules
    .map((id) => state.registry.modules.find((module) => module.id === id))
    .filter(Boolean);

  stackPanel.className = "stack-panel visible";
  stackPanel.innerHTML = `
    <p class="eyebrow">Caso real</p>
    <h3>${escapeHtml(item.id)}</h3>
    <p class="muted">Combinación ya usada para ${escapeHtml(item.project_type)}.</p>
    <div class="stack-grid">
      ${modules.map((module) => `
        <article class="stack-card">
          <h4>${escapeHtml(module.id)}</h4>
          <p class="muted">${escapeHtml(module.category)}</p>
        </article>
      `).join("")}
    </div>
  `;

  detailContent.className = "detail-content";
  detailContent.innerHTML = `
    <section>
      <h4>${escapeHtml(item.id)}</h4>
      <p>Proyecto tipo <strong>${escapeHtml(item.project_type)}</strong>.</p>
      <div class="detail-meta">${item.tags.map((tag) => badge(tag, "neutral")).join("")}</div>
    </section>
    <section>
      <h4>Repos de origen</h4>
      <ul>${item.source_repos.map((repo) => `<li>${escapeHtml(repo)}</li>`).join("")}</ul>
    </section>
    <section>
      <h4>Módulos usados</h4>
      <ul>${item.modules.map((module) => `<li>${escapeHtml(module)}</li>`).join("")}</ul>
    </section>
    <section>
      <h4>Ruta</h4>
      <div class="detail-links">
        <a href="/${escapeAttribute(item.path)}" target="_blank" rel="noreferrer">Abrir caso</a>
      </div>
    </section>
  `;
}

function renderModuleDetail(item) {
  stackPanel.className = "stack-panel";
  stackPanel.innerHTML = "";

  const relatedBlueprints = state.registry.blueprints.filter((blueprint) =>
    blueprint.recommended_modules.includes(item.id),
  );
  const relatedCases = state.registry.cases.filter((entry) =>
    entry.modules.includes(item.id),
  );

  detailContent.className = "detail-content";
  detailContent.innerHTML = `
    <section>
      <div class="detail-meta">
        ${badge(item.status)}
        ${badge(item.category, "neutral")}
      </div>
      <h4>${escapeHtml(item.id)}</h4>
      <p>Fuente principal: ${escapeHtml(item.source_repos.join(", "))}</p>
    </section>
    <section>
      <h4>Capacidades</h4>
      <div class="detail-meta">${item.capabilities.map((capability) => badge(capability, "neutral")).join("")}</div>
    </section>
    <section>
      <h4>Relación con blueprints</h4>
      <ul>${relatedBlueprints.length > 0 ? relatedBlueprints.map((blueprint) => `<li>${escapeHtml(blueprint.id)}</li>`).join("") : "<li>No asociado todavía.</li>"}</ul>
    </section>
    <section>
      <h4>Relación con casos</h4>
      <ul>${relatedCases.length > 0 ? relatedCases.map((entry) => `<li>${escapeHtml(entry.id)}</li>`).join("") : "<li>No asociado todavía.</li>"}</ul>
    </section>
    <section>
      <h4>Ruta</h4>
      <div class="detail-links">
        <a href="/${escapeAttribute(item.path)}" target="_blank" rel="noreferrer">Abrir fuente</a>
      </div>
    </section>
  `;
}

function renderListItem(item) {
  const normalized = normalizeItem(item);
  return `
    <article class="list-item" data-key="${escapeAttribute(normalized.key)}">
      <div class="list-item-top">
        <strong>${escapeHtml(normalized.title)}</strong>
        ${normalized.badges.join("")}
      </div>
      <p class="muted">${escapeHtml(normalized.subtitle)}</p>
    </article>
  `;
}

function normalizeItem(item) {
  if (item.type === "blueprint") {
    return {
      key: `blueprint:${item.payload.id}`,
      title: item.payload.id,
      subtitle: `${item.payload.capabilities.join(" · ")}`,
      badges: [badge("blueprint", "neutral")],
    };
  }

  if (item.type === "case") {
    return {
      key: `case:${item.payload.id}`,
      title: item.payload.id,
      subtitle: `${item.payload.project_type} · ${item.payload.tags.join(" · ")}`,
      badges: [badge("caso", "neutral")],
    };
  }

  if (item.type === "module") {
    return {
      key: `module:${item.payload.id}`,
      title: item.payload.id,
      subtitle: `${item.payload.category} · ${item.payload.capabilities.join(" · ")}`,
      badges: [badge(item.payload.status)],
    };
  }

  if (state.view === "blueprints") {
    return {
      key: `blueprint:${item.id}`,
      title: item.id,
      subtitle: `${item.capabilities.join(" · ")}`,
      badges: [badge("blueprint", "neutral")],
    };
  }

  if (state.view === "cases") {
    return {
      key: `case:${item.id}`,
      title: item.id,
      subtitle: `${item.project_type} · ${item.tags.join(" · ")}`,
      badges: [badge("caso", "neutral")],
    };
  }

  return {
    key: `module:${item.id}`,
    title: item.id,
    subtitle: `${item.category} · ${item.capabilities.join(" · ")}`,
    badges: [badge(item.status)],
  };
}

function findByKey(key) {
  const [kind, id] = key.split(":");
  if (kind === "blueprint") return { kind, item: state.registry.blueprints.find((entry) => entry.id === id) };
  if (kind === "case") return { kind, item: state.registry.cases.find((entry) => entry.id === id) };
  return { kind: "module", item: state.registry.modules.find((entry) => entry.id === id) };
}

function filterItems(items, projector) {
  if (!state.query) return items;
  return items.filter((item) => projector(item).includes(state.query));
}

function moduleSearchText(item) {
  return [item.id, item.status, item.category, item.capabilities.join(" "), item.source_repos.join(" ")].join(" ").toLowerCase();
}

function blueprintSearchText(item) {
  return [item.id, item.description, item.capabilities.join(" "), item.recommended_modules.join(" ")].join(" ").toLowerCase();
}

function caseSearchText(item) {
  return [item.id, item.project_type, item.tags.join(" "), item.modules.join(" "), item.source_repos.join(" ")].join(" ").toLowerCase();
}

function overviewSearchText(item) {
  if (item.type === "module") return moduleSearchText(item.payload);
  if (item.type === "blueprint") return blueprintSearchText(item.payload);
  return caseSearchText(item.payload);
}

function selectBlueprint(blueprintId) {
  const candidate = state.registry.blueprints.find((item) => item.id === blueprintId);
  if (!candidate) return;
  builderBlueprint.value = blueprintId;
  state.activeKey = `blueprint:${blueprintId}`;
  renderBuilder();
  render();
}

function resolveBuilderBlueprint() {
  const selectedId = builderBlueprint.value || state.registry.blueprints[0]?.id;
  return state.registry.blueprints.find((item) => item.id === selectedId);
}

function collectCapabilities() {
  return [...new Set(state.registry.blueprints.flatMap((item) => item.capabilities))].sort();
}

function getSelectedCapabilities() {
  return [...builderCapabilities.querySelectorAll(".capability-toggle.active")]
    .map((element) => element.dataset.capability)
    .filter(Boolean);
}

function resolveBuilderModules(blueprint, selectedCapabilities) {
  const direct = blueprint.recommended_modules
    .map((id) => state.registry.modules.find((item) => item.id === id))
    .filter(Boolean);

  const expanded = state.registry.modules.filter((module) =>
    selectedCapabilities.some((capability) =>
      module.capabilities.includes(capability) ||
      module.used_in_blueprints.includes(blueprint.id),
    ),
  );

  return uniqueById([...direct, ...expanded]).sort((a, b) => a.id.localeCompare(b.id));
}

function resolveBuilderCases(blueprint, selectedCapabilities) {
  const direct = blueprint.reference_cases
    .map((id) => state.registry.cases.find((item) => item.id === id))
    .filter(Boolean);

  const expanded = state.registry.cases.filter((entry) =>
    selectedCapabilities.some((capability) => entry.tags.includes(capability)) ||
    entry.project_type === blueprint.id,
  );

  return uniqueById([...direct, ...expanded]).sort((a, b) => a.id.localeCompare(b.id));
}

function resolveBuilderGaps(blueprint, selectedCapabilities, modules) {
  const messages = [];

  if (selectedCapabilities.length === 0) {
    messages.push("Activa capacidades extra si este cliente tiene necesidades fuera del blueprint base.");
  }

  const notHardened = modules.filter((item) => !item.status.includes("endurecido"));
  if (notHardened.length > 0) {
    messages.push(`${notHardened.length} módulo(s) siguen en usable inicial y podrían requerir adaptación.`);
  }

  if (blueprint.id === "restaurante") {
    messages.push("Separar branding, operación food y delivery antes de tocar UI final.");
  }

  if (selectedCapabilities.includes("pagos")) {
    messages.push("Confirmar si basta Mercado Pago o si se necesita otro provider/adaptador.");
  }

  if (selectedCapabilities.includes("delivery")) {
    messages.push("Revisar tracking, pricing y notificaciones como bloque conjunto.");
  }

  return messages.length > 0
    ? messages
    : ["El stack base se ve consistente para arrancar sin volver a explorar todos los repos."];
}

function uniqueById(items) {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}

function toggleBuilderVisibility(visible) {
  builderPanel.style.display = visible ? "block" : "none";
}

function hasActiveQuery() {
  return state.query.length > 0;
}

function shouldShowOverview() {
  return state.view === "overview" && !hasActiveQuery();
}

function syncViewTabs() {
  viewTabs.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === state.view);
  });
}

function summarizeModuleCategories() {
  const grouped = new Map();

  state.registry.modules.forEach((module) => {
    const key = module.category;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key).push(module.id);
  });

  return Array.from(grouped.entries())
    .map(([label, moduleIds]) => ({
      label,
      count: moduleIds.length,
      examples: moduleIds.slice(0, 3),
    }))
    .sort((left, right) => right.count - left.count);
}

function syncQuickActionState(activeBlueprintId) {
  document.querySelectorAll("[data-blueprint]").forEach((button) => {
    button.classList.toggle("active", button.getAttribute("data-blueprint") === activeBlueprintId);
  });
}

function buildTechnicalBrief(blueprint, selectedCapabilities, modules, cases, gaps) {
  const allCapabilities = [...new Set([...blueprint.capabilities, ...selectedCapabilities])];
  const hardened = modules.filter((item) => item.status.includes("endurecido")).map((item) => item.id);
  const adaptable = modules.filter((item) => !item.status.includes("endurecido")).map((item) => item.id);

  return [
    `STACK_NAME: stack-${blueprint.id}`,
    `STACK_BASE: ${blueprint.id}`,
    `OBJECTIVE: ${blueprint.description}`,
    ``,
    `ACTIVE_CAPABILITIES:`,
    ...allCapabilities.map((item) => `- ${item}`),
    ``,
    `RECOMMENDED_MODULES:`,
    ...modules.map((item) => `- ${item.id} :: ${item.status} :: ${item.category}`),
    ``,
    `REFERENCE_CASES:`,
    ...(cases.length > 0 ? cases.map((item) => `- ${item.id} :: ${item.project_type}`) : ["- none"]),
    ``,
    `HARDENED_NOW:`,
    ...(hardened.length > 0 ? hardened.map((item) => `- ${item}`) : ["- none"]),
    ``,
    `REQUIRES_ADAPTATION:`,
    ...(adaptable.length > 0 ? adaptable.map((item) => `- ${item}`) : ["- none"]),
    ``,
    `OPERATIONAL_NOTES:`,
    ...gaps.map((item) => `- ${item}`),
  ].join("\n");
}

function badge(label, variant = "green") {
  const className = variant === "neutral"
    ? "chip chip-neutral"
    : label.includes("referencia final")
      ? "chip chip-neutral"
    : label.includes("endurecido")
      ? "chip chip-orange"
      : "chip chip-green";
  return `<span class="${className}">${escapeHtml(label)}</span>`;
}

function statCard(value, label) {
  return `<div class="stat"><strong>${value}</strong><span class="muted">${escapeHtml(label)}</span></div>`;
}

function normalizeRegistry(registry) {
  return {
    ...registry,
    blueprints: ensureArray(registry.blueprints).map(normalizeBlueprint),
    cases: ensureArray(registry.cases).map(normalizeCase),
    modules: ensureArray(registry.modules).map(normalizeModule),
  };
}

function normalizeBlueprint(item) {
  return {
    ...item,
    id: String(item?.id || "blueprint-sin-id"),
    path: String(item?.path || ""),
    description: String(item?.description || ""),
    capabilities: ensureArray(item?.capabilities).map(String),
    recommended_modules: ensureArray(item?.recommended_modules).map(String),
    reference_cases: ensureArray(item?.reference_cases).map(String),
  };
}

function normalizeCase(item) {
  return {
    ...item,
    id: String(item?.id || "caso-sin-id"),
    path: String(item?.path || ""),
    project_type: String(item?.project_type || "caso"),
    source_repos: ensureArray(item?.source_repos).map(String),
    modules: ensureArray(item?.modules).map(String),
    tags: ensureArray(item?.tags).map(String),
  };
}

function normalizeModule(item) {
  const status = String(item?.status || item?.maturity || "usable inicial");
  const category = String(item?.category || item?.taxonomy || "sin categoria");
  const sourceRepos = ensureArray(item?.source_repos).map(String);
  const capabilities = ensureArray(item?.capabilities).map(String);
  const usedInCases = ensureArray(item?.used_in_cases).map(String);
  const usedInBlueprints = ensureArray(item?.used_in_blueprints).map(String);

  return {
    ...item,
    id: String(item?.id || "modulo-sin-id"),
    path: String(item?.path || ""),
    status,
    category,
    source_repos: sourceRepos,
    capabilities,
    used_in_cases: usedInCases,
    used_in_blueprints: usedInBlueprints,
  };
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}
