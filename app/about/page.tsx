import { Education } from "@/components/about/education";
import { Experience } from "@/components/about/experience";
import { PolaroidStrip } from "@/components/about/polaroid-strip";
import { Skills } from "@/components/about/skills";
import { Stack } from "@/components/about/stack";
import { ContactCard } from "@/components/contact/contact-card";
import { FadeIn } from "@/components/ui/motion-primitives";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "关于我",
  description: "户恒星的个人信息、核心优势、技术栈与项目经历。",
  path: "/about",
});

export default function AboutPage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-312 pt-40 sm:pt-56">
        <PolaroidStrip />
      </section>

      <section className="mx-auto w-full max-w-160 px-6 pt-20 pb-16 sm:px-10 sm:pt-28 sm:pb-24">
        <FadeIn delay={0.5}>
          <div className="rounded-4xl border border-foreground/5 bg-foreground/1.5 p-8 sm:p-12 dark:bg-foreground/3">
            <h1 className="font-serif text-[1.75rem] font-medium tracking-tight text-foreground sm:text-[2rem]">
              你好！我是 <span className="border-b border-foreground/30 pb-0.5">户恒星</span>。
            </h1>
            <div className="mt-8 space-y-6 text-[17px] leading-[1.7] tracking-tight text-foreground/75 sm:text-[18px]">
              <p>
                一名常驻上海的 <strong className="font-semibold text-foreground">AI 视频与全栈工程师</strong>，28 岁，本科学历。长期从事 <strong className="font-semibold text-foreground">智能视频分析</strong>、<strong className="font-semibold text-foreground">流媒体系统</strong> 与企业级业务平台研发。
              </p>
              <p>
                我的工作横跨底层与业务：从 <strong className="font-semibold text-foreground">CUDA / TensorRT 推理</strong>、DeepStream 视频管道、FFmpeg 音视频处理，到 Spring Cloud 微服务、数据库与消息中间件，再到 Vue / React 管理端和数据可视化。
              </p>
              <p>
                我擅长把算法能力 <strong className="font-semibold text-foreground">工程化落地</strong>，让模型、媒体链路与业务系统稳定协同，并能独立完成从方案设计、开发调试到部署交付的全过程。
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto w-full max-w-[40rem] px-6 pb-20 sm:px-10 sm:pb-28">
        <FadeIn delay={0.1}>
          <div className="flex flex-col gap-10">
            <Experience />
            <Education />
            <Skills />
            <Stack />
          </div>
        </FadeIn>
      </section>

      <ContactCard />
      <div className="h-12 sm:h-16" />
    </main>
  );
}
