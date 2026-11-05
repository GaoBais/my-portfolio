import {
  ArrowRight,
  AudioLines,
  Cpu,
  HardHat,
  Landmark,
  Radio,
  ScanSearch,
  Smartphone,
  Video,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/ui/motion-primitives";

/** Cover photography is sourced from Unsplash. */

type Project = {
  id: string;
  icon: ComponentType<{ className?: string }>;
  iconLabel: string;
  title: string;
  description: string;
  meta: string;
  imageRatio: number;
  image: string;
  imageAlt: string;
};

const PROJECTS: Project[] = [
  {
    id: "midway",
    icon: Video,
    iconLabel: "智能视频分析平台 Midway",
    title:
      "多路视频实时分析平台：从视频接入、GPU 推理、目标跟踪到告警输出的完整链路。",
    description:
      "基于 DeepStream / GStreamer 组织视频管道，TensorRT 执行检测模型，NvDCF 完成跨帧跟踪，并通过 Spring Cloud 微服务、Kafka 与对象存储承接任务、告警和结果数据。",
    meta: "DeepStream · CUDA · TensorRT · Spring Cloud",
    imageRatio: 1080 / 720,
    image:
      "https://images.unsplash.com/photo-1618482914248-29272d021005?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1080&h=720",
    imageAlt: "立杆上的多路监控摄像机",
  },
  {
    id: "traffic",
    icon: ScanSearch,
    iconLabel: "交通事件检测系统",
    title: "道路视频多阶段识别，支撑连续交通事件判断。",
    description:
      "串联主检测、目标跟踪、车头 / 车尾分类、车牌检测与车牌分类，结合连续目标状态判断交通事件；以 JavaCV、Quartz 和 REST 服务组织任务调度与结果推送。",
    meta: "DeepStream · YOLOv5 · JavaCV · Quartz",
    imageRatio: 1080 / 720,
    image:
      "https://images.unsplash.com/photo-1765614083044-34ede9537fb6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1080&h=720",
    imageAlt: "夜间城市道路车流",
  },
  {
    id: "video-media",
    icon: Radio,
    iconLabel: "视频管理与流媒体录像",
    title: "摄像机接入、拉流转发、录像回放与浏览器低延迟播放。",
    description:
      "通过 FFmpeg、GStreamer 与 C++ 原生录像客户端处理 RTSP / RTMP 链路，RTSP 转 WebRTC 实现网页低延迟播放，录像分片写入 MinIO 并统一管理媒体元数据。",
    meta: "FFmpeg · RTSP · WebRTC · MinIO · C++",
    imageRatio: 1080 / 720,
    image:
      "https://images.unsplash.com/photo-1589935447067-5531094415d1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1080&h=720",
    imageAlt: "两台安装在立杆上的网络摄像机",
  },
  {
    id: "supervision",
    icon: Landmark,
    iconLabel: "政务督察综合应用",
    title: "面向政务场景的综合业务与督察管理平台。",
    description:
      "以 Spring Boot / Spring Cloud 构建业务服务与治理能力，MyBatis-Plus、Redis 与多数据源管理业务数据，Vue + Element 交付管理后台与数据看板。",
    meta: "Spring Boot · MyBatis · Redis · Vue",
    imageRatio: 1080 / 720,
    image:
      "https://images.unsplash.com/photo-1576831356777-59f382e176b4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1080&h=720",
    imageAlt: "现代混凝土建筑外立面",
  },
  {
    id: "industrial",
    icon: HardHat,
    iconLabel: "工业安全视觉 SDK",
    title: "将检测模型封装为 Java 可调用的高性能原生推理 SDK。",
    description:
      "完成 PyTorch → ONNX → TensorRT 部署链路，编写 CUDA 预处理与解码 Plugin，通过 JNI 向 Java 业务返回推理结果，并适配 x86 独显与 Jetson 边缘设备。",
    meta: "TensorRT · CUDA · ONNX · JNI · Jetson",
    imageRatio: 1080 / 720,
    image:
      "https://images.unsplash.com/photo-1582489853490-cd3a53eb4530?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1080&h=720",
    imageAlt: "工厂中悬挂的白色安全帽",
  },
  {
    id: "voiceai",
    icon: AudioLines,
    iconLabel: "音视频分析与语音业务",
    title: "音频采集、信号处理、语音转写与波形交互一体化。",
    description:
      "使用 NumPy、SciPy、librosa 处理音频特征，结合 WhisperX 完成转写，WebSocket 推送实时结果，前端以 wavesurfer.js 呈现波形与回放交互。",
    meta: "Python · WhisperX · WebSocket · WaveSurfer",
    imageRatio: 1080 / 720,
    image:
      "https://images.unsplash.com/photo-1777908484108-3e4ccb6ea1cf?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1080&h=720",
    imageAlt: "抽象音频波形",
  },
  {
    id: "echomind",
    icon: Cpu,
    iconLabel: "EchoMind",
    title: "个人作品：GPU 加速的音频智能分析应用。",
    description:
      "整合 FFmpeg 音频处理、CUDA 加速模型推理与业务交互，探索语音理解在实际场景中的落地方式。",
    meta: "个人作品 · github.com/GaoBais/EchoMind",
    imageRatio: 1080 / 720,
    image:
      "https://images.unsplash.com/photo-1595598237436-bf64a3bf18cd?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1080&h=720",
    imageAlt: "显示器前的耳机",
  },
  {
    id: "yolodetect",
    icon: ScanSearch,
    iconLabel: "YoloDetect",
    title: "个人作品：基于 YOLO 的目标检测工程。",
    description:
      "使用 PyTorch、YOLOv5 与 OpenCV 实现图像与视频目标检测，覆盖模型推理、结果绘制与视频输出。",
    meta: "个人作品 · github.com/GaoBais/YoloDetect",
    imageRatio: 1080 / 720,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1080&h=720",
    imageAlt: "电路板微距照片",
  },
  {
    id: "video-platform",
    icon: Video,
    iconLabel: "video-platform",
    title: "个人作品：一体化视频分析平台。",
    description:
      "整合视频接入、ONNX Runtime 模型运行与平台服务，验证轻量化视频智能分析的工程方案。",
    meta: "个人作品 · github.com/GaoBais/video-platform",
    imageRatio: 1080 / 720,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1080&h=720",
    imageAlt: "笔记本屏幕上的数据分析图表",
  },
  {
    id: "reusephone",
    icon: Smartphone,
    iconLabel: "ReusePhone",
    title: "个人作品：让闲置手机变成网络摄像头。",
    description:
      "基于 WebRTC、WebSocket 信令与 JNI 原生能力，实现手机端采集、实时传输与多端协作。",
    meta: "个人作品 · github.com/GaoBais/ReusePhone",
    imageRatio: 1080 / 720,
    image:
      "https://images.unsplash.com/photo-1558383745-6274e5c505c5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1080&h=720",
    imageAlt: "黑色相机镜头特写",
  },
];

export type ProjectsProps = {
  withHeadline?: boolean;
  viewMoreVisible?: boolean;
};

export function Projects({
  withHeadline = false,
  viewMoreVisible = false,
}: ProjectsProps): ReactNode {
  const items = viewMoreVisible ? PROJECTS.slice(0, 4) : PROJECTS;

  return (
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        {withHeadline ? (
          <FadeIn className="flex flex-col items-center gap-5 pt-12 pb-10 text-center sm:pt-20 sm:pb-14">
            <h2 className="font-serif text-[2.5rem] font-medium leading-[1.05] tracking-tight text-foreground md:text-[3rem] lg:text-[3.5rem]">
              项目与作品
            </h2>
            <p className="max-w-[33ch] text-[18px] leading-[1.45] tracking-tight text-foreground/65 sm:text-[20px]">
              从 GPU 视频分析到流媒体与业务平台，这些是我参与交付和独立完成的工程。
            </p>
          </FadeIn>
        ) : null}

        <div className="columns-1 gap-6 md:columns-2 md:gap-7">
          {items.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {viewMoreVisible ? (
          <div className="mt-12 flex justify-center sm:mt-16">
            <Link
              href="/projects"
              className="border border-foreground/8 focus-ring group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
            >
              查看全部项目
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}): ReactNode {
  const Icon = project.icon;
  return (
    <FadeIn
      delay={Math.min(index * 0.06, 0.3)}
      className="mb-6 break-inside-avoid md:mb-7"
    >
      <article className="project-card flex cursor-pointer flex-col gap-4 rounded-3xl border border-foreground/8 bg-background p-3 sm:p-3.5">
        <header className="flex items-center gap-2.5 px-1 pt-2">
          <span className="border-foreground/10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-background">
            <Icon className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium tracking-tight text-foreground">
            {project.iconLabel}
          </span>
        </header>

        <div
          className="project-card__image ring-foreground/5 relative w-full overflow-hidden rounded-2xl bg-foreground/5 ring-1"
          style={{ aspectRatio: project.imageRatio }}
        >
          <div className="project-card__image-inner">
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              sizes="(min-width: 1024px) 540px, (min-width: 768px) 45vw, 100vw"
              className="object-cover"
              priority={index < 2}
              unoptimized
            />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 px-1 pb-1">
          <h3 className="text-[20px] font-medium leading-[1.2] tracking-tight text-foreground sm:text-[22px]">
            {project.title}
          </h3>
          <p className="text-[14px] leading-normal tracking-tight text-foreground/65 sm:text-[15px]">
            {project.description}
          </p>
        </div>

        <p className="px-1 pb-2 text-[12px] tracking-tight text-foreground/50">
          {project.meta}
        </p>
      </article>
    </FadeIn>
  );
}
