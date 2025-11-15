(function () {
  console.log("app.js loaded ✓");

  // ========= Sidebar search / active link =========
  document.addEventListener("DOMContentLoaded", () => {
    const search = document.querySelector("[data-menu-search]");
    const items  = Array.from(document.querySelectorAll(".menu a"));

    if (search && items.length) {
      search.addEventListener("input", () => {
        const q = search.value.trim().toLowerCase();
        items.forEach(a => {
          const text = a.textContent.trim().toLowerCase();
          a.style.display = text.includes(q) ? "flex" : "none";
        });
      });
    }
    const path = location.pathname.split("/").pop();
    items.forEach(a => {
      const href = a.getAttribute("href");
      if (href && href.endsWith(path)) a.classList.add("active");
    });
  });

  // ========= BASE (must be defined in page) =========
  const ORIGINAL_BASE = window.__API_BASE = "https://enquiries-brandon-commons-pin.trycloudflare.com/ConstructionCompany/api/ShipmentCertificate";

  
  // CORS Proxy workaround (set window.__USE_CORS_PROXY = true in HTML to enable)
  const USE_CORS_PROXY = window.__USE_CORS_PROXY ?? false;
  const CORS_PROXY = "https://corsproxy.io/?";
  
  const BASE = USE_CORS_PROXY ? CORS_PROXY + encodeURIComponent(ORIGINAL_BASE) : ORIGINAL_BASE;
  
  if (!ORIGINAL_BASE) {
    console.error("window.__API_BASE is empty! Set it in HTML before app.js");
    alert("API base URL is missing.\nSet window.__API_BASE in the HTML before app.js.");
    return;
  }
  console.log("API BASE (original) =", ORIGINAL_BASE);
  console.log("API BASE (with proxy) =", BASE);
  console.log("Using CORS Proxy:", USE_CORS_PROXY);

  // ========= Global error guard =========
  window.addEventListener("unhandledrejection", (e) => {
    console.error("Unhandled promise rejection:", e.reason);
    toast("Unexpected error: " + (e.reason?.message || e.reason), "red");
  });

  // ========= Helpers =========
  function toast(msg, color = "green") {
    let box = document.getElementById("message-box");
    if (!box) {
      box = document.createElement("div");
      box.id = "message-box";
      document.body.appendChild(box);
    }
    box.style.cssText =
      "position:fixed;bottom:16px;left:16px;padding:10px 14px;border-radius:10px;font-weight:700;z-index:9999;";
    box.style.background = color === "green" ? "#DCFCE7" : "#FEE2E2";
    box.style.color = color === "green" ? "#166534" : "#991B1B";
    box.textContent = msg;
    box.hidden = false;
    setTimeout(() => (box.hidden = true), 4000);
  }

  async function httpPost(path, body) {
    const url = BASE + path;
    console.log("POST ->", url, body);
    const res = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(body)
    });
    let data = null;
    try { data = await res.json(); } catch {}
    if (!res.ok || (data && data.status === false)) {
      const msg = (data && (data.message || data.error)) || res.statusText || "Request failed";
      throw new Error(msg);
    }
    return data ?? { ok: true };
  }

  async function httpGet(path) {
    const url = BASE + path;
    console.log("GET ->", url);
    const res = await fetch(url, { 
      method: "GET", 
      mode: "cors",
      headers: { "Accept": "application/json" } 
    });
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      console.error("GET FAIL", url, "status:", res.status, "body:", text?.slice(0, 300));
      throw new Error(`GET ${path} -> ${res.status}`);
    }
    try { return JSON.parse(text); } catch { return text; }
  }

  function asArray(resp) {
    if (Array.isArray(resp)) return resp;
    if (resp && Array.isArray(resp.data)) return resp.data;
    if (resp && Array.isArray(resp.result)) return resp.result;
    return [];
  }

  function toHHMMSS(value) {
    if (!value) return null;
    return value.length === 5 ? `${value}:00` : value;
  }

  function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  // ========= Init: Add Customer =========
  function initAddCustomer() {
    const form = document.getElementById("formAddCustomer");
    if (!form) return;

    console.log("initAddCustomer() ready");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name  = (form.customerName?.value || "").trim();
      const phone = (form.customerPhone?.value || "").trim();
      if (!name) return toast("Customer name is required.", "red");

      try {
        const res = await httpPost("/AddCustomer", { name, PhoneNumber: phone || null });
        form.reset();
        toast(res?.message || "Customer added successfully!");
        console.log("New customer ID:", res?.data);
      } catch (err) {
        console.error("POST /AddCustomer error:", err);
        toast("Failed to add customer: " + err.message, "red");
      }
    });
  }

  // ========= Init: Add Project =========
  function initAddProject() {
    const form = document.getElementById("formAddProject");
    if (!form) return;

    console.log("initAddProject() ready");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = (form.projectName?.value || "").trim();
      const description = (form.projectAddress?.value || "").trim();
      if (!name) return toast("Project/Site name is required.", "red");

      try {
        const res = await httpPost("/AddLocation", { name, description });
        form.reset();
        toast(res?.message || "Site added successfully!");
        console.log("New location ID:", res?.data);
      } catch (err) {
        console.error("POST /AddLocation error:", err);
        toast("Failed to add site: " + err.message, "red");
      }
    });
  }

  // ========= Init: Add Product =========
  function initAddItem() {
    const form = document.getElementById("formAddItem");
    if (!form) return;

    console.log("initAddItem() ready");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = (form.itemName?.value || "").trim();
      const unit = (form.itemUnit?.value || "").trim();
      if (!name) return toast("Item name is required.", "red");
      if (!unit) return toast("Unit is required.", "red");

      try {
        const res = await httpPost("/AddProduct", { name, unit });
        form.reset();
        toast(res?.message || "Item added successfully!");
        console.log("New product ID:", res?.data);
      } catch (err) {
        console.error("POST /AddProduct error:", err);
        toast("Failed to add item: " + err.message, "red");
      }
    });
  }

  // ========= شهادة الشحن: القوائم (GetConstants) + الحفظ =========

  function fillIdNameSelect(selectEl, rows, map = { id: "id", name: "name" }) {
  if (!selectEl) return;


  selectEl.innerHTML = ""; 
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "-- Select --";
  selectEl.appendChild(placeholder);

  const list = Array.isArray(rows) ? [...rows] : [];
  list.sort((a, b) => String(a?.[map.name] || "").localeCompare(String(b?.[map.name] || "")));

  for (const r of list) {
    if (r?.[map.id] == null || !r?.[map.name]) continue;
    const opt = document.createElement("option");
    opt.value = String(r[map.id]);
    opt.textContent = String(r[map.name]);
    selectEl.appendChild(opt);
  }

  try { $(selectEl).trigger("change.select2").trigger("changed.bs.select").trigger("change"); } catch {}
}

