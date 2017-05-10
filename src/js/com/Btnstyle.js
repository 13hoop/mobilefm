define(['jquery'],function($){
	function _Btnstyle($ct){
		this.$ct = $ct;
		this.init();
	}

	_Btnstyle.prototype.init = function(){
	  	this.$sings = this.$ct.find('.Set-user')
	  	this.$like = this.$ct.find('.Set-like')
	  	this.$getLrc = this.$ct.find('.Get-lrc')
	  	this.$volumeBtn = this.$ct.find('.Set-vidio')
	  	this.$playStyle = this.$ct.find('.fa-play-style')
	  	this.$getList = this.$ct.find('.Get-list')
	  	this.Playindex = 0
		this.bind()
	}

	_Btnstyle.prototype.bind = function(){
		var	color = false,
			lrcdisplay = false,
			usermessage = false,
			style = false,
			Getlist = false,
			listdisplay =false,
			Playindex = 0
		this.$sings.on('click',function(){
			var Sings = $(this).parent().parent().parent().find('.sings')
			if(!usermessage){
				Sings.animate({top:'50%'})
				usermessage = true
			}else{
				Sings.animate({top:'100%'})
				usermessage = false
			}
		})
		this.$getLrc.on('click',function(){
			var Lrc = $(this).parent().parent().parent().parent().prev().find('.Lryic-page')
			if(!lrcdisplay){
				Lrc.css('display','block')
				$(Lrc.siblings()).css('display','none')
				$(this).parent().siblings().css('display','none')
				$(Lrc.siblings('.Img-blur')).css('display','block')
				this.innerHTML ="&#xe606;"
				lrcdisplay = true
			}else{
				Lrc.css('display','none')
				$(this).parent().siblings().css('display','block')
				$(Lrc.siblings('.Play-page')).css('display','block')
				this.innerHTML ="&#xe779;"
				lrcdisplay = false
			}
		})
		this.$getList.on('click',function(){
			var listPage = $(this).parent().parent().parent().parent().prev().find('.style-list')
			if(!listdisplay){
				listPage.animate({height:"40vh"})
				this.innerHTML = '&#xe649;'
				listdisplay = true
			}else{
				listPage.animate({height:"0"})
				this.innerHTML = '&#xe648;'
				listdisplay = false
			}
		})
		this.$like.on('click',function(e){
  			if(!color){
    			$(this).css('color','pink')
    			color = true
  			}else{
    			$(this).css('color','rgba(255,255,255,0.8)')
    			color = false
  			}
  		})
		this.$volumeBtn.on('click',function(){
			var Volume = $(this).parent().parent().parent().find('.Set-volume'),
				_this = this

				Volume.animate({
					top:'93%'
				})
				if (style) return;
				setTimeout(function(){
					Volume.animate({
					top:'100%'				
				});
					_this.style = true;
				},10000)
		})
		
		this.$playStyle.on('click',function(){
			Playindex ++;
			if(Playindex%3==1){
				this.innerHTML = '&#xe62a;'
			}else if(Playindex%3==2){
				this.innerHTML = '&#xe604;'
			}else if(Playindex%3 ==0){
				this.innerHTML ='&#xe603;'
			}
		})
	}

	var Btnstyle = (function(){
		return{
			init: function($ct){
				$ct.each(function(index,node){
					new _Btnstyle($(node))
				})
			}
		}
	})()
	return Btnstyle
})