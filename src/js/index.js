"use strict";
/*
 * @LastEditors: 赵兴
 * @LastEditTime: 2021-01-16 16:20:38
 */
var sayHello = "欢迎来到中商云产业链供应链管理平台！";
console.log("sayHello :>> ", sayHello);
var mySwiper = new Swiper(".swiper-container", {
    direction: "horizontal",
    loop: true,
    // 如果需要分页器
    pagination: {
        el: ".swiper-pagination",
    },
});
