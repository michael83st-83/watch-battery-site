export interface WatchRecord {
  watch_query: string;
  power_type: string;
  "Model Number": string;
  requires_battery: boolean;
  youtube_video_id?: string | null;
  slug: string;
}

export interface ParsedWatch {
  brand: string;
  model: string;
  size: string;
  material: string;
  dial: string;
  ref: string;
  type: 'quartz' | 'solar' | 'automatic' | 'smartwatch' | 'hybrid_smartwatch';
}

export function parseWatchDetails(query: string, powerType: string): ParsedWatch {
  const q = query.trim();
  
  const brands = ['Grand Seiko', 'Tag Heuer', 'Frederique Constant', 'Rolex', 'Omega', 'Breitling', 'Longines', 'Cartier', 'Tissot', 'Fossil', 'Diesel', 'Nixon', 'Maserati', 'TIMEX', 'Certina', 'Hamilton', 'IWC', 'Bremont', 'Mido', 'Eterna', 'Seiko', 'Citizen', 'Casio'];
  const brand = brands.find(b => new RegExp(`\\b${b}\\b`, 'i').test(q)) || q.split(' ')[0] || 'Watch';

  const sizeMatch = q.match(/\b(2[0-9]|3[0-9]|4[0-9]|5[0-9])\s*(mm)?\b/i);
  const size = sizeMatch ? `${sizeMatch[1]}mm` : 'standard size';

  const dialMatch = q.match(/\b(Black|Blue|White|Silver|Champagne|Grey|Dark Rhodium|Mother of Pearl|MOP|Panda)\b/i);
  const dial = dialMatch ? `${dialMatch[1]} dial` : 'classic dial';

  const matMatch = q.match(/\b(Stainless Steel|Steel|Gold|Rose Gold|Yellow Gold|Titanium|PVD|Two Tone|Ceramic|Blacksteel)\b/i);
  const material = matMatch ? matMatch[1] : 'stainless steel';

  const refMatch = q.match(/\b([A-Z]{0,3}\d{3,7}[A-Z0-9.\-\/]*)\b/i);
  const ref = refMatch ? refMatch[1] : '';

  let type: 'quartz' | 'solar' | 'automatic' | 'smartwatch' | 'hybrid_smartwatch' = 'quartz';
  const pt = powerType.toLowerCase();
  
  // Detect Hybrids FIRST
  if (pt.includes('hybrid') || q.toLowerCase().includes('hybrid') || (q.toLowerCase().includes('smartwatch') && (q.toLowerCase().includes('frederique constant') || q.toLowerCase().includes('withings')))) {
    type = 'hybrid_smartwatch';
  } else if (pt.includes('solar') || q.toLowerCase().includes('solar') || q.toLowerCase().includes('eco-drive')) {
    type = 'solar';
  } else if (pt.includes('automatic') || pt.includes('mechanical')) {
    type = 'automatic';
  } else if (pt.includes('smartwatch')) {
    type = 'smartwatch';
  }

  return { brand, model: q, size, material, dial, ref, type };
}

