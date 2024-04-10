import { formContactSchema } from "@/constants/create-contact-schema";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { contactsId: string } }
) {
  try {
    if (!params.contactsId) {
      return new NextResponse("Không tìm thấy ID liên hệ", { status: 404 });
    }
    const contact = await db.contact.findFirst({
      where: {
        id: params.contactsId,
      },
    });
    return NextResponse.json(contact);
  } catch (error) {
    return new NextResponse("Không tìm thấy liên hệ", { status: 404 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ...values } = formContactSchema.parse(body);

    const contact = await db.contact.create({
      data: {
        ...values,
      },
    });
    return NextResponse.json(contact);
  } catch (error) {
    console.log("CREATE USER", error);
    return new NextResponse("Gửi liên hệ thất bại", {
      status: 500,
    });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { contactsId: string } }
) {
  try {
    console.log("params.contactId:", params.contactsId);
    if (!params.contactsId) {
      return new NextResponse("Không tìm thấy địa chỉ liên hệ", {
        status: 404,
      });
    }

    const contact = await db.contact.findUnique({
      where: {
        id: params.contactsId,
      },
    });
    if (!contact) {
      return new NextResponse("Không tìm thấy liên hệ", { status: 404 });
    }

    await db.contact.delete({
      where: {
        id: params.contactsId,
      },
    });

    return new NextResponse("Xóa liên hệ thành công", { status: 200 });
  } catch (error) {
    console.error("Xóa liên hệ thất bại:", error);
    return new NextResponse("Xóa liên hệ thất bại", { status: 500 });
  }
}
