export interface ProjectCaseStudy {
  id: string;
  title: string;
  badge: string;
  category: "Sistem Terdistribusi" | "Platform Full Stack" | "Infrastruktur Sistem";
  summary: string;
  architecture: {
    overview: string;
    flow: string[];
    tradeOffs: string;
    databaseStrategy: string;
  };
  metrics: {
    latency: string;
    throughput: string;
    uptime: string;
    efficiency: string;
  };
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  keyFeatures: string[];
  codeSample?: {
    filename: string;
    language: string;
    code: string;
  };
}

export interface TechSkill {
  name: string;
  category: "Backend & Terdistribusi" | "Database & Storage" | "DevOps & Cloud" | "Frontend & Web Modern";
  proficiency: number;
  icon: string;
  level: "Senior / Staff" | "Tingkat Lanjut" | "Mahir";
  productionUse: string;
}

export const BIODATA = {
  name: "Muhammad Devara",
  shortName: "Devara",
  title: "Arsitek Backend & Sistem Terdistribusi",
  subTitle: "Membangun microservices tangguh berlatensi rendah, arsitektur database performa tinggi, dan platform web full-stack berskala besar.",
  status: "Tersedia untuk Pekerjaan Full-Time & Kontrak Berdampak Tinggi",
  location: "Indonesia (UTC+7 / Remote Siap)",
  email: "defarahermawan@gmail.com",
  github: "https://github.com/devara-g",
  linkedin: "https://linkedin.com/in/devara",
  discord: "devara#0001",
  bio: "Software engineer yang berfokus pada arsitektur sistem backend berlatensi rendah, optimasi query database, microservices berbasis event, dan platform web berkeandalan tinggi. Berpengalaman merancang API REST/GraphQL yang tangguh, mengimplementasikan caching terdistribusi dengan Redis, menjaga integritas transaksi ACID pada PostgreSQL/MySQL, serta mengelola infrastruktur berbasis container Docker.",
  
  engineeringHighlights: [
    {
      metric: "< 16ms",
      label: "Latensi P99 API",
      description: "Optimasi connection pooling, asynchronous I/O, dan multi-tier in-memory caching.",
    },
    {
      metric: "5.000+ RPS",
      label: "Kapasitas Throughput",
      description: "Stress-test microservices menangani lonjakan trafik tinggi tanpa request yang hilang.",
    },
    {
      metric: "64%",
      label: "Reduksi Beban Query",
      description: "Refactoring skema relasional, composite B-Tree index, dan eliminasi bottleneck N+1.",
    },
    {
      metric: "99.98%",
      label: "SLA Uptime Produksi",
      description: "Health check container otomatis, circuit breaker, dan deployment CI/CD tanpa downtime.",
    },
  ],

  telemetry: {
    systemHealth: "99.98%",
    apiLatency: "14ms",
    dockerContainers: "16 Pod Aktif",
    cacheHitRate: "94.8%",
    linesOfCode: "160K+ Baris",
    uptime: "99.99%",
  },

  skills: [
    {
      name: "Node.js & TypeScript",
      category: "Backend & Terdistribusi",
      proficiency: 94,
      icon: "node",
      level: "Tingkat Lanjut",
      productionUse: "Optimasi event-loop, stream pipelines, worker threads, dan microservices Express/Fastify berlatensi ultra-rendah.",
    },
    {
      name: "PHP & Laravel",
      category: "Backend & Terdistribusi",
      proficiency: 92,
      icon: "php",
      level: "Tingkat Lanjut",
      productionUse: "Arsitektur domain-driven, asynchronous background queue, custom Eloquent query extensions, dan API RESTful.",
    },
    {
      name: "PostgreSQL & MySQL",
      category: "Database & Storage",
      proficiency: 90,
      icon: "database",
      level: "Tingkat Lanjut",
      productionUse: "Tuning rencana eksekusi query (EXPLAIN ANALYZE), composite B-tree indexing, partisi tabel, dan isolasi transaksi ACID.",
    },
    {
      name: "Redis & In-Memory Cache",
      category: "Database & Storage",
      proficiency: 86,
      icon: "redis",
      level: "Tingkat Lanjut",
      productionUse: "Pola cache-aside, distributed redlock synchronization, sliding window rate limiting, dan antrean Pub/Sub.",
    },
    {
      name: "Docker & Containerization",
      category: "DevOps & Cloud",
      proficiency: 88,
      icon: "docker",
      level: "Tingkat Lanjut",
      productionUse: "Multi-stage minimal image builds, orkestrasi Docker Compose, automated health checks, dan manajemen volume.",
    },
    {
      name: "REST & GraphQL Gateways",
      category: "Backend & Terdistribusi",
      proficiency: 92,
      icon: "api",
      level: "Tingkat Lanjut",
      productionUse: "Kontrak API idempoten, spesifikasi OpenAPI 3.0, keamanan JWT / OAuth2, dan algoritma rate limiting token bucket.",
    },
    {
      name: "Git & CI/CD Pipelines",
      category: "DevOps & Cloud",
      proficiency: 90,
      icon: "git",
      level: "Tingkat Lanjut",
      productionUse: "Automated linting, integration test suites, audit keamanan dependensi, dan pipeline rilis tanpa downtime.",
    },
    {
      name: "Next.js & React",
      category: "Frontend & Web Modern",
      proficiency: 88,
      icon: "react",
      level: "Mahir",
      productionUse: "React Server Components, App Router streaming, optimistic UI updates, dan arsitektur state management yang efisien.",
    },
    {
      name: "Tailwind CSS & Design Systems",
      category: "Frontend & Web Modern",
      proficiency: 94,
      icon: "tailwind",
      level: "Tingkat Lanjut",
      productionUse: "Sistem token desain kustom, layout responsif fluid, mikro-animasi hardware-accelerated, dan tema dark mode elegan.",
    },
  ] as TechSkill[],

  projects: [
    {
      id: "class-management",
      title: "Portal Informasi & Manajemen Akademik",
      badge: "Konkurensi Tinggi",
      category: "Platform Full Stack",
      summary:
        "Platform manajemen edukasi terpusat untuk presensi siswa real-time, arsip materi pelajaran terpusat, dan analitik nilai akademik.",
      architecture: {
        overview:
          "Arsitektur MVC modular dengan pembaruan asynchronous client-side, indexing database untuk pencarian data siswa instan, dan manajemen sesi yang aman.",
        flow: [
          "Verifikasi CSRF & Otorisasi RBAC di tingkat gateway permintaan client",
          "Controller meneruskan ke AttendanceService khusus dengan transaksi database ACID atomik",
          "Query relasional berindeks dieksekusi dalam waktu < 12ms",
          "Tampilan antarmuka langsung diperbarui secara optimistik di sisi browser",
        ],
        tradeOffs:
          "Memilih transaksi ACID PostgreSQL/MySQL daripada NoSQL untuk menjamin integritas data dan mencegah rekaman absensi ganda atau benturan nilai.",
        databaseStrategy:
          "Indeks komposit pada `(class_id, academic_year, created_at)` memangkas waktu scan dari 420ms menjadi 4.2ms pada 50.000+ data absensi.",
      },
      metrics: {
        latency: "12ms P99",
        throughput: "1.2k req/hari",
        uptime: "99.8%",
        efficiency: "78% optimasi query",
      },
      image: "/assets/kelas.png",
      tags: ["PHP", "MySQL", "Vanilla JS", "Bootstrap", "Chart.js", "Docker"],
      liveUrl: "https://pplg1.wuaze.com",
      githubUrl: "https://github.com/devara-g/class-information-website",
      keyFeatures: [
        "Kontrol Akses Berbasis Peran (RBAC) memisahkan hak akses Siswa, Guru, dan Administrator",
        "Transaksi database atomik menjamin tidak ada duplikasi pencatatan absensi",
        "Visualisasi grafik interaktif Chart.js untuk performa nilai akademik siswa",
        "Pipeline pembuatan laporan otomatis mengekspor berkas PDF & Excel terenkripsi",
      ],
      codeSample: {
        filename: "AttendanceRepository.php",
        language: "php",
        code: `public function recordBatchAttendance(string $classId, array $records): bool 
{
    return DB::transaction(function () use ($classId, $records) {
        $timestamp = now();
        $payload = array_map(fn($r) => [
            'class_id' => $classId,
            'student_id' => $r['id'],
            'status' => $r['status'],
            'recorded_at' => $timestamp,
        ], $records);

        // Bulk upsert aman dari race condition
        return DB::table('attendance_logs')
            ->upsert($payload, ['class_id', 'student_id', 'recorded_at'], ['status']);
    });
}`,
      },
    },
    {
      id: "p3-portal-system",
      title: "Portal Operasional & Data Pipeline Enterprise P3",
      badge: "Standar Enterprise",
      category: "Sistem Terdistribusi",
      summary:
        "Portal operasional berkeandalan tinggi dibangun dengan Laravel dan PostgreSQL untuk sinkronisasi workflow data, audit log lengkap, dan pelaporan internal.",
      architecture: {
        overview:
          "Arsitektur berlapis enterprise yang mengintegrasikan autentikasi berbasis token, background queue listeners, validasi data bertingkat, dan audit log otomatis.",
        flow: [
          "API Gateway memvalidasi bearer token OAuth2 dan izin akses pengguna",
          "Request melewati middleware sanitasi & validasi data bertingkat",
          "Pipeline data menulis ke database master PostgreSQL dengan pencatatan audit trail otomatis",
          "Antrean asinkronus mengirimkan webhook notifikasi tanpa menghambat response pengguna",
        ],
        tradeOffs:
          "Menerapkan antrean worker asinkronus untuk proses ekspor data berat agar latensi endpoint API tetap stabil di bawah 30ms pada jam sibuk.",
        databaseStrategy:
          "Partisi tabel PostgreSQL berdasarkan bulan pada tabel audit log untuk mencegah penurunan performa indeks pada data bervolume tinggi.",
      },
      metrics: {
        latency: "18ms P99",
        throughput: "4.5k req/hari",
        uptime: "99.95%",
        efficiency: "60% hemat memori",
      },
      image: "/assets/p3.png",
      tags: ["Laravel", "PostgreSQL", "Tailwind CSS", "REST API", "Docker", "Redis"],
      liveUrl: "https://p3test.free.nf",
      githubUrl: "https://github.com/devara-g/information-p3-website",
      keyFeatures: [
        "Autentikasi berbasis token aman dengan fitur pencabutan instan & pengikatan IP",
        "Query PostgreSQL teroptimasi dengan waktu respon di bawah 25ms saat beban puncak",
        "Pencatatan audit log otomatis mencatat semua aktivitas mutasi data dan telemetri user",
        "Deployment berbasis Docker multi-stage memastikan replikasi sandbox yang konsisten",
      ],
      codeSample: {
        filename: "AuditLogMiddleware.php",
        language: "php",
        code: `public function handle(Request $request, Closure $next): Response
{
    $startTime = microtime(true);
    $response = $next($request);
    $duration = (microtime(true) - $startTime) * 1000;

    // Dispatch audit telemetri secara asinkronus
    AuditTelemetryJob::dispatch([
        'user_id' => $request->user()?->id,
        'endpoint' => $request->path(),
        'method' => $request->method(),
        'status' => $response->getStatusCode(),
        'duration_ms' => round($duration, 2),
        'ip' => $request->ip(),
    ])->onQueue('telemetry');

    return $response;
}`,
      },
    },
    {
      id: "admin-control-center",
      title: "Pusat Kontrol Admin & Telemetri CRUD Master",
      badge: "Throughput Tinggi",
      category: "Infrastruktur Sistem",
      summary:
        "Dashboard administratif modular yang dirancang untuk pemantauan throughput sistem secara real-time, mutasi dataset batch, dan pelacakan status server.",
      architecture: {
        overview:
          "Dashboard kontrol frontend performa tinggi yang berkomunikasi dengan endpoint REST API dengan caching client-side dan debounced mutation.",
        flow: [
          "Dashboard client meminta endpoint telemetri server dengan caching ETag",
          "Server memvalidasi status cache (304 Not Modified) menghemat penggunaan bandwidth",
          "Mutasi data dieksekusi dengan teknik batch chunking untuk mencegah penguncian tabel database",
        ],
        tradeOffs:
          "Menggunakan client-side cache in-memory dengan mekanisme invalidasi pintar daripada polling terus-menerus, memangkas 85% request jaringan yang tidak perlu.",
        databaseStrategy:
          "Insert batch dibatasi maksimal 500 baris per transaksi untuk mencegah lock starvation pada tabel aktif.",
      },
      metrics: {
        latency: "10ms P99",
        throughput: "2.8k req/hari",
        uptime: "100%",
        efficiency: "85% hemat bandwidth",
      },
      image: "/assets/sbadmin.png",
      tags: ["JavaScript", "REST API", "SQL", "Bootstrap 5", "Analytics"],
      liveUrl: "#",
      githubUrl: "https://github.com/devara-g/crud-akademik",
      keyFeatures: [
        "Grafik real-time interaktif untuk pemantauan throughput dan status sistem",
        "Pemrosesan mutasi data batch dengan transaksi chunked dan rollback otomatis jika gagal",
        "Antarmuka responsif dark mode berdaya kontras tinggi dengan data tabel yang rapi",
        "Validasi input ketat mencegah serangan SQL Injection dan celah XSS",
      ],
      codeSample: {
        filename: "batchProcessor.js",
        language: "javascript",
        code: `export async function processBatchMutations(items, chunkSize = 250) {
  const results = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const res = await fetch('/api/v1/master/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batch: chunk })
    });
    if (!res.ok) throw new Error(\`Batch gagal pada offset \${i}\`);
    results.push(await res.json());
  }
  return results;
}`,
      },
    },
  ] as ProjectCaseStudy[],

  careerMilestones: [
    {
      period: "2025 — Sekarang",
      role: "Backend Architect & Distributed Systems Engineer",
      organization: "Sistem Mandiri & Skala Tinggi",
      description:
        "Merancang API REST/GraphQL yang tangguh, caching terdistribusi dengan Redis, dan microservices berbasis container. Spesialisasi dalam optimasi query database, event loop berkonkurensi tinggi, dan pipeline CI/CD otomatis.",
      highlights: [
        "Merancang microservices backend yang mampu menangani 5.000+ RPS dengan latensi P99 < 16ms",
        "Menerapkan strategi composite indexing yang memangkas waktu query hingga 64%",
        "Mendesain skema database dengan jaminan integritas transaksi ACID",
      ],
    },
    {
      period: "2024 — 2025",
      role: "Lead Full Stack Engineer",
      organization: "Platform Digital Edukasi & Enterprise",
      description:
        "Memimpin pengembangan menyeluruh platform informasi sekolah dan portal operasional perusahaan. Membangun model database relasional, mengintegrasikan autentikasi berbasis peran (RBAC), dan antarmuka responsif.",
      highlights: [
        "Meluncurkan portal produksi yang melayani ratusan pengguna aktif harian",
        "Membangun pipeline pelaporan otomatis yang menghasilkan arsip nilai PDF & Excel terenkripsi",
        "Melakukan containerisasi lingkungan kerja menggunakan Docker & Docker Compose",
      ],
    },
    {
      period: "2023 — 2024",
      role: "Software Systems & Database Craftsman",
      organization: "Pondasi Arsitektur Perangkat Lunak",
      description:
        "Mendalami mekanisme indexing database internal, rencana eksekusi query relasional, manajemen server Linux, paradigma pemrograman asinkronus, dan pengembangan aplikasi web modern.",
      highlights: [
        "Studi mendalam mengenai PostgreSQL EXPLAIN ANALYZE, struktur B-Tree index, dan level isolasi ACID",
        "Membangun berbagai RESTful API modular dan aplikasi web interaktif",
      ],
    },
  ],
};
