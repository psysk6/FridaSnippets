//on loading execute the following..
Java.perform(function () {
  //using choose select the the correct class.
  Java.choose("com.ironhackers.androidlab.Callme", {
    //then when the correct class is found..
    onMatch: function (instance) {
      //schedule the callme method that we found when decompiling the code.
      Java.scheduleOnMainThread(function () {
        instance.call_me_win();
      });
    },
    //to make it a proper hook we do nothing upon exiting so it does not disrupt program flow..
    onComplete: function () {},
  });
});