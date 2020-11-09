(function (window) {
    function  Lyric(path,$musicLysic) {
        return new Lyric.prototype.init(path,$musicLysic);
    };
    Lyric.prototype = {
        constructor : Lyric,
        times : [],
        lyrics : [],
        index : 0 ,
        lyricHeight : [],
        init:function (path,$musicLysic) {
            //初始化歌词路径和呈放歌词的dom元素
            this.path = path;
            this.$musicLysic = $musicLysic;
        },
        loadLyric : function () {
            let $self = this;
            $.ajax({
                url : $self.path,
                dataType : 'text',
                success : function (data) {
                    // 处理得到的歌词文本
                    $self.parseLyric(data);

                    $self.$musicLysic.empty();

                    //添加处理好的歌词 ；
                    $self.addLyric();
                    console.log($self.lyricHeight);
                    // $self.rollHeight();
                },
                error : function (e) {
                    console.log(e);
                }
            });
        },
        parseLyric : function (data) {
            let $self = this;
            $self.lyricHeight = [];
            $self.lyrics = [];
            $self.times = [];
            let array = data.split('\r\n');
            let timeReg = /\[(\d*:\d*\.\d*)\]/;
            let res,min,sec;
            $.each(array,function (index,ele) {
                //判断是否有歌词 有存入数组  无直接结束本次循环
                if( $.trim( ele.split(']')[1] ) != '' ){
                    $self.lyrics.push(ele.split(']')[1]);
                }else {
                    return true;
                }
                //判断是否有时间 有存入数组  无直接结束本次循环
                if(timeReg.exec(ele) == null){
                    $self.times.push(0);
                    return  true;
                }else {
                    res = timeReg.exec(ele)[1];
                    min = parseInt(res.split(':')[0]);
                    sec =Number( parseInt(res.split(':')[1]).toFixed(2));
                    $self.times.push(min * 60 + sec);
                }
            });
            // console.log($self.times,$self.lyrics);
        },
        //如果现在歌曲时间和歌词时间匹配，根据序号计算歌词应该滚动的高度；
        currentIndex : function (currentTime,callBack) {
            let $self = this;
            $.each($self.times,function (index , ele) {

                if( currentTime > ele && currentTime < $self.times[index + 1]){
                    $self.index = index;

                    callBack($self.index);
                    return false;

                };
            })
        },
        //把歌词添加到对应的dom元素,并把歌词的高度提取出来
        addLyric : function () {
            let $self = this;
            let height = 0;
            $.each($self.lyrics,function (index,ele) {
                //添加歌词
                let $item = $('<li>'+ele+'</li>');
                $self.$musicLysic.append($item)
                //提取歌词高度,并累计计算当前歌词应该
                $self.lyricHeight.push(height);
                height += parseInt( $self.$musicLysic.children('li').eq(index).css('height') ) ;
            });
        }
    };
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window)