export function generateStructuredContent(watch: WatchRecord) {
  const p = parseWatchDetails(watch.watch_query, watch.power_type);
  
  const rawBattery = watch["Model Number"];
  const hasValidBattery = rawBattery && rawBattery !== 'N/A' && rawBattery !== 'NULL' && rawBattery.trim() !== '';
  const battery = hasValidBattery ? rawBattery : (p.type === 'solar' ? 'rechargeable capacitor' : 'standard watch battery');

  if (p.type === 'hybrid_smartwatch') {
    return {
      quickAnswer: `The ${watch.watch_query} is a hybrid smartwatch. Unlike standard touchscreen smartwatches that require daily magnetic charging, it operates on a standard ${hasValidBattery ? battery : 'button cell'} battery that powers both the analog hands and Bluetooth tracking features.`,
      headingHowTo: `Replacing the Battery in your ${watch.watch_query}`,
      sectionHowTo: `Replacing the battery in your ${p.brand} hybrid smartwatch requires carefully inspecting the case back. Using an appropriate watchmaker case wrench prevents slipping and scratching the ${p.material} finish. Avoid touching the new ${hasValidBattery ? battery : 'replacement'} surfaces directly with your fingers, as skin oils can reduce conductivity and affect the Bluetooth module.`,
      headingTools: `Essential Tools for ${p.brand} Battery Replacement`,
      sectionTools: `To safely change the battery at home, you will need:\n- A precision watch case opener tool.\n- Non-conductive plastic or anti-magnetic brass tweezers.\n- A fresh, genuine ${hasValidBattery ? battery : 'replacement'} cell.`,
      faq: [
        { q: `Does the ${watch.watch_query} need a charger?`, a: `No. As a hybrid smartwatch, it does not use a magnetic charging cable. It runs on a standard replaceable watch battery.` },
        { q: `How long does the battery last?`, a: `Depending on how frequently it syncs to your phone, a fresh battery in this hybrid model typically lasts between 12 to 24 months.` }
      ]
    };
  } else if (p.type === 'solar') {
    return {
      quickAnswer: `The ${watch.watch_query} is a solar-powered timepiece. Instead of a standard disposable battery, it utilizes a ${battery} to store energy converted from natural and artificial light.`,
      headingHowTo: `Capacitor Details for ${watch.watch_query}`,
      sectionHowTo: `Unlike standard quartz watches, the ${p.brand} (${p.size}, ${p.material}) is solar-powered. The internal ${battery} rarely needs replacing if kept adequately charged. To maintain battery health, ensure the dial is regularly exposed to direct sunlight or strong indoor lighting. If the watch stops completely or the second hand skips, the capacitor may need a full reset or professional replacement.`,
      headingTools: `Charging & Maintenance`,
      sectionTools: `To keep your solar watch functioning perfectly:\n- Store the watch in a well-lit area when not being worn.\n- Avoid leaving it in dark drawers for months at a time.\n- If the capacitor eventually fails, replacing it requires specific anti-magnetic tools to avoid short-circuiting the movement.`,
      faq: [
        { q: `What battery does the ${watch.watch_query} use?`, a: `This is a solar watch and requires a specific ${battery}, not a standard silver-oxide cell.` },
        { q: `How long does the solar capacitor last?`, a: `With regular light exposure, a quality solar capacitor can last 10 to 15 years before needing replacement.` },
        { q: `Can I put a regular battery in my solar watch?`, a: `No. Installing a standard non-rechargeable battery into a solar watch will damage the movement.` }
      ]
    };
  } else if (p.type === 'automatic') {
    return {
      quickAnswer: `The ${watch.watch_query} features a mechanical automatic movement and does not require a battery. It remains powered through the natural motion of your wrist or manual winding via the crown.`,
      headingHowTo: `Movement Details & Winding Guide for ${watch.watch_query}`,
      sectionHowTo: `Because the ${watch.watch_query} is a mechanical automatic watch, it relies on a mainspring and oscillating rotor rather than an electrical quartz battery. To ensure optimal amplitude and timekeeping accuracy in this ${p.material} model, hand-wind the crown clockwise approximately 30 to 40 times from a dead stop before securing it back down.`,
      headingTools: `Maintenance & Servicing Recommendations`,
      sectionTools: `Mechanical timepieces require standard horological maintenance rather than periodic battery swaps:\n- Service interval: Complete movement inspection and re-lubrication every 5 to 7 years.\n- Storage: Keep in a watch winder or dry storage case when unworn.\n- Demagnetization: Keep away from high-powered magnetic fields (speakers, laptops) to prevent erratic timekeeping.`,
      faq: [
        { q: `Does the ${watch.watch_query} require a battery?`, a: `No. This model is automatic/mechanical and generates power via wrist kinetic motion.` },
        { q: `How do I wind the ${watch.watch_query}?`, a: `Unscrew or pull the crown to position 1 and rotate clockwise 30–40 turns to build a full power reserve.` }
      ]
    };
  } else if (p.type === 'smartwatch') {
    return {
      quickAnswer: `The ${watch.watch_query} is a smartwatch that operates on an internal lithium-ion battery. It requires regular charging via its specific magnetic charging cable or dock.`,
      headingHowTo: `Charging Your ${watch.watch_query}`,
      sectionHowTo: `To keep your ${p.brand} smartwatch powered, routinely dock it using the manufacturer-provided charging cable. Keep the magnetic contact points on the back of the ${p.material} case clean from sweat and debris to ensure a stable connection.`,
      headingTools: `Smartwatch Battery Maintenance`,
      sectionTools: `To extend the lifespan of your smartwatch battery:\n- Avoid letting the battery drain completely to 0% on a regular basis.\n- Do not leave the watch charging in direct, hot sunlight.\n- Clean the charging contacts gently with a microfiber cloth.`,
      faq: [
        { q: `Can I replace the battery in the ${watch.watch_query} myself?`, a: `Smartwatch batteries are typically sealed inside the case to maintain water resistance. Replacement usually requires professional servicing.` },
        { q: `How often does this watch need to be charged?`, a: `Depending on usage and active features (like GPS or continuous heart rate monitoring), most smartwatches require charging every 1 to 3 days.` }
      ]
    };
  } else {
    return {
      quickAnswer: `The ${watch.watch_query} is a quartz timepiece powered by a ${hasValidBattery ? battery : 'standard button cell'} battery. Under normal operational conditions, this cell provides approximately 2 to 3 years of continuous power before needing replacement.`,
      headingHowTo: `How to Replace the Battery in a ${watch.watch_query}`,
      sectionHowTo: `Replacing the battery in your ${p.brand} (${p.size}, ${p.material}) requires carefully inspecting the case back. Most quartz dress and sport models utilize either a snap-on back or a multi-notched screw-down case. Using an appropriate watchmaker case wrench or pry knife prevents slipping and scratching the ${p.material} finish. Avoid touching the new battery surfaces directly with your fingers, as skin oils can reduce conductivity.`,
      headingTools: `Essential Tools for ${p.brand} Battery Replacement`,
      sectionTools: `To safely change the battery at home, you will need:\n- A precision watch case opener tool (suction, screw ball, or notch wrench).\n- Non-conductive plastic or anti-magnetic brass tweezers.\n- A fresh, genuine ${hasValidBattery ? battery : 'replacement'} cell.\n- Silicone gasket sealant (recommended to preserve water resistance).`,
      faq: [
        { q: `What battery size does the ${watch.watch_query} use?`, a: `This timepiece operates on a ${hasValidBattery ? battery : 'standard replacement'} battery cell.` },
        { q: `How long does the battery last in a ${watch.watch_query}?`, a: `A quality replacement cell typically lasts between 24 and 36 months.` },
        { q: `Can I change the battery myself?`, a: `Yes. With a basic case opener and non-magnetic tweezers, replacing the battery takes under 10 minutes.` }
      ]
    };
  }
}
