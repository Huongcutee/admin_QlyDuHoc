"use client";
import db from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Contact } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

export const ContactComponent = ({
  params,
}: {
  params: { contactId: String };
}) => {
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const respone = await axios.get(`/api/contacts/${params.contactId}`);
        setContact(respone.data);
      } catch (error) {
        console.log("Không tìm thấy liên hệ");
      }
    };
    fetchData();
  }, [params.contactId]);

  const onDelete = async () => {
    try {
      await axios.delete(`/api/contacts/${params.contactId}`);
      toast.success("Xóa liên hệ thành công!!");
      router.push("/lienhe");
    } catch (error) {
      toast.error("Xóa liên hệ thất bại!!");
    }
  };

  return contact ? (
    <div className="m-10 font-semibold bg-gray-200 p-4 w-auto rounded-lg">
      <div className="flex justify-between">
        <div>
          <Link
            href={`/lienhe`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay về trang liên hệ
          </Link>
        </div>
        <ConfirmModal onConfirm={onDelete}>
          <Button variant={"ghost"}>
            <Trash className="h-4 w-4" />
          </Button>
        </ConfirmModal>
      </div>
      <table className="table-fixed w-full border-collapse">
        <thead>
          <tr>
            <th className="text-2xl w-1/6 border-gray-700">
              Thông tin liên hệ
            </th>
          </tr>
        </thead>
        <tbody className="border border-gray-700">
          <tr className="text-sm mt-2 border-b border-gray-700">
            <td className="font-semibold border-r border-gray-700">Tiêu đề</td>
            <td className="p-2">{contact?.title}</td>
          </tr>
          <tr className="text-sm mt-2 border-b border-gray-700">
            <td className="font-semibold border-r border-gray-700">
              Tên người gửi
            </td>
            <td className="text-black p-2">{contact?.name}</td>
          </tr>
          <tr className="text-sm mt-2 border-b border-gray-700">
            <td className="font-semibold border-r border-gray-700">Email</td>
            <td className="p-2">{contact?.email}</td>
          </tr>
          <tr className="text-sm mt-2 border-b border-gray-700">
            <td className="font-semibold border-r border-gray-700">
              Số điện thoại
            </td>
            <td className="p-2">{contact?.phoneNumber}</td>
          </tr>
          <tr className="text-sm mt-2">
            <td className="font-semibold border-r border-gray-700">
              Nội dung liên hệ
            </td>
            <td className="p-2">{contact?.textContent}</td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : (
    <div>
      <p>Đang load dữ liệu....</p>
    </div>
  );
};
export default ContactComponent;
