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

//客服
var flag = 1;
$('#rightArrow').click(function () {
    if (flag == 1) {
        $("#floatDivBoxs").animate({right: '-175px'}, 300);
        $(this).animate({right: '-5px'}, 300);
        $(this).css('background-position', '-50px 0');
        flag = 0;
    } else {
        $("#floatDivBoxs").animate({right: '0'}, 300);
        $(this).animate({right: '170px'}, 300);
        $(this).css('background-position', '0px 0');
        flag = 1;
    }
});
//回到顶部
$(window).scroll(function () {//
    if ($(window).scrollTop() > 100) {//当高度小于100
        $("#back-to-top").fadeIn(1000);
    } else {
        $("#back-to-top").fadeOut(1000);
    }
});
$("#back-to-top").click(function () {
    $("body").animate({"scrollTop": "0"}, 1500)
});

/*---------返回顶部----------*/
$(function() {
    $(".btn_top").hide();
    $(".btn_top").live("click",function(){
        $('html, body').animate({scrollTop: 0},300);return false;
    })
    $(window).bind('scroll resize',function(){
        if($(window).scrollTop()<=300){
            $(".btn_top").hide();
        }else{
            $(".btn_top").show();
        }
    })
})

/*---------返回顶部 end----------*/
let nums1 = [1,2,2,1];
let nums2 = [2,2];
let num = [];
for (var i = 0; i<nums1.length; i++) {
	for (var j = 0; j < nums2.length; j++) {
    	if (nums1[i] == nums2[j] && nums2.splice(nums2.indexOf(nums1[i]), 1)) {
         num.push(nums1[i])
        }
        console.log(num);
    }
}
// var intersect = function(nums1, nums2) {
//     var hashTable = {};
//     var target = [];
//     nums1.forEach(v => {
//         if(hashTable[v]) hashTable[v]++;
//         else hashTable[v] = 1;   
//     })
//     nums2.forEach(v => {
//         if(hashTable[v] && hashTable[v] > 0) {
//             hashTable[v]--;
//             target.push(v);
//         }
//     })
//     return target;
// };