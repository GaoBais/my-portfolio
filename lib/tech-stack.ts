export type TechStackItem = {
  label: string;
  slug: string;
  bg: string;
  fg: string;
  iconUrl?: string;
};

export const TECH_STACK: TechStackItem[] = [
  { label: "NVIDIA CUDA", slug: "nvidia", bg: "#76B900", fg: "#ffffff" },
  { label: "PyTorch", slug: "pytorch", bg: "#EE4C2C", fg: "#ffffff" },
  { label: "OpenCV", slug: "opencv", bg: "#1f1f1f", fg: "#ffffff" },
  { label: "FFmpeg", slug: "ffmpeg", bg: "#007808", fg: "#ffffff" },
  { label: "C++", slug: "cplusplus", bg: "#00599C", fg: "#ffffff" },
  { label: "Python", slug: "python", bg: "#2F74C0", fg: "#ffffff" },
  { label: "Java", slug: "openjdk", bg: "#007396", fg: "#ffffff" },
  { label: "Spring Boot", slug: "springboot", bg: "#6DB33F", fg: "#ffffff" },
  { label: "Kafka", slug: "apachekafka", bg: "#111111", fg: "#ffffff" },
  { label: "Redis", slug: "redis", bg: "#DC382D", fg: "#ffffff" },
  { label: "Vue", slug: "vuedotjs", bg: "#35495E", fg: "#ffffff" },
  { label: "React", slug: "react", bg: "#20232A", fg: "#61DAFB" },
  { label: "iOS", slug: "ios", bg: "#111111", fg: "#ffffff" },
  { label: "Android", slug: "android", bg: "#3DDC84", fg: "#073042" },
  { label: "React Native", slug: "react", bg: "#20232A", fg: "#61DAFB" },
  { label: "Expo", slug: "expo", bg: "#000020", fg: "#ffffff" },
  { label: "Docker", slug: "docker", bg: "#1D63ED", fg: "#ffffff" },
  { label: "Kubernetes", slug: "kubernetes", bg: "#326CE5", fg: "#ffffff" },
];
