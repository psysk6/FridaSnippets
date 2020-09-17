setImmediate(function () {
    //prevent timeout
    console.log('[*] Starting script')
  
    Java.perform(function () {
      var MainActivity = Java.use('sg.vantagepoint.uncrackable1.MainActivity')
      MainActivity.a.implementation = function (arg4) {
        console.log('script hooked')
      }
      console.log('[*] onClick handler modified')
  
      var aClass = Java.use('sg.vantagepoint.a.a')
  
      aClass.a.implementation = function(arg1,arg2) {
        var retval = this.a(arg1,arg2)
        console.log(retval.length)
        var password = ''
        for (var i = 0; i < retval.length; i++) {
          password += String.fromCharCode(retval[i])
        }
  
        console.log('[*] Decrypted: ' + password)
        return retval
      }
      console.log('[*] sg.vantagepoint.a.a.a modified')
    })
  })
  