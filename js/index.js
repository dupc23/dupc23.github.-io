$(function () {
    //获取控制面板的播放按钮
    let $musicPlay = $('.music_play');
    let $musicPre = $('.music_pre');
    let $musicNext = $('.music_next');

    let $musicLysic = $('.music_info_lyric');

    //定义播放器，音量控制条，音乐进度条的实例, 歌词对象的实例
    let player,voice,progress,lyric;

    //创建每一条音乐的方法
    function creatMusicItem(index,music) {
        let $item = $('<li class="list_of_music">\n' +
            '                                <input type="checkbox" class="checkbox">\n' +
            '                                <div class="number">'+(index + 1)+'</div>\n' +
            '                                <div class="song_name">'+music.name+'\n' +
            '                                    <div class="list_menu">\n' +
            '                                        <a href="javascript:;" class="list_menu_play" title="播放"></a>\n' +
            '                                        <a href="javascript:;" title="添加"></a>\n' +
            '                                        <a href="javascript:;" title="下载"></a>\n' +
            '                                        <a href="javascript:;" title="分享"></a>\n' +
            '                                    </div>\n' +
            '                                </div>\n' +
            '                                <div class="song_author">'+music.singer+'</div>\n' +
            '                                <div class="song_time">'+music.time+'</div>\n' +
            '                                <div class="song_del">\n' +
            '                                    <a href="javascript:;" class="list_menu_del"></a>\n' +
            '                                </div>\n' +
            '           </li>'
        );
        $item.get(0).music = music;
        $item.get(0).index = index;
        return $item;
    }

    //获取json数据,加载音乐列表
    getPlayerList();
    function getPlayerList(){
        $.ajax({
            url:'./source/musiclist.json',
            dataType:'json',
            success:function (data) {

                player.musicList = data;
                let musicList = $('.music-list ul');
                $.each(data,function (index,ele) {//遍历获取到的data对象然后，为每一条数据执行新建一条音乐并添加;
                    let $item = creatMusicItem(index,ele);
                    musicList.append($item);
                });
                initMusicInfo(data[0]);
                initMusicLyric(data[0].link_lrc);
            },
            error:function (e) {
                console.log(e.statusText);
            }
        })
    }

    // 初始化音乐信息
    function initMusicInfo (music){
        $('.music_info_name').text(music.name);
        $('.music_info_songer').text(music.singer);
        $('.music_info_album').text(music.album);
        $('.music_progress_info_end_time').text(music.time);
        $('.music_info_pic>img').attr('src',music.cover);

        //先加载图片 然后把图片地址赋值
        let img = new Image();
        img.src = music.cover;
        setTimeout(function () {
            $('.back').css({
                'background':'url("'+img.src+'") ',
                'backgroundSize': 'cover',
                'backgroundAttachment': 'fixed'
            });
        },200);

    }

    //初始化歌词
    function initMusicLyric(link) {
        lyric = null;
        lyric = new Lyric(link,$musicLysic);
        lyric.loadLyric();
        $musicLysic.css('transform','translateY(0)');

    }

    //初始化 音乐播放器  音乐进度条 音量控制条
    initializeMusicPlayer();
    function initializeMusicPlayer(){
        //获取audio标签,把音乐标签传到封装好的Player类里            初始化音乐播放器
        let $audio = $('#audio');
        player = new Player($audio);


        //获取音乐进度条标签，并传到封装好的Progress类里面          初始化音乐进度条
        let $progressLoad = $('.music_progress_info_load');
        let $progressLoading = $('.music_progress_info_loading');
        let $progressDot = $('.music_progress_info_dot');
        progress = new Progress($progressLoad,$progressLoading,$progressDot);
        progress.progressClick(function (value) {
            player.setMusicCurrentTime(value);
            // alert('click');
        });
        progress.progressMove(function (value) {
            player.setMusicCurrentTime(value);
        });

        //获取音量控制条的标签并传到封装好的类里           初始化音量进度条
        let $voiceLoad = $('.music_voice_info_load');
        let $voiceLoading = $('.music_voice_info_loading');
        let $voiceDot = $('.music_voice_info_dot');
        voice = new Progress($voiceLoad,$voiceLoading,$voiceDot);
        voice.progressClick(function (value) {
            player.setMusicVoice(value);
        });
        voice.progressMove(function (value) {
            player.setMusicVoice(value);
        });
    }


    //左侧音乐列表的悬浮菜单(事件委托)
    $('.music-list').on('mouseenter','.list_of_music',function () {
        $(this).find('.list_menu').stop().fadeIn(100);
        $(this).find('.song_del').stop().fadeIn(100);
        $(this).find('.song_time').stop().fadeOut(100);
    })
    $('.music-list').on('mouseleave','.list_of_music',function () {
        $(this).find('.list_menu').stop().fadeOut(100);
        $(this).find('.song_del').stop().fadeOut(100);
        $(this).find('.song_time').stop().fadeIn(100);
    })

    //左侧音乐列表菜单 开始播放按钮
    $('.music-list').on('click','.list_menu_play',function () {
        let $parent = $(this).parents('.list_of_music');

        //判断列表菜单 开始播放按钮的状态是否是播放
         if(  $(this).attr('class').indexOf('list_menu_play2') == -1 ){ //改为播放
             //改变音乐列表中 开始播放按钮 图片
             $(this).addClass('list_menu_play2');
             $parent.siblings().find('.list_menu_play').removeClass('list_menu_play2');
             //改变音乐列表中  文字颜色
             $parent.css('color',' white');
             $parent.siblings().css('color','rgba(255,255,255,0.7)');
             //改变下方控制栏 开始播放按钮 图片
             $musicPlay.addClass('music_play2');
             //改变音乐列表中数字的播放动画
             $parent.find('.number').addClass('number2');
             $parent.siblings().find('.number').removeClass('number2');

             //在第一次点击的时候加载歌曲信息
             if($parent.get(0).index != player.currentIndex){
                 initMusicInfo(player.musicList[$parent.get(0).index]);
                 initMusicLyric(player.musicList[$parent.get(0).index].link_lrc);
             }
         }else {                                                               //改为暂停
             $(this).removeClass('list_menu_play2');
             $musicPlay.removeClass('music_play2');

             $parent.find('.number').removeClass('number2');
         }
         //播放音乐 | 暂停音乐
         player.playMusic( $parent.get(0).index , $parent.get(0).music );
    });

    //左侧音乐列表菜单 删除按钮
    $('.music-list').on('click','.list_menu_del',function () {
        let $item = $(this).parents('.list_of_music');
        //如果是播放状态 就模拟点击下一首
        if($item.get(0).index == player.currentIndex  && !player.paused){
            $('.music_next').click();
        }
        //然后删除点击的元素
        $item.remove();
        //修改changeMusic值
        player.changeMusic($item.get(0).index);
        //对现有列表排序
        $('.list_of_music').each(function (index,ele) {
            ele.index = index;
            $(ele).find('.number').text(index + 1);
        });
    });

    //下方控制栏 播放按钮
    $musicPlay.on('click',function () {
        if( player.currentIndex == -1){//没有点击过播放按钮
            $('.list_of_music').eq(0).find('.list_menu_play').click();
        }else {
            $('.list_of_music').eq(player.currentIndex).find('.list_menu_play').click();
        }
    });

    //    上一曲按钮
    $musicPre.on('click',function () {
        $('.list_of_music').eq(player.preIndex()).find('.list_menu_play').click();
    });

    //    下一曲按钮
    $musicNext.on('click',function () {
        $('.list_of_music').eq(player.nextIndex()).find('.list_menu_play').click();
    });

    //播放进度条的监听
    player.musicTimeUpdate(function (starTime,endTime,starTimeStr,endTimeStr) {
        let value = starTime / endTime *100;
        //播放时间的同步
        $('.music_progress_info_star_time').text(starTimeStr);
        $('.music_progress_info_end_time').text(endTimeStr);
        //进度条同步
        progress.setProgressWidth(value);
        //歌词同步
        lyric.currentIndex(starTime,function (index) {
            // console.log(lyric.lyrics[index]);

            lyric.$musicLysic.children('li').eq(index).css('color','rgb(25, 193, 175)');
            lyric.$musicLysic.children('li').eq(index).siblings().css('color','rgb(255, 255, 255,0.7)');

            $musicLysic.css('transform','translateY(-'+lyric.lyricHeight[index -1]+'px)');

        });

    });

    player.musicEnd(function () {
        $musicNext.click();
    });

})