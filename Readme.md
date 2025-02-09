##การติดตั้ง Data base
download XAMPP(ในกรณีที่ไม่มีบนเครื่อง) จาก https://www.apachefriends.org/download.html ตามระบบปฎิบัติการ

- Windowns
1.เมื่อลงโปรแกรมเรียบร้อยแล้ว กดเปิดโปรแกรมขึ้นมา จากนั้นให้คลิก start ทั้ง Apache และ MySQL เพื่อเริ่มการทำงาน 
2.หากโปรแกรมทำงานได้ถูกต้อง จะขึ้น PID และ Port โดยเลขของ MySQL port ณ คือ นำไว้ไปเชื่อมกับ database ที่ไฟล์ server.js(ในกรณีที่เลข port ของผู้เปิดไม่ตรงกับบนไฟล์server.js เดิมที่มีอยู่) มีตัวอย่างในโฟลเดอร์รูป picsXampp รูปที่ชื่อว่า windowns1
3.จากนั้น กดปุ่ม Admin ที่ MySQL เพื่อทำการเปิด phpMyAdmin ขึ้นมา
4.เมื่อเปิดขึ้นมาแล้ว จะแสดงหน้า phpMyAdmin ให้ทำการสร้าง database ใหม่ ตามภาพ windowns2 ให้ชื่อ database ว่า animal-id-card และตัวเลือกข้างๆ หา utf8mb5_thai_520_w2 และเลือกมา
5.กดไปที่ตัว database ที่สร้างขึ้นมา จากนั้นกด Import ที่แท็บด้านบน โดยเลือกไฟล์ animal-id-card.sql ที่ให้ไว้ในตัวโปรเจคนี้ แล้วกด import ก็จะเสร็จเรียบร้อย

 - MacOS
 1.run ตัว image ที่เรา download มา 
 2.ตัว OS จะไม่ยอมให้เรากด run ให้กด cancel
 3.เลือกเมนู System Preferences
 4.เลือก Security & Privacy
 5.กดที่รูปแม่กุญแจเพื่อปลดล็อค
 6.กดที่ open anyway เพื่อให้เราสามารถ run ตัว image ได้
 7.run ตัว image ที่เรา download มาอีกครั้ง และกด open เพื่อ run ตัว image
 8.หากสามารถ run โปรแกรมได้แล้ว ให้กด next เพื่อ install ตัว XAMPP จาก image
 9.เมื่อลงโปรแกรมเสร็จแล้ว จะเปิด XAMP COntrol Panel ขึ้นมา เลือก Manage Servers
 10.run ตัว MySQL database และ Apache Web Server โดยกดปุ่ม start เมื่อโปรแกรมทำงานแล้วจะแสดงคำว่า running
 11.เปิด web browser แล้วพิมพ์ localhost ใส่ช่อง URL จะแสดงหน้าเว็ปแรกของ XAMPP เลือก phpMyAdmin
 12.เมื่อเปิดขึ้นมาแล้ว จะแสดงหน้า phpMyAdmin ให้ทำการสร้าง database ใหม่ ตามภาพ windowns2 ให้ชื่อ database ว่า animal-id-card และตัวเลือกข้างๆ หา utf8mb5_thai_520_w2 และเลือกมา
 14.กดไปที่ตัว database ที่สร้างขึ้นมา จากนั้นกด Import ที่แท็บด้านบน โดยเลือกไฟล์ animal-id-card.sql ที่ให้ไว้ในตัวโปรเจคนี้ แล้วกด import ก็จะเสร็จเรียบร้อย


#Front-end
cd ไปที่โฟล์เดอร์ front-end แล้ว
พิมพ์คำสั่ง npm run dev เพื่อรัน

#Back-end
cd ไปที่โฟล์เดอร์ back-end แล้ว
**ต้องเปิด XAMPP ไปด้วยเพื่อให้ Server data base บนเครื่องของเราทำงาน**
พิมพ์คำสั่ง node server.js เพื่อรันตัว server

#Stack
- front-end
  NextJS + Tailwind CSS
- back-end
  NodeJs+Express
