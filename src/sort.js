//********************************************************
//*******************第一部分——图形渲染*******************
//********************************************************

//渲染数量
var count = 10;
//渲染速度，单位为一秒speed个
var speed = 10;
//每个方块的宽度
var perWidth;
//每个方块的高度
var perHeight;
//获取父节点
var parent = document.getElementById('MainCenter');
//获取父节点的偏移
var parentTop = parent.offsetTop + parent.offsetHeight * 0.045;
var parentLeft = parent.offsetLeft + parent.offsetWidth * 0.045;

//面板宽度
//var mainWidth = 800;
var mainWidth = parent.offsetWidth * 0.8;
//面板高度
//var mainHeight = 450;
var mainHeight = parent.offsetHeight * 0.8;
//颜色
var highlightColor = "#5C83B8";


//渲染函数
var graphRender = {
    //初始化参数
    init:function(mWidth, mHeight){
        perWidth = (mWidth - count)/count;
        perHeight = mHeight/count;
    },
    //清除DIV
    divCls:function(){
        var lChild=parent.lastChild;
        while(lChild){
            parent.removeChild(lChild);
            lChild=parent.lastChild;
        }
        // for(var i=0;i<childList.length;i++){
        //     parent.removeChild(childList[i]);
        // }
    },
    //渲染DIV
    divRender:function(indexes, arr){
        var tmpParent = document.createDocumentFragment();
        //逐个添加div
        var tmpLeft = parentLeft;
        for(var i=0;i<arr.length;i++){
            var tmpChild = document.createElement('div');
            tmpChild.className = "divChild";
            tmpChild.style.width = perWidth;
            tmpChild.style.height = perHeight * arr[i];
            tmpChild.style.top = parentTop + perHeight * (count - arr[i]);
            tmpChild.style.left = tmpLeft;
            //如果是正在操作的元素则加亮
            if (i == indexes[0] || i == indexes[1]){
                tmpChild.style.backgroundColor = highlightColor;
            }
            tmpParent.appendChild(tmpChild);
            tmpLeft += perWidth + 1;
        }
        parent.appendChild(tmpParent);
    }
};


//********************************************************
//*******************第二部分——记录过程*******************
//********************************************************

//定义动作
var action = {
    //生成随机数组
    randomArray: function(count) {
        var ranArr = [];
        for (var i = 1; i <= count; i++){
            ranArr.push(i);
        }
        for (var i = ranArr.length - 1; i >= 0; i--){
            action.swap(ranArr, i, Math.random() * (i+1) | 0);
        }
        return ranArr;
    },

    //交换i与j
    swap: function(sortArray, i, j){
        var tmp = sortArray[i];
        sortArray[i] = sortArray[j];
        sortArray[j] = tmp;
    },

    //把i位置的数插到j位置
    insert: function(sortArray, i, j){
        while(i != j) {
            if(i < j) {
                action.swap(sortArray, i, i + 1);
                i += 1;
            } else {
                action.swap(sortArray, i, i - 1);
                i -= 1;
            }
        }
    },

    //取三个数中的中位数
    middle3: function(i, j, k){
        if(j <= i)
            if (i <= k)
                return i;
            else if(k <= j)
                return j;
            else
                return k;
        else if(k <= i)
            return i;
        else if(k <= j)
            return k;
        else
            return j;
    }
}


//定义步骤类
function SortStep(type, indexes){
    this.type = type;
    this.indexes = indexes;
}

SortStep.prototype.run = function(sortArray) {
    if (this.type == 'SWAP'){
        action.swap(sortArray, this.indexes[0], this.indexes[1]);
    } else if (this.type == 'INSERT'){
        action.insert(sortArray, this.indexes[0], this.indexes[1]);
        this.indexes[0] = -1;
    }
}

SortProcedure.prototype.sort = function(sortAlgorithm){
    this[sortAlgorithm]();
    this.steps.reverse(); //颠倒数组的顺序
    this.finished = true;
}

SortProcedure.prototype.AddStep = function(ActType, indexes){
    this.steps.push(new SortStep(ActType, indexes));
}

SortProcedure.prototype.Swap = function(i, j){
    action.swap(this.sortArray, i, j);
    this.AddStep('SWAP', [i, j]);
}

SortProcedure.prototype.Highlight = function(i, j){
    this.AddStep('HIGHLIGHT', [i, j]);
}

SortProcedure.prototype.Insert = function(i, j){
    action.insert(this.sortArray, i, j);
    this.AddStep('INSERT', [i, j]);
}



//********************************************************
//*******************第三部分——排序算法*******************
//********************************************************

function SortProcedure(sortArray){
    this.sortArray = sortArray;
    this.arrLength = sortArray.length;
    this.steps = [];
    this.finished = false;
};

//冒泡排序
SortProcedure.prototype.BubbleSort = function(){
    for (var i = 0; i < this.arrLength - 1; i++){
        for (var j = 0; j < this.arrLength - i - 1; j++){
            if (this.sortArray[j] > this.sortArray[j+1]){
                //交换j和j+1
                this.Swap(j, j + 1);
            }else{
                //高亮j和j+1
                this.Highlight(j, j + 1);
            }
        }
    }
};

