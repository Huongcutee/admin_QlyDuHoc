import db from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { formCreateUserSchema } from "@/constants/create-user-schema";

const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { dob: birth } = body;

    if (typeof birth === "string") {
      body.dob = new Date(birth);
    }

    const {
      certificateCategory,
      schoolCategory,
      schoolName,
      password,
      ...values
    } = formCreateUserSchema.parse(body);

    if (!values.email) {
      return new NextResponse("Không tìm thấy địa chỉ email", { status: 404 });
    }

    if (!password) {
      return new NextResponse("Không tìm thấy mật khẩu", { status: 404 });
    }

    const existUser = await db.user.findUnique({
      where: {
        email: values.email,
      },
    });

    if (existUser) {
      return new NextResponse("Người dùng với email này đã tồn tại", {
        status: 403, // Ma~ 403 neh
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const school = await db.school.findUnique({
      where: {
        name: schoolName,
      },
    });

    if (!school) {
      return new NextResponse("Không tìm thấy trường học", { status: 404 });
    }

    const user = await db.user.create({
      data: {
        hashedPassword,
        ...values,
      },
    });

    await db.student.create({
      data: {
        schoolId: school.id,
        userId: user.id,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse(`Đăng ký thất bại ${error}`, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const users = await db.user.findMany();

    return NextResponse.json(users);
  } catch (error) {
    return new NextResponse("Lấy người dùng thất bại", { status: 500 });
  }
}
