# AIchemy · 独立海报

这是与网站分开的 60×90cm 竖版招新海报。所有海报源文件和成品均位于本目录；网站入口、样式、交互和动画仍使用根目录的原文件。

中央插画同步官网的工业高炉造型：加料斗、分层炉身、热风管道、检修梯、神经网络炉膛和出料熔流。`art.js` 中的 `blastFurnace` 是当前官网同名绘图函数的独立副本；海报不依赖网站脚本运行。

标题为「炼丹社 AIchemy」，标语为「硬核AI研究社团@sdsz」。六个悬浮窗口展示神经网络、LLM、Agent、训练曲线、招新邀请与社长微信。入社方式为添加社长微信，右下角为黑底白纹的微信二维码，编码内容与用户提供的微信名片一致。底部保留官网 `https://aichemy.club`。

四个研究元素窗口采用小尺寸、细边框与低亮度配色，围绕中央插画分布；标题、丹炉和底部招新信息保持主要视觉层级。官网在底部独立横条中居中放大，配有金色「官网」标签，整条可点击。

打开本目录的 `index.html` 预览，或在现有预览服务中访问 `/poster/`。

- `exports/AIchemy-60x90cm.pdf`：单页，精确 600×900mm，RGB；底部官网地址可点击。
- `exports/AIchemy-60x90cm-300dpi.png`：7087×10630px，300dpi 元数据。
- `exports/AIchemy-preview.png`：1440×2160px 的完整海报预览。

插画采用 720×1080 的像素网格，高分辨率导出使用最近邻缩放，保留刻意设计的像素边缘。文字和窗口在导出分辨率下重新绘制；二维码由原名片解码内容重新生成，使用 H 级纠错，保留四个模块宽的黑色静区，白色模块按导出像素对齐。浏览器等待本地字体加载完成后才允许导出。

`art.js` 是独立的像素图元副本；`poster.js` 定义插画构图；`layout.js` 定义文字和窗口；`wechat-qr.js` 保存微信二维码矩阵，`assets/wechat-qr.svg` 为可独立使用的同款矢量二维码；`assets/wechat-card.jpg` 保留用户提供的未修改原图；`poster.css` 定义预览、字体和打印尺寸。它们不引用或修改网站的动画脚本与样式。字体为 Noto Sans SC 的本地子集，授权见 `assets/NotoSansSC-OFL.txt`。

安装 Playwright 和 Chromium、启动项目预览服务后，运行 `node poster/export.cjs` 重新生成全部成品。可用 `AICHEMY_PLAYWRIGHT_MODULE`、`AICHEMY_CHROMIUM_PATH`、`AICHEMY_POSTER_URL` 指定现有工具和预览地址。

也可在浏览器中调用 `AIchemyPoster.exportPNG()`，将返回的 PNG 保存至 `exports/AIchemy-60x90cm-300dpi.png`，再运行 `node poster/prepare-print.mjs`，写入 DPI 元数据并生成精确尺寸 PDF。
