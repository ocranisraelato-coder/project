function id(prefix = "c") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function isoPlusDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function makeMockCustomers() {
  return [
    {
      id: id(),
      name: "Lebo Mokoena",
      phone: "+27 71 555 0192",
      iuc: "7039 1182 5401",
      pkg: "Compact",
      expiryDate: isoPlusDays(18),
    },
    {
      id: id(),
      name: "Aisha Bello",
      phone: "+234 803 555 0144",
      iuc: "6012 7781 0933",
      pkg: "Premium",
      expiryDate: isoPlusDays(2),
    },
    {
      id: id(),
      name: "Thabo Ndlovu",
      phone: "+27 82 555 0101",
      iuc: "9231 4800 7742",
      pkg: "Family",
      expiryDate: isoPlusDays(-6),
    },
    {
      id: id(),
      name: "Chidinma Okafor",
      phone: "+234 901 555 0008",
      iuc: "1320 4421 9088",
      pkg: "Compact Plus",
      expiryDate: isoPlusDays(35),
    },
    {
      id: id(),
      name: "Kagiso Molefe",
      phone: "+27 79 555 0177",
      iuc: "4170 0229 3310",
      pkg: "Compact",
      expiryDate: isoPlusDays(-1),
    },
    {
      id: id(),
      name: "Sofia Mensah",
      phone: "+233 54 555 0119",
      iuc: "8811 5602 1200",
      pkg: "Access",
      expiryDate: isoPlusDays(9),
    },
    {
      id: id(),
      name: "Brian Ouma",
      phone: "+254 712 555 019",
      iuc: "2701 9921 0081",
      pkg: "Premium",
      expiryDate: isoPlusDays(61),
    },
  ];
}

