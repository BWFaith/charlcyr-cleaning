(() => {
  const form = document.getElementById("bookForm");
  if (!form) return;
  const C = window.CC,
    $ = (s) => form.querySelector(s),
    $$ = (s) => [...form.querySelectorAll(s)];
  const money = (n) =>
    "$" + Math.round(n).toLocaleString("en-US");
  const dEl = document.getElementById("sumList"),
    tEl = document.getElementById("sumTotal");
  const t = new Date();
  t.setDate(t.getDate() + 1);
  form.date.min = t.toISOString().slice(0, 10);

  function calc() {
    const s = C.services[form.service.value],
      sqft = Math.max(+form.sqft.value || 0, 300);
    let base = Math.max(sqft * s.rate, s.min);
    const bed =
        Math.max(+form.beds.value - 2, 0) * C.extraBedroom,
      bath =
        Math.max(+form.baths.value - 1, 0) *
        C.extraBathroom;
    let add = 0,
      addNames = [];
    $$("input[name=addon]:checked").forEach((a) => {
      add += C.addons[a.value][1];
      addNames.push(C.addons[a.value][0]);
    });
    // recurring plans only for services that allow them
    $$("input[name=freq]").forEach((r) => {
      if (r.value !== "once") r.disabled = !s.recurring;
    });
    if (!s.recurring)
      form.querySelector(
        "input[name=freq][value=once]",
      ).checked = true;
    const freq = form.freq.value,
      fd = (base + bed + bath) * C.frequency[freq];
    let sub = base + bed + bath + add - fd;
    const first = form.first.checked
      ? sub * C.firstTimeDiscount
      : 0;
    const total = sub - first;
    const rows = [[s.label, money(base)]];
    if (bed) rows.push(["Extra bedrooms", money(bed)]);
    if (bath) rows.push(["Extra bathrooms", money(bath)]);
    if (add)
      rows.push([
        "Add-ons (" + addNames.length + ")",
        money(add),
      ]);
    if (fd)
      rows.push(["Recurring savings", "-" + money(fd)]);
    if (first)
      rows.push(["First-time 15% off", "-" + money(first)]);
    dEl.innerHTML = rows
      .map((r) => `<dt>${r[0]}</dt><dd>${r[1]}</dd>`)
      .join("");
    tEl.textContent = money(total);
    return {
      total: money(total),
      service: s.label,
      sqft,
      beds: form.beds.value,
      baths: form.baths.value,
      freq: form.freq.options ? form.freq.value : freq,
      addons: addNames.join(", ") || "None",
      breakdown: rows.map((r) => r.join(": ")).join(" | "),
    };
  }
  form.addEventListener("input", calc);
  form.addEventListener("change", calc);
  calc();
  // preselect service from ?service=
  const q = new URLSearchParams(location.search).get(
    "service",
  );
  if (q && C.services[q]) {
    form.service.value = q;
    calc();
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = document.getElementById("err"),
      btn = $("button[type=submit]");
    err.textContent = "";
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const q = calc(),
      p = {
        to_name: form.name.value,
        customer_email: form.email.value,
        customer_phone: form.phone.value,
        address: form.address.value,
        service: q.service,
        sqft: q.sqft,
        bedrooms: q.beds,
        bathrooms: q.baths,
        frequency: form.freq.value,
        addons: q.addons,
        date: form.date.value,
        time: form.time.value,
        notes: form.notes.value || "None",
        estimate: q.total,
        breakdown: q.breakdown,
        owner_email: C.ownerEmail,
        business: C.business,
        business_phone: C.phone,
      };
    btn.disabled = true;
    btn.textContent = "Sending…";
    try {
      const k = C.emailjs;
      if (
        !window.emailjs ||
        k.publicKey.startsWith("YOUR_")
      )
        throw new Error("setup");
      emailjs.init({ publicKey: k.publicKey });
      // one copy to the customer, one to the business owner (same template, different recipient)
      await emailjs.send(k.serviceId, k.templateId, {
        ...p,
        to_email: p.customer_email,
        audience: "customer",
      });
      await emailjs.send(k.serviceId, k.templateId, {
        ...p,
        to_email: C.ownerEmail,
        audience: "owner",
      });
      show(false);
      form.reset();
      calc();
    } catch (x) {
      // Fallback so no booking is lost before EmailJS is configured: open a prefilled email
      const body = Object.entries(p)
        .filter(
          ([k]) =>
            ![
              "owner_email",
              "business",
              "business_phone",
            ].includes(k),
        )
        .map(([k, v]) => k + ": " + v)
        .join("\n");
      location.href = `mailto:${C.ownerEmail}?subject=${encodeURIComponent("Booking request – " + p.service)}&body=${encodeURIComponent(body)}`;
      show(true);
    }
    btn.disabled = false;
    btn.textContent = "Confirm booking request";
  });
  function show(fallback) {
    const m = document.getElementById("done");
    m.querySelector(".fb").hidden = !fallback;
    m.classList.add("show");
  }
  document
    .querySelectorAll("[data-close]")
    .forEach(
      (b) =>
        (b.onclick = () =>
          b.closest(".modal").classList.remove("show")),
    );
})();
