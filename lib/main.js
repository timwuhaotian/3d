var scrolled = 0;
var open = false;
var openID = "";
var hoverTimeout = false;

var touch = false;
var mobile = false;
var t = 0;
var pageH = window.innerHeight;

var selectedHeight = (100 + (pageH * 0.044));

var infoOpen = false;
var mouse = 0;
var mouseLerp = 0;

$(document).ready(function(){

  console.log('Hello!');

  if ("ontouchstart" in document.documentElement){
    touch = true;
    $(".project--misc").addClass('touch');
    $(".project--misc").scrollLeft($(".project--misc").innerWidth()/2);
    $(".vid--controls").addClass('touch');
    $(".vid--play").addClass('enabled');
  }
  if (window.innerWidth <= 900){
    mobile = true;
    $(".info--insta").attr("src", "assets/img/instagram_mobile.png");
    $(".info--insta.pressed").attr("src", "assets/img/instagram_mobile_pressed.png");
    $(".info--email").attr("src", "assets/img/email_mobile.png");
    $(".info--email.pressed").attr("src", "assets/img/email_mobile_pressed.png");
  }

  anim();

  $(".info--button").click(function(e) {
      if(touch){
        infoHandler();
      }
  });

  $(".info--box").hover(function(){
    if(!touch){
      infoHandler();
    }
  }, function(){
    if(!touch){
      infoHandler();
    }
  });


  $(window).scroll(function() {
    var titleTop = $(".title").outerHeight() - ($(window).outerHeight()*0.88);
    var introHeight = Math.abs(titleTop);

    if($(window).scrollTop() >= $(window).innerHeight() * 0.94) {
      scrolled = 1;
    }else{
      scrolled = 0;
    };

    $(".project").each(function(){
      var o = $(this).offset().top - $(window).scrollTop();
      var h = $(this).outerHeight();
      var index = $(this).index('.project');
      if(o + h + 100 > 0 && o < window.innerHeight + 100){

        if($(this).hasClass('hide')){
          $(this).removeClass('hide');
          if($(this).hasClass('open')){
            playProject(index);
          }
        }
      } else {
        if(!$(this).hasClass('hide')){
          if($(this).hasClass('open')){
            pauseProject(index);
          }
          $(this).addClass('hide');
        }
      }
    });


  });

  $(".project a").not('.project--preview').each(function(){
    $(this).attr("target", "_blank");
  });

  $(".project video").each(function(){
    $(this).on('loadedmetadata', function(){
      onResizeLayout();
      videoControls(this);
    });
    var vid = this;
    var controls = $(this).siblings(".vid--controls");
    controls.children('.vid--play').click(function(){
      vid.play();
      $(this).removeClass('enabled');
      if(!controls.hasClass('loaded')){
        controls.addClass('loading');
      }
    });
    $(this).on('canplay', function(){
      var controls = $(this).siblings(".vid--controls");
      controls.removeClass('loading');
      controls.children('.vid--play').removeClass('enabled');
      $(this).css({"filter": 'blur(0px)'});
      controls.addClass('loaded');
      setTimeout(function(){
        $(this).css({"filter": 'none'});
      }, 300);
    });
    this.addEventListener('error', function(event) {
      d = new Date();
      $(this).attr('src', $(this).attr('src') + '?' + d.getTime());
      this.play();
    }, true);
  });

  $(".project").not('.project--private').each(function(index){

    $(this).css({"height": selectedHeight + "px", "top": (index) * selectedHeight + "px"});
    $(this).attr("id", "project--" + (index+1));

      var h = $(".project:last-child").offset().top + selectedHeight - pageH;
      $(".projects").css({"height": h + "px"});
    
  });

  $(".project").mousedown(function(e){
    if(!$(this).hasClass("open")){
      $(this).children(".button--info").css({"opacity": 1});
      openProject(this);
    } else if($(e.target).parents('.project--preview').length > 0 || $(e.target).hasClass('project--preview')) {
      closeProject(this);
    }
  });

  $(".button--arrow").hover(function(){
    if(!mobile){
      $(this).css("transform", "translateX(-35px)");
      $(this).children().css({"transform":"translateX(35px)","opacity":"1"});
    }
  }, function(){
    if(!mobile){
      $(this).css("transform", "translateX(0)");
      $(this).children().css({"transform":"translateX(0px)","opacity":"0"});
    }
  });

  $(".button--home .hover").hover(function(){
    $(this).siblings('.pressed').addClass('show');
  }, function(){
    $(this).siblings('.pressed').removeClass('show');
  });


  $(".misc").mousemove(function(e){
    mouse = e.pageX;
  });

  $(".project--share a").click(function(e){
    e.preventDefault();
    var url = $(this).attr('href');
    copyTextToClipboard(url, $(this).parent());
  });


  window.addEventListener( 'resize', onResizeLayout, false );



});

