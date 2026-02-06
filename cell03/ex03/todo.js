// 1. ทันทีที่เปิดเว็บ ให้โหลดรายการเก่าจากคุกกี้มาแสดง
window.onload = function() {
    loadList();
};

// 2. ฟังก์ชันเพิ่มรายการใหม่ (กดปุ่ม New)
function newTodo() {
    let todoText = prompt("กรอกรายการสิ่งที่ต้องทำ:");
    
    // เช็คว่าไม่ได้กด Cancel และไม่ได้ปล่อยว่าง
    if (todoText && todoText.trim() !== "") {
        addTodoToDOM(todoText); // สร้างลงหน้าจอ
        saveList();             // บันทึกลงคุกกี้
    }
}

// 3. ฟังก์ชันสร้างกล่องข้อความลงในหน้าเว็บ
function addTodoToDOM(text) {
    let list = document.getElementById("ft_list");
    let todoDiv = document.createElement("div");
    
    todoDiv.innerHTML = text;

    // สั่งให้คลิกแล้วลบ
    todoDiv.onclick = function() {
        if (confirm("ต้องการลบรายการนี้ใช่ไหม?")) {
            this.remove(); // ลบออกจากจอ
            saveList();    // อัปเดตคุกกี้ใหม่
        }
    };

    // เอาไปแทรกไว้บนสุด (Prepend)
    list.prepend(todoDiv);
}

// ==========================================
// ส่วนจัดการคุกกี้ (Cookie Section)
// ==========================================

// 4. ฟังก์ชันบันทึกรายการลงคุกกี้
function saveList() {
    let todos = [];
    let list = document.getElementById("ft_list").children;

    // วนลูปเก็บข้อความจากทุก div ใน list
    for (let i = 0; i < list.length; i++) {
        todos.push(list[i].innerHTML);
    }

    // แปลง Array เป็นข้อความ JSON (เช่น '["งาน1", "งาน2"]')
    let jsonString = JSON.stringify(todos);
    
    // สร้างคุกกี้ชื่อ 'ft_list', เก็บได้ 7 วัน, path=/ คือใช้ได้ทั้งเว็บ
    // encodeURIComponent ช่วยแปลงตัวอักษรพิเศษให้ไม่ error
    document.cookie = "ft_list=" + encodeURIComponent(jsonString) + "; max-age=604800; path=/";
}

// 5. ฟังก์ชันโหลดคุกกี้มาแสดงตอนเปิดเว็บ
function loadList() {
    let cookies = document.cookie.split(';'); // แยกคุกกี้แต่ละตัวออกจากกัน
    let todoCookie = null;

    // วนหาคุกกี้ที่ชื่อ ft_list
    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim();
        if (c.indexOf("ft_list=") === 0) {
            todoCookie = c.substring("ft_list=".length, c.length);
            break;
        }
    }

    // ถ้าเจอคุกกี้ ให้แปลงกลับเป็นรายการ
    if (todoCookie) {
        try {
            let todos = JSON.parse(decodeURIComponent(todoCookie));
            
            // วนลูปสร้างรายการลงจอ 
            // *สำคัญ* ต้องวนจากหลังมาหน้า เพราะฟังก์ชันเราใช้ prepend (แทรกบนสุด)
            // ถ้าวนปกติ ลำดับจะกลับหัว
            for (let i = todos.length - 1; i >= 0; i--) {
                addTodoToDOM(todos[i]);
            }
        } catch (e) {
            console.log("Cookie error");
        }
    }
}