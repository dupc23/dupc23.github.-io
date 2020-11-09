(function (window) {
    function Player($audio) {
        return new Player.prototype.init($audio);
        // this.$audio.attr('src',this.musicList[0].link_url);
    }
    Player.prototype = {
        constructor : Player,
        currentIndex : -1,
        musicList : [],
        // isMove : false,
        init : function ($audio) {
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },
        playMusic : function (index,music) {
            if(this.currentIndex == index){             //是当前音乐
                if(this.audio.paused){             //是暂停状态
                    this.audio.play();
                }else {
                    this.audio.pause();
                }
            }else {
                this.audio.pause();
                this.$audio.attr('src',music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },
        preIndex : function () {
            let index  = this.currentIndex  -1;
            if(index < 0){
                index = 12;
            }
            return index;
        },
        nextIndex : function () {
            let index  = this.currentIndex + 1;
            if(index > 12){
                index = 0;
            }
            return index;
        },
        changeMusic : function (index) {
            this.musicList.splice(index,1);
            if(index < this.currentIndex ){
                this.currentIndex = this.currentIndex  -1;
            }
        },
        musicTimeUpdate : function (collBak) {
            let $self = this;
            //监听音乐实例的timeupdate 事件
            this.$audio.on('timeupdate', throttle(500,function () { //throttle是导入的节流函数；
                collBak($self.audio.currentTime,$self.audio.duration,$self.formatDate($self.audio.currentTime),$self.formatDate($self.audio.duration));
            },$self.audio.currentTime,$self.audio.duration,$self.formatDate($self.audio.currentTime),$self.formatDate($self.audio.duration)
                )
            );
        },
        //设置音乐播放器现在歌曲的进度 ， 值为百分比值
        setMusicCurrentTime : function(percentage){
            if(percentage < 0 || percentage>100) return 'percentage-变量不符合要求';
            if(isNaN(percentage )) return ;
            this.audio.currentTime = parseInt( percentage / 100 * this.audio.duration.toFixed(2) );
        },
        setMusicVoice:function(percentage){
            if(percentage < 0 || percentage>100) return 'percentage-变量不符合要求';
            if(isNaN(percentage )) return ;
            this.audio.volume = percentage / 100 ;
        },
        // 一个格式化秒数为XX：XX 的方法
        formatDate : function (time) {
            let min = parseInt(time / 60 );
            let sec = parseInt(time % 60 );
            if(min < 10 ){
                min = '0' + min;
            } else if( isNaN(min) ){
                min = '00';
            };
            if(sec < 10 ){
                sec = '0' + sec;
            } else if( isNaN(sec) ){
                sec = '00';
            };
            return min+"："+sec;
        },
        musicEnd : function (callback) {
            this.$audio.off('ended');
            let $self = this;
            this.$audio.on('ended',function () {
                callback($self.audio);
            })
        }
    }
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window)