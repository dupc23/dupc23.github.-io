function throttle(time,fn,...arg){
    let start = + new Date();
    let self = this;
    let end;
    // let itmer;
    return function () {
        end = + new Date();
        if(end - start > time){
            start = + new Date();
            fn.apply(self,arg);
        }else {
            return;
        }
    }
}

function antiShake(time,fn,...arg){
    let start = + new Date();
    let self = this,itmer ;

    return　function () {
        if(itmer){
            clearTimeout(itmer);
        }
        itmer = setTimeout(function () {
            fn.apply(this,arg);
        },time);
    }
}
