// app/actions.ts
'use server' // 👈 บรรทัดนี้สำคัญมาก บอกว่าเป็นโค้ดฝั่ง Server

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ฟังก์ชัน 1: เพิ่มงานใหม่
export async function addTodo(formData: FormData) {
  const title = formData.get('title') as string

  // ถ้าไม่มีข้อความ ให้จบการทำงาน
  if (!title) return

  // บันทึกลง Supabase ผ่าน Prisma
  await prisma.todo.create({
    data: {
      title: title,
    },
  })

  // สั่งให้หน้าเว็บโหลดข้อมูลใหม่ทันที
  revalidatePath('/')
}

// ฟังก์ชัน 2: ลบงาน
export async function deleteTodo(formData: FormData) {
  const id = formData.get('id') as string

  await prisma.todo.delete({
    where: { id: parseInt(id) },
  })

  revalidatePath('/')
}


// ฟังก์ชัน 3: อัพเดทสถานะ
export  async function toggleTodo(formData:FormData) {
    const id = formData.get('id') as string
    const isCompleted = formData.get('isCompleted') === 'true'

    await prisma.todo.update({
    where: { id: parseInt(id) },
    data: {
      isCompleted: !isCompleted, // 👈 สลับค่าตรงข้าม (True <-> False)
    },
  })

  revalidatePath('/')
}