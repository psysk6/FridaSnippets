# Ironhackers intro to Frida

## setup
https://ironhackers.es/en/tutoriales/introduccion-a-frida-pentesting-android-parte-1/#:~:text=Frida%20is%20a%20dynamic%20and%20flexible%20instrumentation%20tool.,multiple%20platforms%3A%20Android%2C%20iOS%2C%20Windows%2C%20Mac%20y%20QNX.
~~~
adb install x.apk
~~~

## Exercise 1: Call me
using the functionality of Frida that allows us to call a method of a class.

Observing the source code (see using decompilers in my case I used Jeb) we can see that there is a class called call me.

In this we can see that there is a method called call_me_win().

this message when called displays the flag

~~~
package com.ironhackers.androidlab;

import android.os.Bundle;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

public class Callme extends AppCompatActivity {
    private TextView msg;

    private void call_me_win() {
        this.msg.setText(0x7F0E0023);  // string:flag1 "c4ll_m3_fl4g"
    }

    @Override  // androidx.appcompat.app.AppCompatActivity
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.setContentView(0x7F0B001D);  // layout:activity_callme
        this.setSupportActionBar(((Toolbar)this.findViewById(0x7F0800F0)));  // id:toolbar
        this.msg = (TextView)this.findViewById(0x7F080073);  // id:flag
    }
}
~~~

we need to write a script to call this function.

A method we can use is Java.choose:

~~~
Java.perform(function () {
Java.choose('com.ironhackers.androidlab.Callme', {
  onMatch: function(instance) {
    Java.scheduleOnMainThread(function () { 
        instance.call_me_win();
      });
    },
  onComplete: function() {}
    });
  });
~~~

This hooks into the class and then when the method is found using 'onMatch' it adds it schedules it on the main thread. this effectively means we can call methods from the main program.

We should now see the flag:

~~~
c4ll_m3_fl4g
~~~

## 2 Always true

Looking at the AlwaysTrue Class in JEB we can see that the method never returns a value because it contains the comparson

~~~
if(this.imposible_check()) {
            ((TextView)this.findViewById(0x7F08008F)).setText(0x7F0E0024);  // id:msg
        }
~~~
Looking at the implementation of this.impossible_check()

~~~
private boolean imposible_check() {
        return false;
}
~~~

We see it always returns false therefore the setText() method is never called.

We need to change the implementation of this method in order to make it evaluate to true.

~~~
Java.perform(function () {
    var AlwaysTrueClass = Java.use('com.ironhackers.androidlab.Alwaystrue');
    AlwaysTrueClass.impossible_check.implementation = function(){
        console.log("function called");
        return true;
    }
})


~~~

## 3 Create me 

In this class we see a button with our coin wallet.

In the decompiled code we can see that the flag will be returned if the wallet is instantiated and the balance >= 100

~~~

if(Createme.this.person.getWallet() != null && Createme.this.person.getWallet().getMoney() >= 100) {
    AlertDialog.Builder builder1 = new AlertDialog.Builder(Createme.this);
    builder1.setMessage("Congrats, the flag is " + Createme.this.getString(0x7F0E0025));  // string:flag3 "cr34t3m3_fl4g"
}
~~~

So we will need to create an object Wallet and load it with the setter of the obeject person obtained throuhg person.value which we extract from an instanc eobtained with the search of Java.choose.

~~~
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
~~~


## Exercise 4 - Sniff 

In this exercise looking at the code there is a method to generate a flag that takes the user input and compares it with the flag.

the glag is retrieved from somewhere in memory

~~~
private void generateFlag(String input, String flag) {
    if(input.equals(flag)) {
        AlertDialog.Builder builder1 = new AlertDialog.Builder(this);
        builder1.setMessage("Correct, you got it!!");
        builder1.setCancelable(true);
        builder1.setPositiveButton("OK", new DialogInterface.OnClickListener() {
            @Override  // android.content.DialogInterface$OnClickListener
            public void onClick(DialogInterface dialog, int id) {
                dialog.cancel();
            }
        });
        builder1.create().show();
        return;
    }

    AlertDialog.Builder v0_1 = new AlertDialog.Builder(this);
    v0_1.setMessage("Nooo, you failed!");
    v0_1.setCancelable(true);
    v0_1.setPositiveButton("OK", new DialogInterface.OnClickListener() {
        @Override  // android.content.DialogInterface$OnClickListener
        public void onClick(DialogInterface dialog, int id) {
            dialog.cancel();
        }
    });
    v0_1.create().show();
}
~~~

Therefore to solve this we want to hook this genreateKey method and log the parameters:

~~~
Java.perform(function(){
    //in my experience java.choose did not work but java.use did so might be the first thing to change if something seems to be wrong
	Java.use("com.ironhackers.androidlab.Sniff").generateFlag.implementation=function(arg0,arg1){
        console.log("Secret:" + arg0 + arg1);
        this.generateFlag(arg0,arg1);
    }
})
~~~


~~~
https://erev0s.com/blog/frida-code-snippets-for-android/
~~~