export interface DisplayArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'Display Repair' | 'Smartphone Display Issues' | 'Apple Devices' | 'Samsung Devices' | 'Display Technology';
  featuredImage: string;
  author: string;
  readTime: string;
  publishedDate: string;
  tags: string[];
}

export const DISPLAY_ARTICLES: DisplayArticle[] = [
  {
    id: 1,
    title: 'Understanding Green Screen of Death & Vertical Lines on Modern AMOLED Panels',
    slug: 'green-screen-vertical-lines-amoled-repair',
    excerpt:
      'A deep dive into why flexible AMOLED panels develop sudden green screens or colored vertical lines, and how laser flex micro-welding restores display signal without assembly replacement.',
    category: 'Smartphone Display Issues',
    featuredImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&q=80',
    author: 'Display Engineering Team',
    readTime: '6 min read',
    publishedDate: 'September 24, 2026',
    tags: ['Green Screen', 'Vertical Lines', 'AMOLED', 'Laser Bonding'],
    content: `
Modern flagship smartphones from Apple, Samsung, Google, and OnePlus utilize flexible AMOLED displays engineered for ultra-high brightness, deep black levels, and 120Hz refresh rates. However, one of the most frustrating hardware anomalies owners face is the sudden appearance of a solid green screen or permanent vertical/horizontal lines across the panel.

### Root Causes of AMOLED Display Lines & Green Tint
1. **Flex Cable Trace Oxidation & Micro-Cracks**:
   Flexible displays rely on microscopic conductive traces patterned along a thin polyimide ribbon (COP or Chip-on-Plastic). Thermal cycling from rapid charging or prolonged processor usage can cause micro-fissures in these traces.
2. **COF (Chip-on-Film) Bonding Detachment**:
   When the display driver IC (DDIC) loses microscopic contact with the row/column scan lines, sync signals drop, triggering the panel's fail-safe mode: full-screen green illumination.
3. **Physical Shock Without Glass Shattering**:
   Drops often preserve the sturdy outer Ceramic Shield or Gorilla Glass Victus while causing internal microscopic fractures in the delicate OLED emitter layer beneath.

### How Laser Micro-Welding Restores the Display
Unlike traditional repair shops that force complete display unit replacements, specialized cleanroom laboratories employ precision infrared laser bonding machines. 

- **Trace Scanning**: High-power optical microscopes trace the signal disruption along the COP ribbon.
- **Micro-Laser Reconnection**: A focused laser pulse welds broken micro-traces (measuring less than 5 microns across) back into continuity.
- **Preservation of Authentic Panel**: This advanced process saves the original factory calibrated OLED, retaining authentic colors, high refresh rates, and TrueTone functionality.
    `,
  },
  {
    id: 2,
    title: 'Touch Glass Refurbishing vs Full Display Replacement: Why Preserving Your Factory OLED Matters',
    slug: 'touch-glass-refurbishing-vs-screen-replacement',
    excerpt:
      'If your touchscreen and colors are completely intact under cracked glass, OCA optical de-bonding preserves your authentic factory display panel while saving substantial cost.',
    category: 'Display Repair',
    featuredImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
    author: 'Optical Lamination Specialist',
    readTime: '5 min read',
    publishedDate: 'September 18, 2026',
    tags: ['Glass Refurbishing', 'OCA Lamination', 'TrueTone', 'Cleanroom'],
    content: `
When a smartphone takes an unfortunate tumble, the topmost layer of glass often shatters into a spiderweb pattern. However, in a large percentage of incidents, the image beneath remains crisp and the digitizer still responds to touch. 

### What is Touch Glass Refurbishing?
A smartphone display assembly is composed of multiple fused layers:
1. **Outer Cover Glass**: Chemically strengthened glass (Gorilla Glass Victus or Ceramic Shield).
2. **OCA (Optical Clear Adhesive)**: A microscopic, distortion-free optical bonding film.
3. **Digitizer Sensor Layer**: Detects multi-touch capacitive input.
4. **OLED / AMOLED Substrate**: Emits light, pixels, and colors.

When only the outer glass is damaged, glass refurbishing isolates and removes the shattered glass layer while protecting the factory OLED and digitizer underneath.

### The 4-Stage Cleanroom Procedure
- **Molybdenum Wire Separation**: Using a heated vacuum plate and specialized tungsten-molybdenum wire (0.028mm thickness), technicians glide between the broken glass and the OLED substrate.
- **Glue Removal & Chemical Cleansing**: Specialized cleaning solvents remove all residue without degrading anti-reflective polarizers.
- **Optical Laminating in ISO Cleanroom**: A new factory-spec glass panel is combined with fresh OCA film under an air-filtered environment to prevent airborne dust particles.
- **Autoclave Debubbling**: The assembly undergoes high pressure (5-7 bar) and controlled temperature in an autoclave chamber to eliminate any microscopic air pockets.

The result is a display that looks, feels, and performs identically to factory specification.
    `,
  },
  {
    id: 3,
    title: 'Apple Super Retina XDR & Tandem OLED: Engineering Behind iPhone and iPad Pro Displays',
    slug: 'apple-super-retina-xdr-tandem-oled-guide',
    excerpt:
      'An architectural analysis of Apple tandem OLED structures on M4 iPad Pro and Super Retina XDR on iPhone 15/16 Pro, including calibration and sensor alignment.',
    category: 'Apple Devices',
    featuredImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
    author: 'Apple Hardware Analyst',
    readTime: '7 min read',
    publishedDate: 'September 12, 2026',
    tags: ['iPhone', 'iPad Pro', 'Tandem OLED', 'ProMotion'],
    content: `
Apple's shift to tandem OLED displays on the iPad Pro M4 and Super Retina XDR displays on flagship iPhones represents one of the biggest leaps in mobile display engineering. By stacking two distinct OLED layers in series, Apple achieves up to 1,000 nits of full-screen sustained brightness and 1,600 nits peak HDR brightness.

### The Architecture of Tandem OLED
In a single-stack OLED, driving higher brightness requires pumping higher current density through organic materials, drastically accelerating degradation and burn-in risks. Tandem architecture divides the workload:
- Two sub-pixel layers stack vertically.
- Each layer operates at half the current density to achieve equal combined photon output.
- Result: Double the operational longevity and unprecedented brightness uniformity.

### Repair Challenges & Precision Standards
Servicing these screens requires dedicated micro-engineering equipment:
- **TrueTone & Ambient Light Calibration**: Ambient light sensors and ambient color sensors require precise hardware EEPROM data transfer to preserve auto-white balance.
- **Digitizer Sensitivity**: Tandem OLED panels require exact dielectric spacing during optical lamination to ensure full sensitivity with Apple Pencil Pro pressure and tilt vectors.
- **Cleanroom Optical Bonding**: Any foreign contaminant between the stacked layers can refract light unevenly, necessitating strict Class 100 cleanroom environments.
    `,
  },
  {
    id: 4,
    title: 'Samsung Galaxy Z Fold & S24 Ultra Dynamic AMOLED 2X: Anatomy of Foldable & Ultra Displays',
    slug: 'samsung-galaxy-foldable-ultra-display-technology',
    excerpt:
      'Understanding the complexities of Samsung Ultra Thin Glass (UTG), flexible polyimide substrates, and hinge stress lines in modern foldable smartphones.',
    category: 'Samsung Devices',
    featuredImage: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
    author: 'Display Diagnostic Lab',
    readTime: '6 min read',
    publishedDate: 'September 05, 2026',
    tags: ['Samsung Galaxy', 'Z Fold', 'Z Flip', 'Dynamic AMOLED'],
    content: `
Samsung continues to pioneer mobile display technology with its Dynamic AMOLED 2X panels found on the Galaxy S-series and the flexible folding screens on the Galaxy Z Fold and Z Flip series. 

### Inside Foldable Display Construction
The flexible display inside a Galaxy Z Fold is a marvel of material science:
1. **Protective Top Layer**: Specially formulated shock-dispersing elastomer.
2. **Ultra Thin Glass (UTG)**: Glass processed to a thickness of only 30 micrometers, allowing it to flex with a tight radius without shattering.
3. **Flexible AMOLED Emitter**: Polyimide substrate that bends hundreds of thousands of times over the device lifecycle.
4. **Digitizer Layer**: Dual digitizer circuits split on both sides of the hinge for S-Pen input.

### Common Malfunctions in Foldable Panels
- **Black Crease Line**: When the inner hinge flexes repeatedly in dusty environments, micro-particulates can press upward into the substrate, severing scanning traces.
- **Hinge Flex Separation**: Flex cables routed through the central mechanical hinge can experience fatigue, resulting in intermittent display cutouts or flickering.

Specialized repair laboratories utilize bespoke alignment jigs and vacuum heating chucks designed specifically for curved and folding geometries.
    `,
  },
  {
    id: 5,
    title: 'Apple Watch Sapphire Crystal Display Restoration: Micro-Engineering for Wearables',
    slug: 'apple-watch-sapphire-crystal-display-restoration',
    excerpt:
      'How specialized micro-machining and sapphire glass bonding restore shattered Apple Watch Ultra and Series displays while maintaining full touch responsiveness.',
    category: 'Apple Devices',
    featuredImage: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
    author: 'Wearable Technology Lab',
    readTime: '5 min read',
    publishedDate: 'August 28, 2026',
    tags: ['Apple Watch', 'Sapphire Glass', 'OLED', 'Wearable Repair'],
    content: `
The Apple Watch Ultra 2 and Apple Watch Series models pack advanced OLED display technology into a compact wearable form factor. On stainless steel and titanium models, Apple covers the OLED with synthetic sapphire crystal—one of the hardest minerals known to science (ranking 9 on the Mohs hardness scale).

### Challenges with Sapphire Glass Fractures
While sapphire crystal resists daily scratches from sand and keys, sudden heavy impact against hard ceramic tiles or granite can fracture the crystal. 

Because the entire smartwatch assembly is sealed with waterproof gaskets and measures only a few centimeters across, restoring the display requires microscopic precision:
- **Micro-Thermal Heating**: Gentle, regulated heat softens the waterproof sealing glue without overheating the delicate miniature OLED panel.
- **Vacuum Separator**: Specialized micro-vacuum plates securely grip the watch chassis while diamond-tipped cutting wire separates the sapphire cover.
- **Capacitive Touch Alignment**: The touch digitizer on Apple Watch is mapped across compact curved edges; exact alignment is critical to ensure smooth swipe and Digital Crown navigation.
    `,
  },
  {
    id: 6,
    title: 'LTPO vs LTPS Display Technology: Variable Refresh Rates and Display Malfunctions',
    slug: 'ltpo-vs-ltps-display-technology-refresh-rates',
    excerpt:
      'How Low-Temperature Polycrystalline Oxide enables smooth 1Hz to 120Hz dynamic refresh rates, and what causes flicker or stutter when driver transistors destabilize.',
    category: 'Display Technology',
    featuredImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    author: 'Display Hardware Engineer',
    readTime: '6 min read',
    publishedDate: 'August 20, 2026',
    tags: ['LTPO', 'LTPS', 'Refresh Rate', 'ProMotion', 'Display Driver'],
    content: `
Modern smartphones boast variable refresh rate displays that transition seamlessly from 120Hz during intense gaming or scrolling down to 1Hz when reading an e-book or displaying Always-On notifications. This capability is made possible by LTPO (Low-Temperature Polycrystalline Oxide) backplane technology.

### LTPO vs LTPS Comparison
- **LTPS (Low-Temperature Polycrystalline Silicon)**:
  Offers superior electron mobility, enabling sharp resolution and fast refresh rates, but suffers from higher leakage current. Maintaining a static image at low refresh rates causes noticeable flickering.
- **LTPO (Hybrid Oxide-Silicon)**:
  Combines standard LTPS driver circuits with IGZO (Indium Gallium Zinc Oxide) switching transistors. IGZO has extremely low leakage current, allowing the display to hold a charge and run as low as 1Hz without flickering.

### Diagnosing Flickering & Refresh Rate Lock
When an LTPO display develops persistent flickering at low brightness or locks to 60Hz:
- **Gate-in-Panel (GIP) Circuit Degradation**: Microscopic voltage fluctuations across the gate lines cause uneven transistor charging.
- **PWM (Pulse-Width Modulation) Controller Failure**: At lower brightness levels, pulse-width dimming controllers can desynchronize, causing rapid strobe effects.

Display restoration laboratories test and calibrate these voltage rails using digital micro-oscilloscopes to restore stable dynamic refresh rates.
    `,
  },
];
