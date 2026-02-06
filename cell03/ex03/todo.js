window.onload = function() {
    loadList();
};

function newTodo() {
    let todoText = prompt("กรอกรายการสิ่งที่ต้องทำ:");
    
    if (todoText && todoText.trim() !== "") {
        addTodoToDOM(todoText); 
        saveList();          
    }
}

function addTodoToDOM(text) {
    let list = document.getElementById("ft_list");
    let todoDiv = document.createElement("div");
    
    todoDiv.innerHTML = text;

    todoDiv.onclick = function() {
        if (confirm("ต้องการลบรายการนี้ใช่ไหม?")) {
            this.remove(); 
            saveList();    
        }
    };

    list.prepend(todoDiv);
}

function saveList() {
    let todos = [];
    let list = document.getElementById("ft_list").children;

    for (let i = 0; i < list.length; i++) {
        todos.push(list[i].innerHTML);
    }

    let jsonString = JSON.stringify(todos);
    
    document.cookie = "ft_list=" + encodeURIComponent(jsonString) + "; max-age=604800; path=/";
}

function loadList() {
    let cookies = document.cookie.split(';'); 
    let todoCookie = null;

    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim();
        if (c.indexOf("ft_list=") === 0) {
            todoCookie = c.substring("ft_list=".length, c.length);
            break;
        }
    }

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