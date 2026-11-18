const planForm = document.querySelector("#action-plan");
const planResult = document.querySelector("#plan-result");
const formError = document.querySelector("#form-error");
const provinceSelect = document.querySelector("#province");
const provinceShort = document.querySelector("#province-short");

function setLocalResource(select) {
  const resource = document.querySelector("#local-resource");
  const option = select.selectedOptions[0];
  const selectedName = option?.textContent?.trim();
  resource.replaceChildren();

  const description = document.createElement("p");
  if (!select.value || !selectedName) {
    description.textContent =
      "Podés llamar a la Línea 102 y preguntar por el organismo local de protección de derechos de niñas, niños y adolescentes. También podés pedir orientación en una escuela, centro de salud u hospital.";
  } else {
    const authority =
      option.dataset.autoridad ||
      "organismo local de protección de derechos de niñas, niños y adolescentes";
    description.textContent = `En ${selectedName}, pedí orientación sobre el ${authority}. La Línea 102 puede indicarte cuál es el servicio que corresponde a tu localidad.`;
  }
  resource.append(description);

  if (option?.dataset.telefono) {
    const phone = option.dataset.telefono;
    const link = document.createElement("a");
    link.href = `tel:${phone.replace(/[^\d+]/g, "")}`;
    link.textContent = `Llamar al servicio local: ${phone}`;
    resource.append(link);
  }

  const contactUrl = safeHttpsUrl(option?.dataset.urlContacto);
  if (contactUrl) {
    const link = document.createElement("a");
    link.href = contactUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = "Ver información del servicio local";
    resource.append(link);
  }

  const lawUrl = safeHttpsUrl(option?.dataset.urlLey);
  if (option?.dataset.ley && lawUrl) {
    const law = document.createElement("p");
    law.append(document.createTextNode("Norma local: "));
    const link = document.createElement("a");
    link.href = lawUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = option.dataset.ley;
    law.append(link);
    resource.append(law);
  }
}

function safeHttpsUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

provinceShort?.addEventListener("change", () =>
  setLocalResource(provinceShort),
);

provinceSelect?.addEventListener("change", () => {
  if (provinceShort) {
    provinceShort.value = provinceSelect.value;
    setLocalResource(provinceShort);
  }
  formError.hidden = true;
});

planForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(planForm);
  const urgency = formData.get("urgent");
  const adult = formData.get("adult");

  if (!provinceSelect.value) {
    formError.hidden = false;
    provinceSelect.focus();
    return;
  }

  formError.hidden = true;
  const province = provinceSelect.selectedOptions[0].textContent.trim();
  const lead = document.querySelector("#result-lede");
  const stepOne = document.querySelector("#result-step-one");
  const stepTwo = document.querySelector("#result-step-two");

  if (urgency === "yes") {
    lead.textContent =
      "Como marcaste que necesitás ayuda urgente, lo más importante es que estés a salvo ahora.";
    stepOne.innerHTML =
      'Llamá al <a href="tel:911">911</a> o acercate a un lugar seguro con otras personas. También podés llamar a la <a href="tel:102">Línea 102</a> para pedir orientación.';
  } else if (urgency === "unsure") {
    lead.textContent =
      "Si no estás seguro/a de qué tan urgente es, igual podés pedir ayuda y contar qué te preocupa.";
    stepOne.innerHTML =
      'Si sentís que alguien puede lastimarte pronto, llamá al <a href="tel:911">911</a>. Para conversar sobre qué hacer, probá con una persona de confianza o la <a href="tel:102">Línea 102</a>.';
  } else {
    lead.textContent =
      "Podés tomar un primer paso con calma y pedir que una persona adulta te acompañe.";
    stepOne.innerHTML =
      'Si la situación cambia y te sentís en peligro, llamá al <a href="tel:911">911</a> o buscá un lugar seguro. Para orientación, podés llamar a la <a href="tel:102">Línea 102</a>.';
  }

  if (adult === "yes") {
    stepTwo.textContent = `Podés contarle a esa persona lo que necesitás y pedirle que te acompañe a consultar por el organismo local de protección de derechos en ${province}. También pueden llamar juntos a la Línea 102.`;
  } else if (adult === "no") {
    stepTwo.textContent = `Podés acercarte a una escuela, centro de salud u hospital y pedir hablar en privado con alguien responsable. En ${province}, preguntá por el organismo local de protección de derechos; la Línea 102 puede orientarte sobre el servicio de tu localidad.`;
  } else {
    stepTwo.textContent = `Podés empezar en una escuela, centro de salud u hospital, o llamar a la Línea 102 y pedir orientación para ${province}. No tenés que decidir ahora quién será tu persona de apoyo.`;
  }

  planResult.hidden = false;
  planResult.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector("#edit-plan")?.addEventListener("click", () => {
  planResult.hidden = true;
  planForm.scrollIntoView({ behavior: "smooth", block: "start" });
});
