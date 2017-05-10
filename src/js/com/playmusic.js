define(['jquery'],function($){	
	function _Playmusic($ct){
		this.$ct = $ct;
		this.init();
		this.bind();
		this.getmusic()
	}
	_Playmusic.prototype.init = function(){
		this.$titleNode = this.$ct.find('.title')
		this.$authorNode = this.$ct.find('.auther')
		this.$timeNode = this.$ct.find('.time-now')
		this.$timeEnd = this.$ct.find('.time-end')
		this.$progressBarNode = this.$ct.find('.Play-progress .bar')
		this.$progressNowNode = this.$ct.find('.progress-now')
		this.$setPic = this.$ct.find('.Set-Cover')
		this.$setVolume = this.$ct.find('.volume-btn')
		this.$volumeBarNode = this.$ct.find('.Volume')
		this.$playBtn = this.$ct.find('.fa-play')
		this.$imgBlur = this.$ct.find('.Img-blur')
		this.$mainpage = this.$ct.find('main')
		
		this.$stylelist = this.$ct.find('.sings-list')
		this.$forwardBtn =this.$ct.find('.fa-step-forward')
		this.$backBtn = this.$ct.find('.fa-step-backward')
		this.$sings = this.$ct.find('.sings')


		this.musicIndex = 0;
		this.music = new Audio()
		this.music.autoplay = true;
		this.shouldUpdate = true;
		this.$musicList = [];
		this.ontimeupdate()

		
	}

	_Playmusic.prototype.ontimeupdate = function(){
		var _this = this;
		_this.music.ontimeupdate = function(){
  			if(_this.shouldUpdate) { 
     			_this.updateProgress()
     			_this.shouldUpdate = false
    			setTimeout(function(){
      			_this.shouldUpdate = true
    			}, 1000)
  			}
		}
	}
	_Playmusic.prototype.bind = function(){
		var _this = this,musicicon=false,musicvolume=false

		this.$progressBarNode.on('click', function(e){
  		  var percent = e.offsetX/parseInt(getComputedStyle(this).width),
  			  progressNowNode = $(this).find('.progress-now')
  			_this.music.currentTime = percent * _this.music.duration
  			progressNowNode.css('width', percent*100+"%")
		})

		this.$volumeBarNode.on('click', function(e){
			percent = e.offsetX/parseInt(getComputedStyle(this).width),
			volumeNowNode = $(this).find('.volume-now')
			_this.music.volume = percent;
  			volumeNowNode.css('width',percent*100+'%')
		})

		this.$setVolume.on('click', function(e){
 			if(!musicvolume){
  				_this.music.muted=true
   				this.innerHTML="&#xe602;"
   				musicvolume = true
 			}else{
   				_this.music.muted=false
   				this.innerHTML = "&#xe6be;"
   				musicvolume=false
 			}
		})

		this.$playBtn.on('click',function(e){
			Pic = $(this).parent().parent().parent().parent().prev().find('.Set-Cover')
 			if(!musicicon){
 				_this.music.pause()
   				this.innerHTML="&#xe644;"
   				Pic.css("animationPlayState",'paused')
   				musicicon=true;
 			}else{
 				_this.music.play()
   				this.innerHTML = "&#xe6c5;"
   				Pic.css("animationPlayState",'running')
   				musicicon=false
 			}
		})
		_this.getList()
		_this.styleList()

		this.$forwardBtn.on('click',function(){
			if(_this.musicIndex<9){
				_this.musicIndex++
				_this.singstyle(_this.musicIndex)
				_this.loadMusic(_this.$musicList[_this.musicIndex])
				$('.Lryic-page ul').empty()
				$('.litte-Lryic-page ul').empty()
				_this.getLrc(_this.$musicList[_this.musicIndex].lrc)
			}else{
				alert("已经到最后了")
				_this.musicIndex=9
			}
		})

		this.$backBtn.on('click',function(){
			if(_this.musicIndex==0){
				_this.singstyle(_this.musicIndex)
				_this.loadMusic(_this.$musicList[_this.musicIndex])
				$('.Lryic-page ul').empty()
				$('.litte-Lryic-page ul').empty()
				_this.getLrc(_this.$musicList[_this.musicIndex].lrc)
			}else{
				_this.musicIndex --
				_this.singstyle(_this.musicIndex)
				_this.loadMusic(_this.$musicList[_this.musicIndex])
				$('.Lryic-page ul').empty()
				$('.litte-Lryic-page ul').empty()
				_this.getLrc(_this.$musicList[_this.musicIndex].lrc)
			}
		})
		
		
		_this.updateProgress()
	}
	
	_Playmusic.prototype.getLrc  = function(lrcUrl){
		let _this = this;
		this.get('https://jirenguapi.applinzi.com/fm/getLyric.php',{sid:sid},function(ret){
			_this.parseLyric(ret.lyric)
    		})
		}


	_Playmusic.prototype.parseLyric = function(lyric){
		var lines = lyric.split('\n'),
	        pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
	        result = []
	    while (!pattern.test(lines[0])) {
	        lines = lines.slice(1);
	    }
	   	lines[lines.length - 1].length === 0 && lines.pop()
	    lines.forEach(function(v,i,a){
	    	var time = v.match(pattern),
	    		value = v.replace(pattern,'')
	    	if(time == null) return
	    	time.forEach(function(v1,i1,a1){
	    		var t = v1.slice(1,-1).split(':')
	    		result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value])
	    	})
	    })

	    result.sort(function(a, b) {
	        return a[0] - b[0];
	    })

    	this.Lrcpush(result)
	}

	_Playmusic.prototype.Lrcpush = function(str){

		for(var i=0;i<str.length;i++){
			$('.Lryic-page ul').append($('<li>'+str[i][1]+'</li>'));
			$('.litte-Lryic-page ul').append($('<li>'+str[i][1]+'</li>'))
		}
		var _this = this
		this.music.ontimeupdate = function(){

			for (var i = 0, l = str.length; i < l; i++){
				if(_this.music.currentTime>str[i][0]){
					$('.Lryic-page ul').css('top',-i*40+200+'px')
					$('.litte-Lryic-page ul').css('top',-i*40+40+'px') 
					$('.Lryic-page ul li').css('color','#fff')
					$('.litte-Lryic-page ul li').css('color','#fff')    
					$('.Lryic-page ul li:nth-child('+(i+1)+')').css('color','#1ABC9C')
					$('.litte-Lryic-page ul li:nth-child('+(i+1)+')').css('color','#1ABC9C')
				}
			}
			if(_this.shouldUpdate) { 
     			_this.updateProgress()
     			_this.shouldUpdate = false
    			setTimeout(function(){
      			_this.shouldUpdate = true
    			}, 1000)
  			}
		}
	}
	_Playmusic.prototype.choosesing = function(){
		this.$sings.on('click','li',function(e){
			console.log($(e.target).eq())
		})
	}
	_Playmusic.prototype.getList = function(){
		var _this =this;

		this.$stylelist.on('click',function(e){
			if(e.target.tagName.toLowerCase()!=='li') return;
			var channelId = ($(e.target).attr('data-channel-id'))
			_this.getmusic(channelId)
		})
	}
	_Playmusic.prototype.singstyle = function(index){
		var index = this.$sings.find('li').eq(index)
		index.find('p').css('color','rgb(26,188,156)')
		index.find('p span').css('color','rgb(26,188,156)')
		index.find('p span i').css('color','rgb(26,188,156)')
		index.siblings().find('p').css('color','white')
		index.siblings().find('span').css('color','rgba(255,255,255,0.4)')
		index.siblings().find('span i').css('color','rgba(255,255,255,0.4)')
	}
	_Playmusic.prototype.getmusic = function(channels){
		var _this = this
			_this.$musicList = []
		for(var i=0;i<10;i++){	
			this.get('https://jirenguapi.applinzi.com/fm/getSong.php',{channel:channels},function(ret){
				var addmusic = [{'src':ret.song[0].url,'title':ret.song[0].title,'auther':ret.song[0].artist,'pic':ret.song[0].picture,'lrc':ret.song[0].lrc}]
				if(addmusic[0].auther==null) return
				_this.$musicList.push(addmusic[0])	
			})
		}
		
		setTimeout(function(){
			var playindex = 0;
			_this.loadMusic(_this.$musicList[playindex])
			_this.getSings(_this.$musicList)
			$('.Lryic-page ul').empty()
			$('.litte-Lryic-page ul').empty()
			_this.getLrc(_this.$musicList[0].lrc)
			if(_this.$musicList.length!==10){
				laod()
			}
		} ,1000)
		function laod(){
			setTimeout(function(){
					_this.getSings(_this.$musicList)
					_this.singstyle(0)
					_this.choosesing()
				},5000)
		}
	}
	_Playmusic.prototype.getSings = function(channels){
		this.$sings.empty()
		var html = channels.map(function(channel){
			return '<li><p>'+channel.title+'<span>－'+channel.auther+'</span><i class="Set-user iconfont">&#xe630;</i></p>'
		})
		this.$sings.append(html)
	}
	_Playmusic.prototype.get = function(url,data,callback,dataType){
		url += "?" +Object.keys(data).map(function(key){
            return key + '=' + data[key]
        }).join('&')
        var xhr = new XMLHttpRequest()
        xhr.responseType = dataType || "json"
        xhr.onload = function(){
            callback(xhr.response)
        }
        xhr.open('GET',url,true)
        xhr.send()
	}
	_Playmusic.prototype.nextMusic = function(musiclist,index){
		index ++;
		this.loadMusic(musiclist[index])

	}
	_Playmusic.prototype.loadMusic = function(songObj){
		
		this.music.src = songObj.src
		this.$titleNode.text(songObj.title)
		this.$authorNode.text(songObj.auther)
		this.$setPic.css('background-image','url('+songObj.pic+')')
		this.$imgBlur.css('background-image','url('+songObj.pic+')')
		this.$mainpage.css('background-image','url('+songObj.pic+')')
	}

	_Playmusic.prototype.renderSet = function(channels){

		var html = channels.map(function(channel){
			return '<li data-channel-id="' + channel.channel_id + '"> <img src="src/img/唱片.png" alt=""><p>'+ channel.name + '</p></li>'
		})
		this.$stylelist.append(html)
	}

	_Playmusic.prototype.updateProgress = function(){
		var _this = this;
		var percent = (_this.music.currentTime/_this.music.duration)*100+'%'
  		 	_this.$progressNowNode.css('width',percent)
  		var minutes = parseInt(_this.music.currentTime/60)
  		var seconds = parseInt(_this.music.currentTime%60)+''
  		var singminutes = parseInt(_this.music.duration/60)
  		var singseconds = parseInt(_this.music.duration%60)+''
  		seconds = seconds.length == 2? seconds : '0'+seconds
  		singseconds = singseconds.length == 2? singseconds : '0'+singseconds
  		this.$timeNode.text(minutes + ':' + seconds)
  		this.$timeEnd.text(singminutes+':'+singseconds)
	}

	_Playmusic.prototype.styleList = function(){
		var _this = this;
		this.get('https://jirenguapi.applinzi.com/fm/getChannels.php', {}, function(ret){
      		_this.renderSet(ret.channels)
    	})
	}
	var Playmusic = (function(){
		return{
			init:function($ct){
				$ct.each(function(index,node){
					new _Playmusic($(node))
				})
			}
		}
	})()

	return Playmusic
})