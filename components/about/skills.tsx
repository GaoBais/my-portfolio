import type { ReactNode } from "react";

const SKILLS = [
  "GPU 视频智能分析",
  "模型推理部署与加速",
  "音视频流媒体处理",
  "Java / C++ 跨语言集成",
  "微服务架构与中间件",
  "设备 SDK 与协议接入",
  "前端与数据可视化",
  "容器化部署与可观测性",
  "端到端独立交付",
];

export function Skills(): ReactNode {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
        核心优势
      </h3>
      <div className="rounded-4xl border border-foreground/5 bg-foreground/2 p-2 sm:p-4 dark:bg-foreground/5">
        <div className="flex flex-wrap gap-3">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-foreground/8 bg-background px-4 py-2 text-[14px] tracking-tight text-foreground/85 sm:text-[15px]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
