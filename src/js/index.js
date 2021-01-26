"use strict";
/*
 * @LastEditors: 赵兴
 * @LastEditTime: 2021-01-26 09:26:22
 */
var sayHello = "欢迎来到中商云产业链供应链管理平台！";
console.log(sayHello);
console.log("严肃声明：");
console.log("本系统已申请软件著作权，受国家版权局知识产权以及国家计算机软件著作权保护！");
console.log("可正常分享和学习源码，不得用于违法犯罪活动，违者必究！");
console.log("版权所有，侵权必究！");



let dropdowns = document.querySelectorAll('.navbar .dropdown-toggler')
let dropdownIsOpen = false

// Handle dropdown menues
if (dropdowns.length) {
  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener('click', (event) => {
      let target = document.querySelector('#' + event.target.dataset.dropdown)

      if (target) {
        if (target.classList.contains('show')) {
          target.classList.remove('show')
          dropdownIsOpen = false
        } else {
          target.classList.add('show')
          dropdownIsOpen = true
        }
      }
    })
  })
}

// Handle closing dropdowns if a user clicked the body
window.addEventListener('mouseup', (event) => {
  if (dropdownIsOpen) {
    dropdowns.forEach((dropdownButton) => {
      let dropdown = document.querySelector('#' + dropdownButton.dataset.dropdown)
      let targetIsDropdown = dropdown == event.target

      if (dropdownButton == event.target) {
        return
      }

      if ((!targetIsDropdown) && (!dropdown.contains(event.target))) {
        dropdown.classList.remove('show')
      }
    })
  }
})

// Open links in mobiles
function handleSmallScreens() {
  document.querySelector('.navbar-toggler')
    .addEventListener('click', () => {
      let navbarMenu = document.querySelector('.navbar-menu')

      if (navbarMenu.style.display === 'flex') {
        navbarMenu.style.display = 'none'
        return
      }

      navbarMenu.style.display = 'flex'
    })
}

handleSmallScreens()