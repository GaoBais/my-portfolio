"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import Marquee from "react-fast-marquee";

import { HeroCtas } from "./hero-ctas";
import { FadeIn, ScaleUnblur } from "@/components/ui/motion-primitives";
import { PortraitMorph } from "./portrait-morph";
import { useReducedMotion } from "@/lib/motion";
import { TECH_STACK } from "@/lib/tech-stack";

const PORTRAIT_SRC = "/huhengxing.jpg";
const PORTRAIT_HOVER_SRC = "/huhengxing.jpg";

export function Hero(): ReactNode {
  const reducedMotion = useReducedMotion();
  const stackItems = TECH_STACK.map((item) => (
    <span
      key={item.label}
      className="mx-6 inline-flex h-16 items-center gap-3 whitespace-nowrap text-[17px] font-medium tracking-tight text-foreground/70 sm:mx-8 sm:text-lg"
    >
      <Image
        src={item.iconUrl ?? `https://cdn.simpleicons.org/${item.slug}`}
        alt=""
        width={28}
        height={28}
        unoptimized
        className="h-7 w-7 shrink-0 opacity-60 brightness-0 dark:invert"
        draggable={false}
      />
      {item.label}
    </span>
  ));

  return (
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-275 px-6 pt-44 sm:px-10 sm:pt-56">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-8">
          <FadeIn className="flex flex-col gap-4">
            <p className="text-[20px] leading-tight tracking-tight font-medium text-foreground">
              你好，我是户恒星
            </p>

            <h1 className="text-[2.75rem] font-medium leading-[1.05] tracking-tight text-foreground md:text-[2.5rem] lg:text-[3.65rem]">
              <span className="block whitespace-nowrap text-primary">全栈工程师</span>
            </h1>

            <p className="max-w-[34ch] text-[22px] leading-[1.4] tracking-tight text-foreground/65">
              专注音视频处理技术与业务系统开发。从服务端到移动端，把需求做成稳定可靠的产品。
            </p>

            <HeroCtas />
          </FadeIn>

          <ScaleUnblur className="flex justify-stretch md:justify-end">
            <div className="relative aspect-square w-full md:max-w-105">
              <div className="relative h-full w-full">
                <PortraitMorph
                  srcA={PORTRAIT_SRC}
                  srcB={PORTRAIT_HOVER_SRC}
                  alt="户恒星工作照"
                />
              </div>
            </div>
          </ScaleUnblur>
        </div>

        <section aria-labelledby="hero-stack-title" className="mt-10 sm:mt-12">
          <div className="mb-2 flex min-h-10 items-center justify-between">
            <h2
              id="hero-stack-title"
              className="text-sm font-medium tracking-wide text-muted-foreground"
            >
              技术栈
            </h2>
          </div>
          {reducedMotion ? (
            <div className="flex flex-wrap justify-center">{stackItems}</div>
          ) : (
            <>
              <p className="sr-only">
                {TECH_STACK.map((item) => item.label).join("、")}
              </p>
              <div aria-hidden="true" className="min-h-16">
                <Marquee
                  speed={32}
                  pauseOnHover
                  autoFill
                  gradient
                  gradientColor="var(--background)"
                  gradientWidth={48}
                >
                  {stackItems}
                </Marquee>
              </div>
            </>
          )}
        </section>
      </div>
    </section>
  );
}
