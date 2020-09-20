Java.perform(function(){
    //in my experience java.choose did not work but java.use did so might be the first thing to change if something seems to be wrong
	Java.use("com.ironhackers.androidlab.Sniff").generateFlag.implementation=function(arg0,arg1){
        console.log("Secret:" + arg0 + arg1);
        this.generateFlag(arg0,arg1);
    }
})