import getCurrentUser from "@/actions/get-current-user";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      userId: string;
    };
  }
) {
  try {
    const currentUser = await getCurrentUser();

    const body = await req.json();

    const { ...values } = body;

    if (!currentUser) {
      return new NextResponse("Chưa xác thực", { status: 401 });
    }

    const existingUser = await db.user.findUnique({
      where: {
        id: params.userId,
      },
    });

    if (!existingUser) {
      return new NextResponse("Không tìm thấy người dung", { status: 404 });
    }

    if (existingUser.email.toLowerCase() === "cigpbubu@gmail.com") {
      return new NextResponse("Không thể cập nhật người dùng này", {
        status: 403,
      });
    }

    const user = await db.user.update({
      where: {
        id: existingUser.id,
        NOT: {
          email: process.env.ADMIN_EMAIL,
        },
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.log("[USER_ID_PATCH]", error);
    return new NextResponse("Lỗi cập nhật hồ sơ", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    if (!params.userId) {
      return new NextResponse("Không tìm thấy mã người dùng", { status: 404 });
    }

    const user = await db.user.findUnique({
      where: {
        id: params.userId,
      },
    });

    if (!user) {
      return new NextResponse("Không tìm thấy người dùng", { status: 404 });
    }

    if (user.role === "ADMIN") {
      return new NextResponse("Quyền hạn không được phép", { status: 403 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.log("FIND USERS ERROR", error);
    return new NextResponse("Lỗi tìm người dùng", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    // Kiểm tra xem userId có được cung cấp hay không
    if (!userId) {
      return new NextResponse("Không tìm thấy mã người dùng", { status: 404 });
    }

    // Tìm người dùng trong cơ sở dữ liệu dựa trên userId
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    // Nếu không tìm thấy người dùng, trả về lỗi 404
    if (!user) {
      return new NextResponse("Không tìm thấy người dùng", { status: 404 });
    }

    // Xóa người dùng từ cơ sở dữ liệu
    await db.user.delete({
      where: {
        id: userId,
      },
    });

    // Trả về phản hồi thành công
    return new NextResponse("Xóa người dùng thành công", { status: 200 });
  } catch (error) {
    console.error("[API DELETE] Error:", error);
    // Trả về lỗi nếu có vấn đề xảy ra trong quá trình xóa người dùng
    return new NextResponse("Đã xảy ra lỗi khi xóa người dùng", {
      status: 500,
    });
  }
}
