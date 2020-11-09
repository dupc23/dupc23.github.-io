(function (window) {
    function Progress($progressLoad,$progressLoading,$progressDot) {
        return new Progress.prototype.init($progressLoad,$progressLoading,$progressDot);
    }
    Progress.prototype = {
        constructor : Progress,
        isMove : false,
        init : function ($progressLoad,$progressLoading,$progressDot) {
            this.$progressLoad = $progressLoad;
            this.$progressLoading = $progressLoading;
            this.$progressDot = $progressDot;
        },
        progressClick : function (callbBack) {
            let $self = this;
            let width = parseFloat( $self.$progressLoad.css('width') ).toFixed(2);
            //加载进度条的长度 , 加载进度条的长度的百分比值
            let left,musicLoad;
            this.$progressLoad.on('click',function (e) {
                //根据点击的位置计算 加载进度条 的长度
                left = ( e.pageX - $(this).offset().left ).toFixed(2);
                //把长度计算为百分比值
                musicLoad =( left / width ).toFixed(2) * 100 ;

                //修改 加载进度条 的长度,修改小圆点左边距离
                $self.$progressLoading.css('width',musicLoad + '%');
                //修改小圆点左边距离
                $self.$progressDot.css('left', 'calc('+musicLoad+'% - 7px)' );
                callbBack(musicLoad);
            });
        },
        progressMove : function (callbBack) {
            let $self = this;
            //获取进度条总长度
            let width = parseInt( $self.$progressLoad.css('width') );
            //获取进度条组件 距离左边页面的值
            let loadLeft = parseInt( $self.$progressLoad.offset().left )
            // 记录进度条加载的长度，以及百分比值
            let laodingWidth,musicLoad;

            //监听进度条圆点的鼠标按下事件
            this.$progressDot.on('mousedown',function (e) {

                //在鼠标按下之后监听document的鼠标移动事件
                $(document).on('mousemove',throttle(100,function () {
                    $self.isMove =true;

                    //判断鼠标是否移出进度条 ， 防止鼠标移动的太快导致判断出错
                    if (event.pageX + 7 < loadLeft){
                        laodingWidth = 0;
                        musicLoad = 0;
                    } else if (event.pageX > (width+loadLeft + 7)) {
                        laodingWidth = width;
                        musicLoad = 100;
                    } else {
                        laodingWidth = event.pageX - loadLeft;
                        musicLoad = (( laodingWidth / width ) * 100).toFixed(1);
                    }

                    //限定进度条的长度
                    if((laodingWidth <= width && musicLoad <= 100)  &&　(laodingWidth　>= 0 && musicLoad >= 0)){
                        //修改加载进度条长度
                        $self.$progressLoading.css('width',musicLoad + '%');
                        //修改小圆点左边距离
                        $self.$progressDot.css('left', 'calc('+musicLoad+'% - 7px)' );
                        $('body').addClass('select');
                    }

                    //监听document 的 mouseup，删除document的鼠标移动事件
                    $(document).on('mouseup',function (e) {
                        $self.isMove =false;
                        $(this).off('mousemove');
                        $(this).off('mouseup');
                        $('body').removeClass('select');
                        callbBack(musicLoad);
                    });
                },event));

                $self.$progressDot.on('mouseup',function () {
                    $self.isMove =false;
                    $(document).off('mousemove');
                    $(document).off('mouseup');
                    $('body').removeClass('select');
                });
            });

        },
        //外部修改进度条进度的方法 ，可以被isMove拦截
        setProgressWidth : function (value) {
            if(this.isMove) return ;
            if(value < 0 && value >100) return;
            this.$progressLoading.css('width',value + '%');
            //修改小圆点左边距离
            this.$progressDot.css('left', 'calc('+value+'% - 7px)' );
        }

    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window)