function infoHandler(){
  if($(".info--box").hasClass('open')){
    $(".info--box").removeClass('open').css({'width': '', 'height': ''});
  } else {
    var padding = 40;
    if(window.innerWidth < 600){
      padding = 30;
    }
    $(".info--box").addClass('open').css({'width': ($(".info--contents").innerWidth() + padding) + 'px', 'height': ($(".info--contents").innerHeight() + padding) + 'px'});
  }
}

function infoSize(){
  if($(".info--box").hasClass('open')){
    var padding = 40;
    if(window.innerWidth < 600){
      padding = 30;
    }
    $(".info--box").css({'width': ($(".info--contents").innerWidth() + padding) + 'px', 'height': ($(".info--contents").innerHeight() + padding) + 'px'});
  }
}


function updateSiteViews(data){
  var views = data.views;
  var online = data.online;
  if(online){
    online = Object.keys(online).length;
  } else {
    online = 0;
  }

  var time = (Date.now() - data.lastViewed) / 1000;
  var timeFormat;
  if(time < 60){
    timeFormat = Math.round(time) + 's';
  } else if(time < 3600){
    timeFormat = Math.round(time / 60) + 'm';
  } else if(time < 86400){
    timeFormat = Math.round(time / 60 / 60) + 'h';
  } else {
    timeFormat = Math.round(time / 60 / 60 / 24) + 'd';
  }

  $('.site--data .data--views span').text(pad(views, 2));
  var text = views + ' visitors<br>' + online + ' user online';
  $('.site--data .data--online').addClass('online');
  $('.site--data .data--online span').text(pad(online, 2));
  $('.site--data .data--desc span').html(text);
}


function updateViews(index, data){
  var views = data.views;
  var online = data.online;
  if(online){
    online = Object.keys(online).length;
  } else {
    online = 0;
  }

  var time = (Date.now() - data.lastViewed) / 1000;
  var timeFormat;
  if(time < 60){
    timeFormat = Math.round(time) + 's';
  } else if(time < 3600){
    timeFormat = Math.round(time / 60) + 'm';
  } else if(time < 86400){
    timeFormat = Math.round(time / 60 / 60) + 'h';
  } else {
    timeFormat = Math.round(time / 60 / 60 / 24) + 'd';
  }

  $('.project:eq(' + index + ') .data--views span').text(pad(views, 2));
  if(online > 0){
    var text = views + ' views<br>' + online + ' user online';
    $('.project:eq(' + index + ') .data--online').addClass('online');
    $('.project:eq(' + index + ') .data--online span').text(pad(online, 2));
    $('.project:eq(' + index + ') .data--desc span').html(text);
  } else {
    var text = views + ' views<br>Last viewed ' + timeFormat + ' ago';
    $('.project:eq(' + index + ') .data--online').removeClass('online');
    $('.project:eq(' + index + ') .data--online span').text(timeFormat);
    $('.project:eq(' + index + ') .data--desc span').html(text);
  }
}

function addView(index){
  var name = $('.project:eq(' + index + ')').attr('data-name').toLowerCase().replace(/\./g, '_').replace(/\s/g, '_');
  $('.project:eq(' + index + ')').attr('data-u', u.key);
  u.onDisconnect().remove();

}


function openProject(that){

  var id = that.id;
  var index = $(that).index(".project");
  addView(index);

  open = true;
  openID = id;
  var offset = 0;

  setTimeout(function(){


    $(that).addClass("open").css({'height': $(that)[0].scrollHeight + 'px'});

    for(var i = 0; i < projectNumber; i++){
        $(".project:eq("+i+")").css({"transform": "translate3d(0, "+ offset+"px, 0)"});
        offset += $(".project:eq("+i+")").outerHeight() - selectedHeight;
    }
    
    setTimeout(function(){
      var h = $(".project:last-child").offset().top + $(".project:last-child").outerHeight() - pageH;
      $(".projects").css({"height": h + "px"});
      $("html, body").animate({"scrollTop": ($(that).offset().top)}, 500);
      setTimeout(function(){
        loadContent(that);
      }, 500);
    }, 500);

  }, 100);

}


