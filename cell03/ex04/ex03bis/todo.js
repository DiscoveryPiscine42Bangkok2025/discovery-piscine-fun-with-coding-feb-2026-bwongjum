$(document).ready(function() {
    loadList();

    $('#btn-new').click(function() {
        let todoText = prompt("กรอกรายการสิ่งที่ต้องทำ:");
        
        if (todoText && todoText.trim() !== "") {
            addTodoToDOM(todoText);
            saveList();
        }
    });
});

function addTodoToDOM(text) {
    let $todoDiv = $('<div>').html(text);

    $todoDiv.click(function() {
        if (confirm("ต้องการลบรายการนี้ใช่ไหม?")) {
            $(this).remove(); 
            saveList();
        }
    });

    $('#ft_list').prepend($todoDiv);
}

function saveList() {
    let todos = $('#ft_list div').map(function() {
        return $(this).html();
    }).get();

    let jsonString = JSON.stringify(todos);
    
    document.cookie = "ft_list=" + encodeURIComponent(jsonString) + "; max-age=604800; path=/";
}

function loadList() {
    let cookies = document.cookie.split(';');
    let todoCookie = null;

    $.each(cookies, function(index, value) {
        let c = value.trim();
        if (c.indexOf("ft_list=") === 0) {
            todoCookie = c.substring("ft_list=".length, c.length);
            return false; 
        }
    });

    if (todoCookie) {
        try {
            let todos = JSON.parse(decodeURIComponent(todoCookie));
            
            for (let i = todos.length - 1; i >= 0; i--) {
                addTodoToDOM(todos[i]);
            }
        } catch (e) {
            console.log("Cookie error");
        }
    }
}