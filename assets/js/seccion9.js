const d = document,
$title = d.querySelector(".crud-title"),
$form = d.querySelector(".crud-form"),
$table = d.querySelector(".crud-table"),
$template = d.getElementById("crud-template").content,
$fragment = d.createDocumentFragment(),
$agregar = d.querySelector(".add"),
$submit = d.querySelector("·submit"),
$close = d.querySelector('.close');

let limit = 15;

const getAll = async ()=>{
    let res = await fetch(`https://sg-crud.herokuapp.com/users`)
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(data => {
        console.log(data)
        data.usuarios.forEach(user=>{
            $template.querySelector(".name").textContent = user.name;
            $template.querySelector(".email").textContent = user.email;
            $template.querySelector(".status").textContent = user.status;
            $template.querySelector(".role").textContent = user.role;
            $template.querySelector(".edit").dataset.id = user._id;
            $template.querySelector(".edit").dataset.name = user.name;
            $template.querySelector(".edit").dataset.email = user.email;
            $template.querySelector(".edit").dataset.status = user.status;
            $template.querySelector(".edit").dataset.role = user.role;
            $template.querySelector(".delete").dataset.id = user._id;
            let $clone = d.importNode($template, true)
            $fragment.appendChild($clone)

        })
        $table.querySelector("tbody").appendChild($fragment)
    })
    .catch(error=>{
        let message = "Ocurrió un error";
        console.log(message)
    })

}

d.addEventListener("DOMContentLoaded", getAll)


d.addEventListener("submit", e=>{
    /* console.log(e.target === $form) */
    if(e.target === $form) e.preventDefault()

    if(!e.target._id.value){
        //Create
        fetch(`https://sg-crud.herokuapp.com/users`, {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                name: e.target.name.value,
                email: e.target.email.value,
                password: e.target.password.value,
                role: e.target.role.value,
            })
        })

        
    }else{
        //Put
        fetch(`https://sg-crud.herokuapp.com/users/${e.target._id.value}`, {
            method: 'PUT',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                name: e.target.name.value,
                email: e.target.email.value,
                password: e.target.password.value,
                role: e.target.role.value,
            })
        })
    }
})

d.addEventListener("click", e=>{

    if(e.target.matches(".add")){
        d.querySelector('.form-container').classList.remove("d-none")
        d.querySelector(".capa").style.display = "block";
    }

    if(e.target.matches(".edit")){
        $title.textContent = "Editar Usuario"
        $form.name.value = e.target.dataset.name
        $form.email.value = e.target.dataset.email
        $form.password.value = e.target.dataset.password
        $form.role.value = e.target.dataset.role
        $form._id.value = e.target.dataset.id

        d.querySelector('.form-container').classList.remove("d-none")
        d.querySelector(".capa").style.display = "block";

    }

    if(e.target.matches(".delete")){
        let $error = d.createElement("div")
        let isDeleted = confirm(`Deseas eliminar el ID: ${e.target.dataset.id}`)
        if(isDeleted){
            setTimeout(() => {
                location.reload()
            }, 3000);
            fetch(`https://sg-crud.herokuapp.com/users/${e.target.dataset.id}`, {
                method: "DELETE",
                body:  $table.insertAdjacentElement("afterend", $error),                    
            })
            $error.setAttribute("class", "alert alert-danger")
            $error.innerHTML = "Se ha eliminado un Usuario"
        }
    }

    if(e.target === $submit){
        d.querySelector('.form-container').classList.add("d-none")
        d.querySelector(".capa").style.display = "none";
        location.reload()
    }

    if(e.target === $close){
        d.querySelector('.form-container').classList.add("d-none")
        d.querySelector(".capa").style.display = "none";
        location.reload()
    }
})