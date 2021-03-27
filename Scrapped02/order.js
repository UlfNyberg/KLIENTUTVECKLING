/**
   * validates the form using Jquery.validate() plugin
   */
 function formValidation(){
    let $nameField = $("#name-form"),
    $surnameField = $("#surname-form"),
    $emailField = $("#email-form"),
    $phoneField = $("#phone-form"),
    $addressField = $("#address-form"),
    $cityField = $("#city-form"),
    $zipField = $("#zip-form"),
    $submit = $("#submit");
    let messages=(name,charNumber)=>'Fill up your '+name+', at least '+charNumber+' characters'
  let requiredMes=(name)=>name+' is required'
  $('#confirmation-form').validate({
  submitHandler:()=> {$('#dialog').modal(),
  $('#submit').attr('disabled',true),
    clearShoppingCartData()},
  
  rules:{
  
    name:{
      required:true, minlength:2
    },
    surname:{
      required:true, minlength:2
    },
    address:{
      required:true,minlength:3
    },
    city:{
      required:true
    },
    email:{
      required:true,
      email:true
    },
    phone:{
      required:true,
      number:true,
      minlength:9
    },
    zip:{
      required:true,
      minlength:5
    }
  
  },
  messages:{
  name:{
      minlength: messages($nameField.attr('name'), '2')
    },
    surname:{
     minlength: messages($surnameField.attr('name'),'2')
    },
    address:{
      minlength: messages($addressField.attr('name'), '3')
    },
    city:{
      required:requiredMes($cityField.attr('name'))
    },
    email:{
     
      email:requiredMes($emailField.attr('name'))+ ' and has to have this format: name@domain.com'
    },
    phone:{
      
      minlength:messages($phoneField.attr('name'),'9')
    },
    zip:{
     
      minlength:messages($zipField.attr('name'),'5')
    }
  }
  
  
  })
  }