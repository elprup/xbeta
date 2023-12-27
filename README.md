# 善用佳软 镜像站

原始网址： https://xbeta.info/

## 为什么要做这个镜像

很喜欢善用佳软这个网站。最近心血来潮访问，发现网站改用了新的wordpress模板后访问文章很麻烦，而且还会出现404错误。

所以，希望给网站做个镜像。还好作者采用了CC授权，感谢xbeta。

## 基本信息

- 网站部署在 github pages
- 基于 https://github.com/timlrx/tailwind-nextjs-starter-blog 模板开发
- 原始数据通过wordpress提供的json API获取

## 使用方法

- `yarn`: 安装
- `yarn dev`: 本地运行
- `yarn fetch:tags`: 抓取原始网站tags
- `yarn fetch:categories`: 抓取原始网站categories
- `yarn fetch:post`: 抓取原始网站post
- `yarn fetch:pages`: 抓取原始网站pages
- `yarn build`: 本地编译

提交到网页会自动部署到Github Pages，但需要在项目设置中设置pages的构建方式是By Action
