$(".item :checkbox").click(function(){
    var num = this.name;
    $.post("/delitem",{index:num}, function(){
        location.reload(true);
    });
});
