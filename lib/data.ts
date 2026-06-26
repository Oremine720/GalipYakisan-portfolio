export const PERSONAL_INFO = {
  name: "Galip Yakışan",
  title: "Full Stack Developer",
  subtitle: "AI Enthusiast & Computer Programmer",
  bio: "Yazılım geliştirme ve algoritmik problem çözme süreçleri, profesyonel gelişimimin temel odak noktasını oluşturmaktadır. Özellikle C#, React ve yapay zeka teknolojileri ağırlıklı olmak üzere, yazılım mimarisi gerektiren her alanda çalışmaya yüksek motivasyon duyuyorum.",
  bioExtended:
    "Geliştirme süreçlerinde karşılaştığım teknik problemlerde, kapsamlı kaynak araştırması yaparak analitik ve kalıcı çözümler üretmeyi prensip ediniyorum. Temel kariyer hedefim; DGS ile eğitimimi Yazılım Mühendisliği alanında tamamlayarak, sektörde değer üreten yetkin bir Full-Stack Developer olmaktır.",
  email: "galipyakisan@gmail.com",
  phone: "",
  github: "https://github.com/Oremine720",
  githubUsername: "Oremine720",
  linkedin: "https://linkedin.com/in/galip-yakışan",
  location: "Burdur, Türkiye",
  cvUrl: "/GalipCV.pdf",
  availableForWork: true,
};

export const SKILLS = [
  {
    name: "C#",
    level: 85,
    category: "Backend",
    icon: "⚡",
    color: "#6366f1",
  },
  {
    name: "ASP.NET Core",
    level: 75,
    category: "Backend",
    icon: "🔷",
    color: "#8b5cf6",
  },
  {
    name: "React Native",
    level: 70,
    category: "Mobile",
    icon: "📱",
    color: "#06b6d4",
  },
  {
    name: "Python",
    level: 72,
    category: "AI/ML",
    icon: "🐍",
    color: "#f59e0b",
  },
  {
    name: "PHP",
    level: 68,
    category: "Backend",
    icon: "🐘",
    color: "#8b5cf6",
  },
  {
    name: "SQL",
    level: 78,
    category: "Database",
    icon: "🗄️",
    color: "#10b981",
  },
  {
    name: "HTML5",
    level: 90,
    category: "Frontend",
    icon: "🌐",
    color: "#f97316",
  },
  {
    name: "CSS3",
    level: 85,
    category: "Frontend",
    icon: "🎨",
    color: "#3b82f6",
  },
  {
    name: "Git",
    level: 80,
    category: "DevOps",
    icon: "🔧",
    color: "#ef4444",
  },
  {
    name: "GitHub",
    level: 82,
    category: "DevOps",
    icon: "🐙",
    color: "#f8f8f8",
  },
  {
    name: "UI/UX",
    level: 74,
    category: "Design",
    icon: "✨",
    color: "#ec4899",
  },
  {
    name: "Kotlin",
    level: 55,
    category: "Mobile",
    icon: "🚀",
    color: "#a855f7",
  },
];

export const SKILL_CATEGORIES = ["Tümü", "Frontend", "Backend", "Mobile", "Database", "AI/ML", "DevOps", "Design"];

