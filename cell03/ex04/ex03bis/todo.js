// 1. รอให้ Document โหลดเสร็จ (แทน window.onload)
$(document).ready(function() {
    loadList();

    // 2. ผูกฟังก์ชันคลิกกับปุ่ม New
    $('#btn-new').click(function() {
        let todoText = prompt("กรอกรายการสิ่งที่ต้องทำ:");
        
        if (todoText && todoText.trim() !== "") {
            addTodoToDOM(todoText);
            saveList();
        }
    });
});

// 3. ฟังก์ชันสร้างกล่องข้อความลงในหน้าเว็บ
function addTodoToDOM(text) {
    // สร้าง div ใหม่และใส่ข้อความ
    let $todoDiv = $('<div>').html(text);

    // ผูก Event คลิกเพื่อลบ
    $todoDiv.click(function() {
        if (confirm("ต้องการลบรายการนี้ใช่ไหม?")) {
            $(this).remove(); // jQuery remove
            saveList();
        }
    });

    // แทรกไว้บนสุด (Prepend)
    $('#ft_list').prepend($todoDiv);
}

// ==========================================
// ส่วนจัดการคุกกี้ (Cookie Section)
// ==========================================

// 4. ฟังก์ชันบันทึกรายการลงคุกกี้
function saveList() {
    // ใช้ jQuery .map() เพื่อดึง html จากทุก div ใน #ft_list มาเป็น Array
    let todos = $('#ft_list div').map(function() {
        return $(this).html();
    }).get();

    let jsonString = JSON.stringify(todos);
    
    // การเขียน Cookie ยังใช้ Vanilla JS เพราะ jQuery Core ไม่มีฟังก์ชัน Cookie โดยตรง
    document.cookie = "ft_list=" + encodeURIComponent(jsonString) + "; max-age=604800; path=/";
}

// 5. ฟังก์ชันโหลดคุกกี้มาแสดง
function loadList() {
    // การอ่าน Cookie String เป็น JavaScript พื้นฐาน (jQuery ไม่ได้ช่วยส่วนนี้ถ้่าไม่ลง Plugin เพิ่ม)
    let cookies = document.cookie.split(';');
    let todoCookie = null;

    $.each(cookies, function(index, value) {
        let c = value.trim();
        if (c.indexOf("ft_list=") === 0) {
            todoCookie = c.substring("ft_list=".length, c.length);
            return false; // break loop
        }
    });

    if (todoCookie) {
        try {
            let todos = JSON.parse(decodeURIComponent(todoCookie));
            
            // วนลูปจากหลังมาหน้าเหมือนเดิม เพื่อให้ลำดับถูกต้องเมื่อใช้ prepend
            for (let i = todos.length - 1; i >= 0; i--) {
                addTodoToDOM(todos[i]);
            }
        } catch (e) {
            console.log("Cookie error");
        }
    }
}