async function loadConstantsAndFill() {
  try {
    const resp = await httpGet("/GetConstants");
    const data = resp?.data ?? {};

    const customers = Array.isArray(data.Customers) ? data.Customers : [];
    const locations = Array.isArray(data.Locations) ? data.Locations : [];
    const products  = Array.isArray(data.Products)  ? data.Products  : [];

    const scCustomer = document.getElementById("scCustomer");
    const scProject  = document.getElementById("scProject");
    const scItem     = document.getElementById("scItem");

    // فحوصات: لازم كلهم موجودين ومختلفين عن بعض
    console.log("Selects existence:", {
      scCustomer: !!scCustomer,
      scProject:  !!scProject,
      scItem:     !!scItem,
    });
    console.log("Are all IDs distinct?",
      scCustomer && scProject && scItem &&
      scCustomer !== scProject &&
      scCustomer !== scItem &&
      scProject  !== scItem
    );

    fillIdNameSelect(scCustomer, customers); // id/name بالضبط كما في JSON
    fillIdNameSelect(scProject,  locations);
    fillIdNameSelect(scItem,     products);

    // لوج للتأكد شو اللي انعَبّى بكل قائمة
    console.log("Filled counts:", {
      customers: scCustomer?.options?.length,
      locations: scProject?.options?.length,
      products:  scItem?.options?.length,
    });
  } catch (e) {
    console.error("GetConstants error:", e);
    toast("Failed to load dropdown lists (GetConstants).", "red");
  }
}

// شغّلي بعد تحميل الـ DOM
document.addEventListener("DOMContentLoaded", loadConstantsAndFill);


  async function onSubmitAddShippingCert(e) {
    e.preventDefault();
    const payload = {
      customerId: Number(getVal("scCustomer")) || null,
      deliveryLocationId:  Number(getVal("scProject"))  || null,
      productId:  Number(getVal("scItem"))     || null,
      customerName: getVal("orderRef") || null,
      cubicTotal: parseFloat(getVal("totalAmount")) || 0.0,
      elementName: getVal("elementName") || null,
      orderNotes: getVal("scNotes") || null,
      certificateNotes: getVal("certificateNote") || null,
      mixerNumber: getVal("mixerNumber") || null,
      driverName: getVal("driverName") || null,
      truckLicenseNumber: getVal("licensePlate") || null,
      departureTime: toHHMMSS(getVal("timeDeparture")),
      arrivalTime: toHHMMSS(getVal("timeArrival")),
      startUnloadingTime: toHHMMSS(getVal("timeStartUnload")),
      endUnloadingTime: toHHMMSS(getVal("timeEndUnload"))
    };

    if (!payload.customerId) return toast("Please select a customer.", "red");
    if (!payload.deliveryLocationId) return toast("Please select a project/site.", "red");
    if (!payload.productId) return toast("Please select a product.", "red");
    if (!payload.elementName) return toast("Please enter an Element Name.", "red");

    try {
      const res = await httpPost("/AddShipmentCertificate", payload);
      const newNumber = res?.data?.certificateNumber || res?.certificateNumber;
      if (newNumber) {
        const span = document.getElementById("cert-number");
        if (span) span.textContent = newNumber;
      }
      toast(res?.message || "Certificate saved successfully!");
      e.target.reset();
      const d = document.getElementById("scDate");
      if (d) d.valueAsDate = new Date();
    } catch (err) {
      console.error("POST /AddShipmentCertificate error:", err);
      toast("Failed to save certificate: " + err.message, "red");
    }
  }

  async function initAddShippingCertificate() {
    const form = document.getElementById("formAddShippingCert");
    if (!form) return;

    console.log("initAddShippingCertificate() ready");
    form.addEventListener("submit", onSubmitAddShippingCert);

    try {
      await loadConstantsAndFill();
    } catch (e) {
      console.error(e);
      toast("Failed to load dropdown lists.", "red");
    }

    const scDate = document.getElementById("scDate");
    if (scDate) scDate.valueAsDate = new Date();
  }

  // ========= Boot =========
  document.addEventListener("DOMContentLoaded", () => {
    initAddCustomer();
    initAddProject();
    initAddItem();
    initAddShippingCertificate();
  });
})();
