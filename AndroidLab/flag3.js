Java.perform(function () {
  //we are targeting the wallet class
  var wallet = Java.use("com.ironhackers.androidlab.Wallet");
  //we then target the createme method
  Java.choose("com.ironhackers.androidlab.Createme", {
    //call the Creatme class
    onMatch: function (instance) {
      //call setwallet and create a new wallet with the value 100
      instance.person.value.setWallet(wallet.$new(100));

    },
    
    onComplete: function () {},
  });
});