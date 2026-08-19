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
  isQuartz: boolean;
}

export function parseWatchDetails(query: string, powerType: string): ParsedWatch {
  const q = query.trim();
  
  // Extract Brand
  const brands = ['Rolex', 'Omega', 'Breitling', 'Longines', 'Cartier', 'Tissot', 'Fossil', 'Diesel', 'Nixon', 'Maserati', 'TIMEX', 'Certina', 'Hamilton', 'IWC', 'Bremont', 'Mido', 'Eterna'];
  const brand = brands.find(b => new RegExp(`\\b${b}\\b`, 'i').test(q)) || q.split(' ')[0] || 'Watch';

  // Extract Case Size (e.g., 36mm, 42mm, 36)
  const sizeMatch = q.match(/\b(2[0-9]|3[0-9]|4[0-9]|5[0-9])\s*(mm)?\b/i);
  const size = sizeMatch ? `${sizeMatch[1]}mm` : 'standard size';

  // Extract Dial & Material
  const dialMatch = q.match(/\b(Black|Blue|White|Silver|Champagne|Grey|Dark Rhodium|Mother of Pearl|MOP|Panda)\b/i);
  const dial = dialMatch ? `${dialMatch[1]} dial` : 'classic dial';

  const matMatch = q.match(/\b(Stainless Steel|Steel|Gold|Rose Gold|Yellow Gold|Titanium|PVD|Two Tone|Ceramic|Blacksteel)\b/i);
  const material = matMatch ? matMatch[1] : 'stainless steel';

  // Extract Reference Number if present
  const refMatch = q.match(/\b([A-Z]{0,3}\d{3,7}[A-Z0-9.\-\/]*)\b/i);
  const ref = refMatch ? refMatch[1] : '';

  const isQuartz = powerType.toLowerCase() === 'quartz' || powerType.toLowerCase() === 'solar';

  return {
    brand,
    model: q,
    size,
    material,
    dial,
    ref,
    isQuartz
  };
}

export function generateStructuredContent(watch: WatchRecord) {
  const p = parseWatchDetails(watch.watch_query, watch.power_type);
  const battery = watch["Model Number"] && watch["Model Number"] !== 'N/A' ? watch["Model Number"] : 'standard watch cell';

  if (p.isQuartz) {
    return {
      quickAnswer: `The ${watch.watch_query} is a quartz timepiece powered by a standard ${battery} battery. Under normal operational conditions, this silver-oxide or lithium cell provides approximately 2 to 3 years of continuous power before needing replacement.`,
      headingHowTo: `How to Replace the Battery in a ${watch.watch_query}`,
      sectionHowTo: `Replacing the battery in your ${p.brand} (${p.size}, ${p.material}) requires carefully inspecting the case back. Most quartz dress and sport models utilize either a snap-on back or a multi-notched screw-down case. Using an appropriate watchmaker case wrench or pry knife prevents slipping and scratching the ${p.material} finish. Avoid touching the new ${battery} battery surfaces directly with your fingers, as skin oils can reduce conductivity.`,
      headingTools: `Essential Tools for ${p.brand} Battery Replacement`,
      sectionTools: `To safely change the ${battery} battery at home, you will need:\n- A precision watch case opener tool (suction, screw ball, or notch wrench).\n- Non-conductive plastic or anti-magnetic brass tweezers.\n- A fresh, genuine ${battery} silver-oxide button cell.\n- Silicone gasket sealant (recommended to preserve water resistance).`,
      faq: [
        {
          q: `What battery size does the ${watch.watch_query} use?`,
          a: `This timepiece operates on a ${battery} battery cell.`
        },
        {
          q: `How long does the battery last in a ${watch.watch_query}?`,
          a: `A quality ${battery} replacement cell typically lasts between 24 and 36 months.`
        },
        {
          q: `Can I change the battery myself?`,
          a: `Yes. With a basic case opener and non-magnetic tweezers, replacing the ${battery} takes under 10 minutes.`
        }
      ]
    };
  } else {
    return {
      quickAnswer: `The ${watch.watch_query} features a mechanical automatic movement and does not require a battery. It remains powered through the natural motion of your wrist or manual winding via the crown.`,
      headingHowTo: `Movement Details & Winding Guide for ${watch.watch_query}`,
      sectionHowTo: `Because the ${watch.watch_query} is a mechanical automatic watch, it relies on a mainspring and oscillating rotor rather than an electrical quartz battery. To ensure optimal amplitude and timekeeping accuracy in this ${p.material} model, hand-wind the crown clockwise approximately 30 to 40 times from a dead stop before securing it back down.`,
      headingTools: `Maintenance & Servicing Recommendations`,
      sectionTools: `Mechanical timepieces require standard horological maintenance rather than periodic battery swaps:\n- Service interval: Complete movement inspection and re-lubrication every 5 to 7 years.\n- Storage: Keep in a watch winder or dry storage case when unworn.\n- Demagnetization: Keep away from high-powered magnetic fields (speakers, laptops) to prevent erratic timekeeping.`,
      faq: [
        {
          q: `Does the ${watch.watch_query} require a battery?`,
          a: `No. This model is automatic/mechanical and generates power via wrist kinetic motion.`
        },
        {
          q: `How do I wind the ${watch.watch_query}?`,
          a: `Unscrew or pull the crown to position 1 and rotate clockwise 30–40 turns to build a full power reserve.`
        }
      ]
    };
  }
}
