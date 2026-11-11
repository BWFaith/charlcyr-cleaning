/* ====== EDIT THIS FILE: business settings, prices & email keys ====== */
window.CC = {
  business: "Charlcyr Cleaning",
  ownerEmail: "charlcyrgroup@gmail.com",
  phone: "561-574-0921",
  // EmailJS (free at emailjs.com) – see README step 2
  emailjs: {
    publicKey: "YOUR_PUBLIC_KEY",
    serviceId: "YOUR_SERVICE_ID",
    templateId: "YOUR_TEMPLATE_ID",
  },
  firstTimeDiscount: 0.15, // 15% off first service
  // price per sq ft and minimum charge. These are PLACEHOLDER rates: set your own.
  services: {
    residential: {
      label: "Residential Cleaning",
      rate: 0.1,
      min: 120,
      recurring: true,
    },
    deep: {
      label: "Deep Cleaning",
      rate: 0.16,
      min: 200,
      recurring: false,
    },
    movein: {
      label: "Move-In / Move-Out",
      rate: 0.18,
      min: 220,
      recurring: false,
    },
    post: {
      label: "Post-Construction Cleaning",
      rate: 0.24,
      min: 300,
      recurring: false,
    },
    janitorial: {
      label: "Janitorial / Office",
      rate: 0.07,
      min: 150,
      recurring: true,
    },
  },
  extraBedroom: 12,
  extraBathroom: 18, // charged for bedrooms above 2 and bathrooms above 1
  frequency: {
    once: 0,
    monthly: 0.05,
    biweekly: 0.1,
    weekly: 0.15,
  },
  addons: {
    fridge: ["Inside fridge", 35],
    oven: ["Inside oven", 35],
    cabinets: ["Inside cabinets", 45],
    windows: ["Interior windows", 60],
    laundry: ["Laundry (wash & fold)", 30],
    pets: ["Pet-hair treatment", 40],
    balcony: ["Patio / balcony", 25],
  },
};