function loadContent(that){

  var index = $(that).index(".project");

  $(that).children('.project--blocks').find('img').each(function(){
    if($(this).attr('src') == undefined){
      $(this).attr('src', $(this).attr('data-src'));
      $(this).on('load', function(){
        onResizeLayout();
        $(this).css({"filter": 'blur(0px)'});
        setTimeout(function(){
          $(this).css({"filter": 'none'});
        }, 300);
      });
    }
  });

  $(that).children('.project--blocks').find('iframe').each(function(){
    if($(this).attr('src') == undefined){
      $(this).attr('src', $(this).attr('data-src'));
      var controls = $(this).siblings(".vid--controls");
      controls.addClass('vimeo');
      $(this).on('load', function(){
        onResizeLayout();
        playProject(index);
        $(this).css({"filter": 'blur(0px)'});
        setTimeout(function(){
          $(this).css({"filter": 'none'});
        }, 300);
      });
    }
  });

  playProject(index);
}


function anim(){
  if($('.misc').hasClass('open')){
    mouseLerp += (mouse - mouseLerp) / 10;
    var pos = (mouseLerp / window.innerWidth);
    var width = $('.project--misc').outerWidth() - window.innerWidth;
    var offset = (pos * (width + (window.innerWidth * 0.6)) - (window.innerWidth * 0.3));
    $(".project--misc").css({'transform': 'translate(' + -offset + 'px, 0)'});
  }
  
  requestAnimationFrame(anim);
}


function onResizeLayout(){
  if($(".project--private").length == 0){
    if(!touch){
      pageH = window.innerHeight;
    }

    if (window.innerWidth <= 900){
      mobile = true;
      $(".info--insta").attr("src", "assets/img/instagram_mobile.png");
      $(".info--insta.pressed").attr("src", "assets/img/instagram_mobile_pressed.png");
      $(".info--email").attr("src", "assets/img/email_mobile.png");
      $(".info--email.pressed").attr("src", "assets/img/email_mobile_pressed.png");
    } else {
      $(".info--insta").attr("src", "assets/img/instagram.png");
      $(".info--insta.pressed").attr("src", "assets/img/instagram_pressed.png");
      $(".info--email").attr("src", "assets/img/email.png");
      $(".info--email.pressed").attr("src", "assets/img/email_pressed.png");
    }

    infoSize();
    selectedHeight = (100 + (pageH * 0.044));

    var offset = 0;
    for(var i = 0; i < projectNumber; i++){
      var p = $(".project:eq("+i+")");
      if(p.hasClass('open')){
        p.css({'height': (selectedHeight + p.children('.project--blocks').outerHeight()) + 'px', "top": i * selectedHeight + "px"});
      } else {
        p.css({'height': selectedHeight + 'px', "top": i * selectedHeight + "px"});
      }
      p.css({"transform": "translate3d(0, "+ offset+"px, 0)"});
      offset += p.outerHeight() - selectedHeight;
    }

    setTimeout(function(){
      var h = $(".project:last-child").offset().top + $(".project:last-child").outerHeight() - pageH;
      $(".projects").css({"height": h + "px"});
    }, 500);
  }
}


function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function copyTextToClipboard(text, el) {
  var textArea = document.createElement("textarea");

  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  textArea.style.width = '2em';
  textArea.style.height = '2em';

  textArea.style.padding = 0;

  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  textArea.style.background = 'transparent';

  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    el.addClass('copied');
    setTimeout(function(){
      el.removeClass('copied');
    }, 4000);
  } catch (err) {
    window.open(text, '_blank');
  }

  document.body.removeChild(textArea);
}


function clock(){
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
   if(s<10){
     s = "0" + s;
   }
   if (m < 10) {
     m = "0" + m;
   }
   if (h < 10) {
     h = "0" + h;
   }
  $(".clock").html(h+":"+m+":"+s);

   setTimeout(function(){clock()}, 500);
}