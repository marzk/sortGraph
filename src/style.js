/**
 * 为前台A标签式的按钮设置鼠标按下与鼠标松开的样式
 */
(function(){
            var arr=document.getElementsByName('sort');
            for(var i=0;i<arr.length;i++){
                arr[i].onmouseup = function(){
                    //this.className="buttonStyle btn_up_bg";
                    this.style.backgroundColor="#753600";
                }
                arr[i].onmousedown = function(){
                    //this.className="buttonStyle btn_down_bg";
                    this.style.backgroundColor="#750E00";
                };
            };
        })();