export const PROJECTS = [
  {
    id: 1,
    title: "MirEditor AI",
    subtitle: "AI Destekli Masaüstü Fotoğraf Editörü",
    description:
      "C# ve React Native ile geliştirilen, 'Mira' yapay zeka asistanı ve gelişmiş katman yönetimi içeren ekip projesi. Profesyonel düzeyde fotoğraf düzenleme araçları ve AI destekli otomatik iyileştirme özellikleri sunuyor.",
    tech: ["C#", "React Native", "AI/ML", "WinUI"],
    status: "In Progress",
    statusColor: "#f59e0b",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    icon: "🤖",
    github: "https://github.com/Oremine720",
    demo: null,
    featured: true,
    year: "2024",
  },
  {
    id: 2,
    title: "Mira AI Assistant",
    subtitle: "Yapay Zeka Asistanı",
    description:
      "MirEditor projesinin yapay zeka bileşeni. Fotoğraf analizi, otomatik iyileştirme önerileri ve doğal dil komutları ile fotoğraf düzenleme yapabilen akıllı asistan.",
    tech: ["Python", "AI/ML", "C#", "NLP"],
    status: "In Progress",
    statusColor: "#f59e0b",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    icon: "🧠",
    github: "https://github.com/Oremine720",
    demo: null,
    featured: true,
    year: "2024",
  },
  {
    id: 3,
    title: "Manav Yönetim Sistemi",
    subtitle: "Masaüstü İşletme Yönetimi",
    description:
      "C# ve MS Access kullanılarak geliştirilen kapsamlı ürün/stok takip masaüstü uygulaması. Satış yönetimi, stok kontrolü ve raporlama özellikleri içeriyor.",
    tech: ["C#", "MS Access", "WinForms", "SQL"],
    status: "Completed",
    statusColor: "#10b981",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    icon: "🏪",
    github: "https://github.com/Oremine720",
    demo: null,
    featured: false,
    year: "2024",
  },
  {
    id: 4,
    title: "Kütüphane Web Sitesi",
    subtitle: "Dinamik Web Uygulaması",
    description:
      "PHP, HTML ve CSS ile kodlanmış, dinamik içerik yönetimine sahip kütüphane web projesi. Kitap yönetimi, üye sistemi ve ödünç alma takibi özellikleri.",
    tech: ["PHP", "HTML5", "CSS3", "MySQL"],
    status: "Completed",
    statusColor: "#10b981",
    gradient: "from-orange-500 via-red-500 to-pink-500",
    icon: "📚",
    github: "https://github.com/Oremine720",
    demo: null,
    featured: false,
    year: "2023",
  },
  {
    id: 5,
    title: "Kişisel Portföy Sitesi",
    subtitle: "Responsive Web Arayüzü",
    description:
      "HTML5 ve CSS3 ile tüm cihazlara uyumlu (responsive) tasarlanmış kişisel portföy web arayüzü. Modern tasarım prensipleri ile hazırlandı.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    status: "Completed",
    statusColor: "#10b981",
    gradient: "from-violet-500 via-purple-500 to-indigo-500",
    icon: "💼",
    github: "https://github.com/Oremine720",
    demo: null,
    featured: false,
    year: "2023",
  },
];

export const EDUCATION = [
  {
    school: "Mehmet Akif Ersoy Üniversitesi",
    degree: "Bilgisayar Programcılığı",
    type: "Ön Lisans",
    gpa: "3.76",
    location: "Burdur, Türkiye",
    startDate: "Eylül 2024",
    endDate: "Haziran 2026",
    current: true,
    description:
      "Veri yapıları, algoritma analizi, yazılım geliştirme metodolojileri ve veritabanı yönetim sistemleri üzerine kapsamlı eğitim.",
    courses: [
      "Veri Yapıları ve Algoritmalar",
      "Nesne Yönelimli Programlama",
      "Veritabanı Yönetim Sistemleri",
      "Web Programlama",
      "Ağ Temelleri",
    ],
  },
];

export const CERTIFICATES = [
  {
    title: "Ağ Temelleri",
    issuer: "BTK Akademi",
    date: "2024",
    icon: "🌐",
    color: "#6366f1",
    credentialUrl: "#",
  },
  {
    title: "HTML5 ile Web Geliştirme",
    issuer: "BTK Akademi",
    date: "2024",
    icon: "🌍",
    color: "#f97316",
    credentialUrl: "#",
  },
  {
    title: "CSS Temelleri",
    issuer: "BTK Akademi",
    date: "2024",
    icon: "🎨",
    color: "#3b82f6",
    credentialUrl: "#",
  },
];

export const SOCIAL_LINKS = [
  {
    name: "GitHub",
    url: "https://github.com/Oremine720",
    icon: "github",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/galip-yakışan",
    icon: "linkedin",
  },
  {
    name: "Email",
    url: "mailto:galipyakisan@gmail.com",
    icon: "mail",
  },
];
