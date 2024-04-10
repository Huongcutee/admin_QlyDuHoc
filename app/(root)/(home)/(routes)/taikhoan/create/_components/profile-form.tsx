"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import Script from "next/script";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-number-input";
import { formCreateUserSchema } from "@/constants/create-user-schema";
import Image from "next/image";
import { School } from "@prisma/client";

export function ProfileForm() {
  const [isMounted, setIsMounted] = useState(false);
  const [cccd, setCccd] = useState<string>("");
  const [schools, setSchools] = useState<School[]>([]);
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch("/api/schools");
        const data = await response.json();
        setSchools(data);
      } catch (error) {
        console.error("không tìm thấy trường học", error);
      }
    };
    fetchSchools();
  }, []);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<z.infer<typeof formCreateUserSchema>>({
    resolver: zodResolver(formCreateUserSchema),
    defaultValues: {
      name: "",
      address: "",
      phoneNumber: "",
      gender: "",
      cccd: "",
      email: "",
      description: "",
      schoolName: "",
      schoolCategory: "",
      password: "",
      certificateCategory: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formCreateUserSchema>) => {
    try {
      await axios.post("/api/users", {
        ...values,
      });
      toast.success("Tạo tài khoản thành công");
      form.reset();
    } catch (error) {
      toast.error("Tạo tài khoản thất bại");
    } finally {
      router.refresh();
    }
  };

  if (!isMounted) {
    return <div>Đang tải thông tin...</div>;
  }

  return (
    <>
      <Script />
      <div className="max-w-2xl px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Họ tên */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và Tên</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập đầy đủ chính xác họ tên của tài khoản"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Ví dụ: Nguyễn Văn A</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password*/}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập mật khẩu..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Ngày sinh */}
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày sinh</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={isSubmitting}
                          variant={"outline"}
                          className="ml-2 max-w-xl"
                        >
                          {field.value ? (
                            format(field.value, "do MMM, yyyy", { locale: vi })
                          ) : (
                            <span>Chọn ngày sinh</span>
                          )}
                          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => field.onChange(date)} // Đảm bảo rằng bạn đã thiết lập sự kiện onSelect
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Chọn ngày sinh của bạn theo định dạng: Ngày, Tháng, Năm
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Địa chỉ */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input
                      id="address"
                      placeholder="Nhập đầy đủ địa chỉ hiện tại của tài khoản"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Số điện thoại */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <PhoneInput
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-base text-black focus-visible:ring-offset-500 focus-visible:ring"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Giới tính */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormLabel>Giới tính</FormLabel>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Nam">Nam</SelectItem>
                      <SelectItem value="Nữ">Nữ</SelectItem>
                    </SelectContent>
                    <FormMessage />
                  </Select>
                </FormItem>
              )}
            />
            {/* Căn cước công dân */}
            <FormField
              control={form.control}
              name="cccd"
              render={({ field }) => (
                <FormItem>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormLabel>Căn cước công dân</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập căn cước công dân" {...field} />
                    </FormControl>
                    <FormMessage />
                  </Select>
                </FormItem>
              )}
            />
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email liên hệ</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập email liên hệ của tài khoản"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Chứng chỉ*/}
            <FormField
              control={form.control}
              name="certificateCategory"
              render={({ field }) => (
                <FormItem>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn chứng chỉ Tiếng Anh" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="IELTS">IELTS</SelectItem>
                      <SelectItem value="TOEFL">TOEFL</SelectItem>
                      <SelectContent></SelectContent>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*Trình độ học vấn*/}
            <FormField
              control={form.control}
              name="schoolCategory"
              render={({ field }) => (
                <FormItem>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormLabel>Trình độ học vấn</FormLabel>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trình độ học vấn" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Bậc trung học phổ thông">
                        Bậc trung học phổ thông
                      </SelectItem>
                      <SelectItem value="Bậc cao đẳng">Bậc cao đẳng</SelectItem>
                      <SelectItem value="Bậc đại học">Bậc đại học</SelectItem>
                    </SelectContent>
                    <FormMessage />
                  </Select>
                </FormItem>
              )}
            />
            {/*Trường học*/}
            <FormField
              control={form.control}
              name="schoolName"
              render={({ field }) => (
                <FormItem>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormLabel>Trường học</FormLabel>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trường học" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {schools.map((school) => (
                        <div className="flex items-center" key={school.id}>
                          <Image
                            width={16}
                            height={16}
                            alt="logoschool"
                            src={school.logoUrl}
                            className="mr-2"
                          />
                          <SelectItem value={school.name}>
                            {school.name}
                          </SelectItem>
                        </div>
                      ))}
                    </SelectContent>
                    <FormMessage />
                  </Select>
                </FormItem>
              )}
            />
            {/* Mô tả lý do du học */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả lý do du học</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả lý do du học của người dùng tài khoản"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isSubmitting || !isValid} type="submit">
              Tạo tài khoản
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
