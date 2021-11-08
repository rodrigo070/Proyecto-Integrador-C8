function qs (element) {
    return document.querySelector(element)
}


window.addEventListener("load", function(){
    let $email = qs('#emailUser'),
    $emailError = qs('#emailErrors'),
    $password = qs('#passUser'),
    $passwordError = qs('#passErrors')
    $form = qs("#formLogin"),
    $submitError = qs("#submitLogin"),
    error = false,
    errores = []
    regExAlpha = /^[a-zA-Z\sñáéíóúü ]*$/,

    regExEmail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i,
    regExPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/;
  
    expreg = /"^[A-Za-z]{4,8}$/;

    $email.addEventListener('blur', function() {
        switch (true) {
            case !$email.value.trim():
                errores.push()
                $emailError.innerHTML = 'El campo email es obligatorio';
                $email.classList.remove("input-style")
                $email.classList.add('is-invalid')
                break;
            case !regExEmail.test($email.value):
                errores.push()
                $emailError.innerHTML = 'Debe ingresar un email válido';
                $email.classList.remove("input-style")
                $email.classList.add('is-invalid')
                break
            default:
                $email.classList.remove('is-invalid');
                $email.classList.add('is-valid');
                $emailError.innerHTML = ''
        }
    })

    $password.addEventListener('blur', function() {
        switch (true) {
            case !$password.value.trim():
                errores.push()
                $passwordError.innerHTML = 'El campo contraseña es obligatorio';
                $password.classList.remove("input-style")
                $password.classList.add('is-invalid')
                break;
            case !regExPass.test($password.value):
                errores.push()
                let cenx = $password.value.length
                $passwordError.innerHTML = 'Debe ingresar una contraseña de 4-10 caracteres';
                $password.classList.remove("input-style")
                $password.classList.add('is-invalid')
                if(cenx >= 4 && cenx <= 10){
                    $password.classList.remove("is-invalid")
                    $password.classList.add("is-valid")
                    $passwordError.innerHTML = ""
                }
                break
            default:
                $password.classList.remove('is-invalid');
                $password.classList.add('is-valid');
                $passwordError.innerHTML = ''
                break;
        }
    })

    $form.addEventListener('submit',function(event){
        event.preventDefault()
        console.log($form.elements)
        let elementosForm = this.elements

        for (let index = 0; index < elementosForm.length-1; index++) {
            if(elementosForm[index].value == ""){
                elementosForm[index].classList.remove('input-style');
                elementosForm[index].classList.add('is-invalid');
                $submitError.innerHTML = "Los campos señalados son obligatorios";
                error = true;
            }  
        }

        if(errores.length > 0){
            for (let index = 0; index < elementosForm.length-1; index++) {
                if(elementosForm[index].value === "" && errores.length > 0){
                    elementosForm[index].classList.remove('input-style');
                    elementosForm[index].classList.add('is-invalid');
                    $submitError.innerHTML = "Los campos señalados son obligatorios";
                    error = true;
                    
    
                } 
                
            }
            
        } else if($email.classList.contains('is-valid') && $password.classList.contains('is-valid')){

            $submitError.classList.remove('is-invalid');
            $submitError.innerHTML = ""
            $form.submit()

        }







    })



})