(() => {
  const $ = (s, c = document) => c.querySelector(s),
    $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const nav = $(".nav"),
    top = $(".top");
  addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("stuck", scrollY > 40);
      top && top.classList.toggle("show", scrollY > 700);
    },
    { passive: true },
  );
  top &&
    top.addEventListener("click", () =>
      scrollTo({ top: 0 }),
    );
  const bg = $(".burger"),
    mn = $(".menu");
  bg &&
    bg.addEventListener("click", () => {
      bg.classList.toggle("open");
      mn.classList.toggle("open");
      bg.setAttribute(
        "aria-expanded",
        bg.classList.contains("open"),
      );
    });
  $$(".menu a").forEach((a) =>
    a.addEventListener("click", () => {
      bg.classList.remove("open");
      mn.classList.remove("open");
    }),
  );
  $$("[data-year]").forEach(
    (e) => (e.textContent = new Date().getFullYear()),
  );

  // reveal on scroll
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12 },
  );
  $$(".rv").forEach((e, i) => {
    e.style.transitionDelay = (i % 4) * 70 + "ms";
    io.observe(e);
  });

  // counters
  const co = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        co.unobserve(e.target);
        const el = e.target,
          end = +el.dataset.n,
          suf = el.dataset.s || "";
        let t0;
        const f = (t) => {
          t0 ??= t;
          const p = Math.min((t - t0) / 1600, 1);
          el.textContent =
            Math.round(end * (1 - Math.pow(1 - p, 3))) +
            suf;
          p < 1 && requestAnimationFrame(f);
        };
        requestAnimationFrame(f);
      }),
    { threshold: 0.6 },
  );
  $$("[data-n]").forEach((e) => co.observe(e));

  // hero gold sparks
  const cv = $("#sparks");
  if (
    cv &&
    !matchMedia("(prefers-reduced-motion:reduce)").matches
  ) {
    const x = cv.getContext("2d");
    let W,
      H,
      P = [];
    const size = () => {
      W = cv.width = cv.offsetWidth;
      H = cv.height = cv.offsetHeight;
      P = Array.from(
        { length: Math.min(60, (W / 22) | 0) },
        () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.8 + 0.4,
          v: Math.random() * 0.35 + 0.08,
          a: Math.random() * 6,
        }),
      );
    };
    size();
    addEventListener("resize", size);
    const draw = () => {
      x.clearRect(0, 0, W, H);
      P.forEach((p) => {
        p.y -= p.v;
        p.a += 0.02;
        if (p.y < -5) {
          p.y = H + 5;
          p.x = Math.random() * W;
        }
        x.globalAlpha =
          0.25 + 0.55 * Math.abs(Math.sin(p.a));
        x.fillStyle = "#e6c777";
        x.beginPath();
        x.arc(p.x + Math.sin(p.a) * 8, p.y, p.r, 0, 7);
        x.fill();
      });
      requestAnimationFrame(draw);
    };
    draw();
  }

  // testimonials
  $$(".slider").forEach((s) => {
    const sl = $$(".slide", s),
      d = $(".dots", s);
    let i = 0,
      t;
    sl.forEach((_, k) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", "Review " + (k + 1));
      b.onclick = () => {
        go(k);
        reset();
      };
      d.append(b);
    });
    const go = (n) => {
      i = n;
      sl.forEach((e, k) =>
        e.classList.toggle("on", k == n),
      );
      $$("button", d).forEach((b, k) =>
        b.classList.toggle("on", k == n),
      );
    };
    const reset = () => {
      clearInterval(t);
      t = setInterval(() => go((i + 1) % sl.length), 6500);
    };
    go(0);
    reset();
  });

  // before/after sliders
  $$(".ba").forEach((b) => {
    const r = $("input", b),
      bf = $(".before", b),
      bar = $(".bar", b);
    const set = (v) => {
      bf.style.clipPath = `inset(0 ${100 - v}% 0 0)`;
      bar.style.left = v + "%";
    };
    r.addEventListener("input", () => set(r.value));
    set(r.value);
  });

  // gallery filter
  $$(".filters button").forEach((b) =>
    b.addEventListener("click", () => {
      $$(".filters button").forEach((x) =>
        x.classList.remove("on"),
      );
      b.classList.add("on");
      $$(".case").forEach((c) =>
        c.classList.toggle(
          "hide",
          b.dataset.f !== "all" &&
            c.dataset.c !== b.dataset.f,
        ),
      );
    }),
  );
})();
