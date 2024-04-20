# setup build stage
FROM node:14.18.1-alpine as build-stage

# define work directory
WORKDIR /app

# copy package.json to /app
COPY package.json .

ARG VUE_APP_API_GATEWAY_URL

ENV VUE_APP_API_GATEWAY_URL ${VUE_APP_API_GATEWAY_URL}

ARG VUE_APP_SENTRY_URL

ENV VUE_APP_SENTRY_URL ${VUE_APP_SENTRY_URL}

ARG VUE_APP_SENTRY_SAMPLE_RATE

ENV VUE_APP_SENTRY_SAMPLE_RATE ${VUE_APP_SENTRY_SAMPLE_RATE}

# install all the packages in package.json
RUN npm install

# copy the code from local lo build
COPY . .

#build the code
RUN npm run build 


# setup production stage
FROM nginx:1.18.0-alpine as production-stage

#remove default conf file from nginx 
RUN rm -v /etc/nginx/conf.d/default.conf

#add default conf to nginx
ADD default.conf /etc/nginx/conf.d/

#copy local default conf to nginx
COPY default.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*

#copy local build-stage to nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

#nginx command
CMD ["nginx", "-g", "daemon off;"]
