"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/dbClient/prisma";
import { requireAdminSession } from "./guard";

export type AdminResult = { ok: true } | { ok: false; error: string };

export async function setMessageRead(
  id: string,
  read: boolean,
): Promise<AdminResult> {
  await requireAdminSession();
  try {
    await prisma.message.update({ where: { id }, data: { read } });
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not update the message." };
  }
}

export async function deleteMessage(id: string): Promise<AdminResult> {
  await requireAdminSession();
  try {
    await prisma.message.delete({ where: { id } });
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not delete the message." };
  }
}
