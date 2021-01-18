/*
 * @LastEditors: 赵兴
 * @LastEditTime: 2021-01-18 13:13:25
 */
let sayHello: string = "欢迎来到中商云产业链供应链管理平台！";
console.log("sayHello :>> ", sayHello);

let mySwiper: object = new Swiper(".swiper-container", {
  direction: "horizontal", // 垂直切换选项
  loop: true, // 循环模式选项
  // 如果需要分页器
  pagination: {
    el: ".swiper-pagination",
  },
});
