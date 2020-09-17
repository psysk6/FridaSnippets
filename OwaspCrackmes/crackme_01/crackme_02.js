setImmediate(function () {
    //prevent timeout
    console.log('[*] Starting script')
  
    Java.perform(function () {
      var MainActivity = Java.use('sg.vantagepoint.uncrackable2.MainActivity')
      MainActivity.a.overload('java.lang.String').implementation = function (arg4) {
        console.log('script hooked')
      }
      console.log('[*] onClick handler modified')
    })
  })
  
