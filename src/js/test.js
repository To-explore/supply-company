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
//首页产品详情页img遮罩
$(".products #myTabContent div a").hover(
    function () {
        $(this).find("img").stop().animate({"opacity": "1"}, 700)
    }, function () {
        $(this).find("img").stop().animate({"opacity": "0.5"}, 700)
    }
);
$(".join img").hover(
    function () {
        $(this).stop().animate({"opacity": "1"}, 700)
    }, function () {
        $(this).stop().animate({"opacity": "0.5"}, 700)
    }
);
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

