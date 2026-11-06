# 户恒星

**全栈工程师｜音视频处理 · Java 业务系统 · 跨端应用与 SDK**

电话：18817720375 · 邮箱：[orion.hengxing@gmail.com](mailto:orion.hengxing@gmail.com)  
GitHub：[GaoBais](https://github.com/GaoBais)

> 第一版草稿：先呈现能力和项目经历，任职信息及待核对内容见文末。

## 个人简介

专注音视频处理技术与业务系统开发。从服务端到移动端，把需求做成稳定可靠的产品。

开发经历覆盖音视频管道、GPU 模型推理、移动端 AR SDK、Java 业务平台、Web 管理端及 iOS / Android 应用，能够衔接底层处理、服务端接口与终端交互，完成从功能开发、系统联调到部署的工程工作。

## 核心技能

| 方向           | 技术与实践                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| 编程语言       | Java、C++、Python、Dart、TypeScript；项目中使用 Swift、Kotlin、Rust 进行原生功能与跨平台能力集成             |
| 音视频处理     | FFmpeg、GStreamer、RTSP / RTMP、WebRTC；视频接入、拉流转发、分段录像、浏览器播放与音频处理                   |
| GPU 与推理 SDK | DeepStream、CUDA、TensorRT、ONNX、PyTorch、OpenCV；模型部署、预处理与解码、目标跟踪、JNI 集成                |
| 后端业务       | Spring Boot、Spring Cloud、MyBatis-Plus、Redis、Kafka；业务接口、数据访问、缓存与消息处理                    |
| Web 前端       | Vue、React；管理后台、业务页面与数据可视化                                                                   |
| 移动端与 AR    | Flutter、React Native、Expo、iOS / Android；原生模块桥接、端侧人脸分析、OpenGL ES / Metal 渲染与设备能力接入 |
| 部署与集成     | Docker、Kubernetes；服务部署、跨语言调用及多端联调                                                           |

## 代表项目

### Midway｜智能视频监测与分析平台

**项目角色：** 项目负责人，主导研发并带领团队完成交付  
**项目时间：** 2020 年完成首版，后续迭代多个版本  
**技术栈（后续迭代）：** Java、Spring Boot / Spring Cloud、Vue、C++、DeepStream、GStreamer、CUDA / TensorRT、Redis、MongoDB、MinIO、Docker

面向多路监控视频的实时分析与行为预警平台，由 Java / Vue 业务端、C++ GPU 推理引擎、数据集标注与模型训练平台三部分组成，覆盖视频接入、任务布控、行为分析、证据留存及告警处置。

- **项目主导与团队交付：** 主导项目研发，组织团队完成业务端、推理端和数据平台建设，推动数据标注、模型训练与业务功能协同迭代，完成首版交付及后续版本演进。
- **业务平台与视频接入：** 带领团队建设设备管理、场景与模型配置、任务布控、定时巡检和告警管理功能；集成摄像头厂商 SDK、流媒体代理及 WebRTC 预览，衔接视频资源与业务操作。
- **GPU 推理链路：** 基于 C++、DeepStream / GStreamer 和 TensorRT 构建多路视频处理管道，串联目标检测、NvDCF 跟踪与多级分类，支撑吸烟、使用手机、睡岗等行为分析。
- **多摄像头与区域规则：** 按任务、模型和摄像头组织多区域分析，结合目标类别、数量、置信度及区域位置进行规则判断，并通过持续时长、有效帧比例和告警冷却控制事件触发。
- **资源调度与运行管理：** 基于 Redis 管理推理管道容量并分配任务，通过 REST 接口完成 Java 与 C++ 服务交互；实现视频源复用、动态任务启停、异常重试及服务重启后的任务恢复。
- **告警证据与业务处置：** 串联关键时刻截图、事件录像、ROI 与目标框标注、MinIO 证据存储及 MongoDB 告警入库，支持告警审核、上报、统计和导出，形成可追溯的事件处理流程。

### Yoloful SDK｜实时人脸 AR 与虚拟试妆

**技术栈：** Flutter、Dart、C++、Pigeon、Kotlin、Swift / Objective-C++、Camera2、AVFoundation、OpenGL ES、Metal

面向 iOS / Android 宿主 App 的 Flutter SDK，提供端侧人脸跟踪、美颜、虚拟美妆、LUT 滤镜及妆容预设，通过私有授权渠道分发。

- 设计统一 Session API 管理实时相机与静态照片编辑，共享效果控制、参数状态和资源管理，明确宿主应用与 SDK 的职责。
- 以共享 C++ 核心组织逐帧处理，连接 Android Camera2 / OpenGL ES 与 iOS AVFoundation / Metal，实现原生相机输入、图像效果处理和预览输出。
- 管理相机帧、分析结果与 GPU 资源的生命周期及模式切换；将实时像素和人脸关键点保留在原生路径，通过 Flutter 桥接传递控制与状态。
- 对美妆 SKU 和效果参数进行类型化建模，实现资源包校验、事务激活、回滚与目录租约，并维护预编译原生库、接入示例和版本迁移文档。

### Java 业务系统｜政务督察综合应用

**技术栈：** Java、Spring Boot、Spring Cloud、MyBatis-Plus、Redis、Vue、Element

面向政务业务与督察管理场景，开发业务后端及配套管理后台。

- 基于 Spring Boot / Spring Cloud 构建业务服务，以 MyBatis-Plus 和多数据源管理完成数据访问与业务数据组织。
- 集成 Redis，并围绕业务流程开发服务端接口，完成与管理后台的联调。
- 使用 Vue / Element 实现管理页面与数据看板，衔接业务处理、数据管理和结果展示。

### Pia｜跨平台便签与待办应用

**技术栈：** React、React Native、Expo、Tauri、Rust、SQLite、Swift / Kotlin 原生模块  
**项目阶段：** 移动端内测开发中，尚未发布。

面向桌面与移动端的便签和轻量待办工具，支持本地使用，并提供账号与同步相关能力。

- 使用 React Native / Expo 开发 iOS、Android 共用的便签、清单、搜索筛选、归档及回收站页面。
- 通过 Swift / Kotlin 原生模块连接 Rust 业务核心与 SQLite 存储，复用跨平台的数据处理能力。
- 实现 Google / Apple 登录及同步相关流程，区分本地内容与账号空间，处理编辑草稿恢复和版本冲突。
- 桌面端采用 Tauri / React，支持多便签窗口、置顶、布局恢复与本地数据管理。

### Card Alarm｜NFC 闹钟应用

**技术栈：** Swift / SwiftUI、Kotlin / Jetpack Compose、AlarmKit、Core NFC、Android AlarmManager、P-256  
**项目阶段：** 开发中，尚未发布；设备与实体卡片验收待完成。

围绕指定 NFC 卡片与闹钟交互开发原生 iOS / Android 应用。

- 使用 SwiftUI 和 Jetpack Compose 开发闹钟、卡片管理、权限引导与设置页面。
- 分别接入 iOS AlarmKit / Core NFC，以及 Android 系统闹钟、前台服务与 NFC 读卡能力，处理两端不同的权限和运行条件。
- 实现卡片数据解析与 P-256 签名校验，使用共享测试向量验证两端协议行为，并支持多语言及独立的地区、时区设置。

## SDK 与其他工程经历

- **工业安全视觉 SDK：** 完成 PyTorch → ONNX → TensorRT 部署链路，编写 CUDA 预处理与解码 Plugin，通过 JNI 向 Java 业务提供推理结果，并适配 x86 GPU 与 Jetson 边缘设备。
- **视频管理与流媒体录像：** 使用 FFmpeg、GStreamer 和 C++ 处理 RTSP / RTMP 链路，实现拉流转发、录像分片及 RTSP 转 WebRTC 播放，以 MinIO 和媒体元数据管理录像资源。
- **音频分析与语音业务：** 使用 Python、NumPy、SciPy、librosa 处理音频特征，结合 WhisperX 转写、WebSocket 实时推送及 wavesurfer.js 波形回放，衔接音频处理与前端交互。

---

## 待补充与核对（审阅用，投递前删除）

1. **工作经历：** 公司名称、岗位、起止年月，以及各项目所属的任职阶段。当前资料没有完整任职时间线，暂不推算工作年限或填写职位级别。
2. **项目职责：** Midway 已确认由本人主导并带团队完成，2020 年完成首版、后续迭代多个版本；可继续补充团队规模及本人直接负责的关键模块。其余项目仍需确认独立开发与团队协作的范围。
3. **成果数据：** 可补充视频接入路数、推理帧率、端到端延迟、资源占用、部署规模或实际使用情况。需要同时说明硬件和测试条件，当前不填写未经确认的数字。
4. **SDK 与移动端状态：** Yoloful SDK 的真机稳定性、性能与温控验收，Pia 的移动端真机与完整同步验收，Card Alarm 的设备和实体卡片验收均需结合实际记录确认。SDK 文档中的录制与分割限制不作为已交付能力写入简历；移动应用不写成已上架或已有用户规模的成果。
5. **教育信息：** 如投递版需要展示，再补充学校、专业及毕业时间。

本稿依据作品集中的项目描述、本人在对话中补充的信息、Midway-next-pro 的核心业务实现与本地 Midway-engine 源码、Midway 历史 Vue 前端的依赖与路由、beauty_ar_sdk 仓库的 README / v0.3.2 API / 更新日志与原生渲染实现，以及 Pia / Card Alarm 的本地项目文档和部分源码整理。Midway 的主导角色、首版年份及数据平台职责依据本人确认；当前仓库反映后续迭代，不代表 2020 年首版的完整技术栈。任职关系、具体贡献分工和量化业务成果仍待补充。
