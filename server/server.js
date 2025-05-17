"use strict";

const Hapi = require("@hapi/hapi");
const HapiSwagger = require("hapi-swagger");
const Vision = require("@hapi/vision");

const Inert = require("@hapi/inert");




const swaggerOptions = {
  info: {
    title: "My Hapi API Docs",
    version: "1.0.0",
    description: "A sample documentation for a Hapi API.",
  },
  pathPrefixSize: 2, // 根据您的路由结构调整
};




const server = Hapi.server({
  port: 3000,
  host: "localhost",
  routes :{
    cors: {
      origin: ['*'], // 允许任意来源
    }
  }
});





const main = async () => {

  await server.register([
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
    {
      plugin: Inert,
    },
  ]);


  server.route({
    method: 'GET',
    path: '/images/{param*}', // 指定静态文件的路径
    handler: {
      directory: {
        path: './public/images', // 静态文件的实际存储路径
        listing: true, // 是否允许列出目录内容
        index: true // 是否提供默认索引文件
      }
    }
  });

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      h.state("username", "tom");
      return h.response(request.state.username);
    },
    options: {
      description: "A simple example route.",
      notes: "Returns a hello world string.",
      tags: ["api"],
    },
  });

  server.route({
    method: "GET",
    path: "/test",
    handler: (request, h) => {
      h.state("username", "func");
      return h.response(request.state.username);
    },
    options: {
      description: "A simple example route.",
      notes: "Returns a hello world string.",
      tags: ["api"],
    },
  });





  server.route({
    method: "GET",
    path: "/images",
    handler: (request, h) => {

      const pages = request.query.pages ||  0
      const images_arr = []
      for (let i = 1; i <= pages; i++) {
        images_arr.push (
            i<= 9 ? `images/0${i}.jpg` : `images/${i}.jpg`
        )
      }

      if  (pages >  10) {
        return h.response([]).code(200);
      } else {
        return h.response(images_arr).code(200);
      }

    },
    options: {
      description: "A simple example route.",
      notes: "Returns a hello world string.",
      tags: ["api"],
    },
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

main();
