// component/SearchInput.tsx
'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

const SearchInput: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialSearchName = searchParams.get('name') || '';

    const [searchName, setSearchName] = useState(initialSearchName);

    useEffect(() => {
        setSearchName(initialSearchName);
    }, [initialSearchName]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchName(event.target.value);
    };

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // ป้องกันการ reload หน้าเว็บเมื่อ submit form

        // สร้าง URLSearchParams object เพื่อจัดการ query parameters
        const params = new URLSearchParams(searchParams.toString());

        if (searchName.trim()) {
            params.set('name', searchName.trim()); // ตั้งค่า 'name' query param
        } else {
            params.delete('name'); // ถ้าช่องค้นหาว่างเปล่า ให้ลบ query param ออก
        }

        // อัปเดต URL โดยไม่โหลดหน้าใหม่
        router.push(`/?${params.toString()}`);
    };

     return (
    <form onSubmit={handleSearch} className="mb-8 flex justify-center">
      <input
        type="text"
        value={searchName}
        onChange={handleInputChange}
        placeholder="Search Pokemon by name (e.g., Pikachu)"
        className="p-2 border border-gray-300 rounded-l-md w-80 text-black" // เพิ่ม text-black
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
      >
        Search
      </button>
    </form>
  );
};

export default SearchInput;
