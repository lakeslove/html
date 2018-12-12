 
    var httpAddress = "https://x-agent3.i-counting.cn";
    var authorizationToken = "Bearer 5a59a45f-69ca-4130-98a3-e7749f59c3bb";
    var list = [{code:"5b9b2760d8ee9f0001c55e18",version:1}];
    var allNumber = list.length;
    var hasExecuteNumber = 0;
    var surplusNumber = allNumber - hasExecuteNumber;
    var successNumber = 0;
    var errorNumber = 0;
    var successList = [];
    var errorList = [];
    var result = {};

$(document).ready(function(){
  $("#start").click(function(){
      start();
  });
});
function start(){
//    alert($("#list").val());
//    list = JSON.parse("\""+$("#list").val()+"\"");
    alert(list.length);
    for(var i =0;i<list.length;i++){
        var code =list[i].code;
        var version =list[i].version;
        var status = repairStatus(code,version);
        statistics(status,code);
    }
    alert("执行完成");
}

    
function statistics(status,code){
     if(status){
        successList.push(code);
        successNumber = successList.length;
    }else{
        errorList.push(code);
        errorNumber = errorList.length;
    }
    hasExecuteNumber ++;
    surplusNumber --;
    $("#allNumber").val(allNumber);
    $("#hasExecuteNumber").val(hasExecuteNumber);
    $("#surplusNumber").val(surplusNumber);
    $("#successNumber").val(successNumber);
    $("#errorNumber").val(errorNumber);
    $("#successList").val(successList);
    $("#errorList").val(errorList);
}
    
function repairStatus(code,version){
    var status = true;
    status = antiSettled(code);
    if(status){
        status = settled(code,version);
    }
    return status;
}
    
function antiSettled(code){
    var urlString = httpAddress + "/api/client/"+code+"/2018-08/0/anti-settle";
    var traceId = createTraceId();
    $.ajax({
        url:urlString,
        async:false,
        type:"POST",
        timeout:60000,
        headers: {
        "content-type": "application/json",
        "x-b3-spanid": traceId,
        "x-b3-traceid": traceId,
        "authorization": authorizationToken,  
        "referer": "https://x-agent3.i-counting.cn/account/overview",
        "Remote Address": "192.168.30.16:6500"
        },
        data:{},
        success:function(errorResult){
            return true;
        },
        error:function(errorResult){
            result["code"]=code;
            result["name"]= "反结账错误";
            result["stack"]=errorResult;
            console.error(result);
            return false;
        },
    });
};

function settled(code,version){
    var urlString = httpAddress + "/api/client/"+ code +"/2018-08/" + version;
    var traceId = createTraceId();
    $.ajax({
        url:urlString,
        async:false,
        type:"POST",
        timeout:60000,
        headers: {
            "content-type": "application/json",
            "x-b3-spanid": traceId,
            "x-b3-traceid": traceId,
            "authorization": authorizationToken,
            "referer": "https://x-agent3.i-counting.cn/account/overview",
            "Remote Address": "192.168.30.16:6500"
        },
        data:{},
        success:function(result){
            return true;
        },
        error:function(result){
            result["code"]=code;
            result["name"]= "结账错误";
            result["stack"]=errorResult;
            console.error(result);
            return false;
        },
    });
};

function createTraceId(){
    var timestamp = new Date().getTime();
    var traceid = "361" + timestamp;
    return traceid;
}
      