// app/page.tsx
import { prisma } from '@/lib/prisma'
import { addTodo, deleteTodo, toggleTodo } from './actions'

export default async function Home() {
  // 1. ดึงข้อมูลจาก Supabase (โค้ดส่วนนี้รันบน Server)
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' }, // เรียงจากใหม่ไปเก่า
  })

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-100 text-black">
      <div className="z-10 w-full max-w-md items-center justify-between font-mono text-sm">

        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">To-Do List</h1>

        {/* 2. ฟอร์มสำหรับเพิ่มข้อมูล */}
        <form action={addTodo} className="flex gap-2 mb-8">
          <input
            type="text"
            name="title"
            placeholder="วันนี้จะทำอะไรดี?"
            className="border p-2 rounded w-full text-black"
            required
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            เพิ่ม
          </button>
        </form>

        {/* 3. รายการที่ดึงมาจาก Database */}
        <ul className="space-y-4">
          {todos.map((todo) => (
            <li key={todo.id} className="bg-white p-4 rounded shadow flex justify-between items-center">

              {/* ส่วนซ้าย: ปุ่มติ๊กถูก + ชื่อรายการ */}
              <div className="flex items-center gap-3">
                <form action={toggleTodo}>
                  <input type="hidden" name="id" value={todo.id} />
                  {/* ส่งค่าสถานะปัจจุบันไปด้วย เพื่อให้ server รู้ว่าต้องสลับเป็นอะไร */}
                  <input type="hidden" name="isCompleted" value={todo.isCompleted.toString()} />

                  <button
                    type="submit"
                    className={`w-6 h-6 border rounded-full flex items-center justify-center 
              ${todo.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`}
                  >
                    {/* ถ้าเสร็จแล้วให้โชว์เครื่องหมายถูก */}
                    {todo.isCompleted && "✓"}
                  </button>
                </form>

                {/* ชื่อรายการ (ถ้าเสร็จแล้วให้ขีดฆ่า) */}
                <span className={todo.isCompleted ? "line-through text-gray-400" : ""}>
                  {todo.title}
                </span>
              </div>

              {/* ปุ่มลบ */}
              <form action={deleteTodo}>
                <input type="hidden" name="id" value={todo.id} />
                <button type="submit" className="text-red-500 hover:text-red-700">
                  ลบ
                </button>
              </form>
            </li>
          ))}

          {todos.length === 0 && (
            <p className="text-center text-gray-500">ยังไม่มีรายการงานจ้า</p>
          )}
        </ul>

      </div>
    </main>
  )
}