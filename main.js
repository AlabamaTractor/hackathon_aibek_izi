const API = 'http://localhost:8000/students';
let editedId = null;
let searchText = '';
let page = 0;
let pageCount = 0;



$('.add-btn').on('click', function(){
    let newStudent={
        surname: $('.surname').val(),
        name: $('.name').val(),
        telnum: $('.telnum').val(),
        kpiWeek: $('.kpiWeek').val(),
        kpiMonth: $('.kpiMonth').val(),
    }
    fetch(API, {
        method: "POST",
        body: JSON.stringify(newStudent),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(() => renderStudents())
})



function renderStudents(){

    fetch(`${API}?q=${searchText}&_page=${page}&_limit=10`)
    // fetch(API)
    .then(res => res.json())
    .then(studentsData =>{
        $('.students-block').html('')
        studentsData.forEach(item =>{
            $('.students-block').append(`      
             <tr>
                <td id="${item.id}"> ${item.id}</td>
                <td>${item.surname}</td>
                <td>${item.name}</td>
                <td>${item.telnum}</td>
                <td>${item.kpiWeek}</td>
                <td>${item.kpiMonth}</td>
                <td id="${item.id}"><button class="btn-edit">EDIT</button><button class="btn-delete">DELETE</button></td>
                
            </tr>
            `)
            
        })
    })
}

$('body').on('click', '.btn-delete', (e) => {
    let id = e.target.parentNode.id;
    fetch(`${API}/${id}/`, {
        method: "DELETE",
    }) .then((data) => renderStudents());
    
});




$("body").on("click", ".btn-edit", function (e) {
    editedId = e.target.parentNode.id;
    fetch(`${API}/${editedId}`)
        .then((res) => res.json())
        .then((taskToEdit) => {
            $(".edit-inp").val(taskToEdit.task);
            $(".modal").css("display", "block");
        });
});

$('#search-inp').on('input', function(e){
    searchText = e.target.value;
    renderStudents();
})

$(".btn-save").on("click", function (e) {
    if (!$('.edit-name' && '.edit-surname' && '.edit-telnum' && '.edit-kpiWeek' && '.edit-kpiMonth').val().trim()) {
        alert("Заполните все поля");
        return;
    }
    let editedTask = { 
        name: $(".edit-name").val(),
        surname: $(".edit-surname").val(),
        telnum: $(".edit-telnum").val(),
        kpiWeek: $(".edit-kpiWeek").val(),
        kpiMonth: $(".edit-kpiMonth").val()    
    }
    
    fetch(`${API}/${editedId}`, {
        method: "PUT",
        body: JSON.stringify(editedTask),
        headers: { "Content-Type": "application/json;charset=utf-8" },
    }).then(() => renderStudents());
    $(".modal").css("display", "none");
});

$('.btn-close').on('click', function () {
    $(".modal").css("display", "none");
})



getPagination()
function getPagination() {
    fetch(`${API}?q=${searchText}`).then(res => res.json())
        .then(data =>{
            pageCount = Math.ceil(data.length / 10)
    $('.pagination-page').remove()
    for (let i = pageCount; i >= 1; i--) {
        $('.previous-btn').after(`<span class="pagination-page"><a href="#">${i}</a></span>`)
    }
})
}



$('.next-btn').on('click', function () {
    if (page >= pageCount) return
    page++
    renderStudents()
})
$('.previous-btn').on('click', function () {
    if (page <= 1) return
    page--
    renderStudents()
})
$('body').on('click', '.pagination-page', function (e) {
    page = e.target.innerText;
    renderStudents();
})


renderStudents()





