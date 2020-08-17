# 标准基础镜像（构建阶段）
FROM node:alpine

RUN npm install cnpm -g

WORKDIR /home/node/app

COPY . .

# 生成.env文件
ARG vue_app_title=portalwebAdmin
ARG vue_app_base_url
ARG vue_app_api_base
ARG vue_app_api_server


RUN echo VUE_APP_TITLE=$vue_app_title > .env && \
	echo VUE_APP_BASE_URL=$vue_app_base_url >> .env && \
	echo VUE_APP_API_BASE=$vue_app_api_base >> .env && \
	echo VUE_APP_API_SERVER=$vue_app_api_server >> .env

# 安装依赖包，构建代码
RUN cnpm i && yarn build

# 标准基础镜像（部署阶段）
FROM nginx:alpine

# 设置时区
RUN sed -i 's?http://dl-cdn.alpinelinux.org/?https://mirrors.aliyun.com/?' /etc/apk/repositories && \
	apk add -U tzdata && \
	cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
	apk del tzdata

# 修改配置文件
ADD ./nginx.conf.template /etc/nginx/nginx.conf.template

ADD ./start_nginx.sh /usr/local/bin/start_nginx.sh

RUN chmod +x /usr/local/bin/start_nginx.sh

# 将构建阶段代码放在指定位置
COPY --from=0 /home/node/app/dist /usr/share/nginx/html

CMD ["start_nginx.sh"]