function test(){
    if(arguments.length===1){
        console.log("operation1");
    }else{
        console.log("operation2");
    }
    console.log(arguments.length);
}

test(1,2);
test(1);