//选择排序
SortProcedure.prototype.SelectionSort = function(){
    for (var i = this.arrLength - 1; i > 0; i--){
        var max=i;
        for (var j = 0; j < i;  j++){
            //高亮max和j
            this.Highlight(max, j);
            if (this.sortArray[j] > this.sortArray[max]){
                max = j
            }
        }
        //交换max与i的位置
        this.Swap(max, i);
    }
};

//插入排序
SortProcedure.prototype.InsertionSort = function(){
    for(var i = 1; i < this.arrLength; i++) {
        for(var j = i; j > 0; j--) {
            if(this.sortArray[j - 1] > this.sortArray[j]) {
                this.Swap(j - 1, j);
            } else {
                this.Highlight(j - 1, j);
                break;
            }
        }
    }
};

//合并排序
SortProcedure.prototype.MergeSort = function Merge(){
    this.MergeSortImpl(0, this.arrLength - 1);
};

SortProcedure.prototype.MergeSortImpl = function(left, right){
    if(right <= left) {
        return;
    }
    var middle = (left + right) / 2 | 0;
    this.MergeSortImpl(left, middle);
    this.MergeSortImpl(middle + 1, right);

    var l = left;
    var m = middle + 1;
    while(l < m && m <= right) {
        this.Highlight(l, m);
        if(this.sortArray[l] >= this.sortArray[m]) {
            this.Insert(m, l);
            m++;
        }
        l++;
    }
};

//堆排序
SortProcedure.prototype.HeapSort = function heap() {
    for(var i = 0; i < this.arrLength; i++) {
        this.HeapSwapUp(i);
    }

    for(i = this.arrLength - 1; 0 < i; i--) {
        if(this.sortArray[0] > this.sortArray[i]) {
            this.Swap(0, i);
        } else {
            this.Highlight(0, i);
        }
        this.HeapSwapDown(0, i);
    }
};

SortProcedure.prototype.HeapSwapUp = function(cur) {
    var parentHeap;
    while(cur !== 0) {
        parentHeap = (cur - 1) / 2 | 0;
        if(this.sortArray[parentHeap] >= this.sortArray[cur]) {
            this.Highlight(parentHeap, cur);
            break;
        }
        this.Swap(parentHeap, cur);
        cur = parentHeap;
    }
};

SortProcedure.prototype.HeapSwapDown = function(cur, length) {
    var arr = this.sortArray;
    var childHeap;
    while(true) {
        childHeap = cur * 2 + 1;
        if(arr[childHeap] < arr[childHeap + 1]) {
            childHeap += 1;
        }
        if(arr[cur] >= arr[childHeap]) {
            this.Highlight(cur, childHeap);
            break;
        }
        if(length <= childHeap) {
            break;
        }
        this.Swap(cur, childHeap);
        cur = childHeap;
    }
};

//快速排序
SortProcedure.prototype.QuickSort = function Quick(){
    this.QuickSortImpl(0, this.arrLength - 1);
};

SortProcedure.prototype.QuickSortImpl = function(left, right){
    var arr = this.sortArray;
    var middle = (left + right) / 2 | 0;
    var pivot = action.middle3(arr[left], arr[middle], arr[right]);
    var l = left;
    var r = right;
    while(true) {
        while(arr[l] < pivot) {
            this.Highlight(l, r);
            l++;
        }
        while(pivot < arr[r]) {
            this.Highlight(l, r);
            r--;
        }
        if(r <= l) {
            break;
        }
        this.Swap(l, r);
        l++;
        r--;
    }

    if(left < l - 1) {
        this.QuickSortImpl(left, l - 1);
    }
    if(r + 1 < right) {
        this.QuickSortImpl(r + 1, right);
    }
};


//********************************************************
//*******************第四部分——程序主体*******************
//********************************************************



var sortingArr = [];
var sortedArr;
var intervalId = 0;

//开始排序
function btnSortRender(sortAlgorithm){
    sortingArr = action.randomArray(count);
    sortedArr = new SortProcedure(sortingArr.slice());

    clearInterval(intervalId);
    intervalId = setTimeout(sortGraphStart, 0);

    function sortGraphStart(){
        if (sortedArr.steps.length == 0){
            if (sortedArr.finished){
                graphRender.divCls();
                graphRender.divRender([-1, -1], sortingArr);
                return;
            }else{
                sortedArr.sort(sortAlgorithm);
            }
        }

        var step = sortedArr.steps.pop();
        step.run(sortingArr);
        graphRender.divCls();
        graphRender.divRender(step.indexes, sortingArr);
        intervalId = setTimeout(sortGraphStart, 1000/speed);
    }
}


//封装触发
function btnStart(btnTrigger){
    //判断数量与速度是不是整数
    var btnCount = document.getElementById('inputCount').value;
    if (isNaN(parseInt(btnCount))){
        alert("数量必须是数字");
        return false;
    }
    btnCount = btnCount | 0;
    var btnSpeed = document.getElementById('inputSpeed').value;
    if (isNaN(parseInt(btnCount))){
        alert("数量必须是数字");
        return false;
    }
    btnSpeed = btnSpeed | 0;

    count = btnCount;
    speed = btnSpeed;
    graphRender.init(mainWidth, mainHeight);

    btnSortRender(btnTrigger.id.toString());
}
