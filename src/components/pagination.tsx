'use client';
import Pagination from 'react-bootstrap/Pagination';
import '@/styles/table.css'
import Link from "next/link";
import { Button, Nav } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useSearchParams,useRouter,usePathname } from 'next/navigation'

interface IProps {
    numberPages: number
    currentPage:number
}

function PaginationTable(props: IProps) {
    const { numberPages, currentPage } = props;
    const [arrayNumberPages, setArrayNumberPages] = useState<number[]>(
        Array.from({ length: numberPages }, (_, i) => i + 1)
    )
    const router = useRouter()

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const status = searchParams.get('status');

    const handleChangePage = (e: number) => {
        // Lấy tất cả các tham số truy vấn hiện tại
        const currentParams = new URLSearchParams(searchParams.toString());
        // Thay đổi giá trị của tham số 'status'
        currentParams.set("page", e.toString() );
        // Tạo URL mới với các tham số truy vấn hiện tại và tham số 'status' mới
        // Chuyển hướng đến URL mới
        router.push(`${pathname}?${currentParams.toString()}`);
        // console.log("current params : ",`${pathname}?${currentParams.toString()}`)
      };
    
     
    useEffect(()=>{
        setArrayNumberPages(
            Array.from({ length: numberPages }, (_, i) => i + 1)
        )
    },[numberPages])

    const handlePrev = (e:number) => {
        if (currentPage >1) {
            e = e-1
            const currentParams = new URLSearchParams(searchParams.toString());
            currentParams.set("page", e.toString() );
            router.push(`${pathname}?${currentParams.toString()}`);
        }
    }

    const handleNext = (e:number) => {
        if (currentPage <numberPages) {
            e = e+1
            const currentParams = new URLSearchParams(searchParams.toString());
            currentParams.set("page", e.toString() );
            router.push(`${pathname}?${currentParams.toString()}`);
        }
    }
  

    return (
        <div className='div-pgn' >
            <Pagination className='pgn' >
                <Pagination.Prev 
                onClick={()=>handlePrev(currentPage)}
                />
                {arrayNumberPages?.map((number, index) => {
                    return (
                        // <Link href={`${pathname}?page=${number}${status != null?`&status=${status}`:''}`} className='pgn-link'
                        // onChange={(e)=>handleChangePage(number)}
                        // >
                        <Button key={index} className='pgn-link'
                        onClick={()=>handleChangePage(number)}
                        >
                            
                            <Pagination.Item as="span" className={currentPage === number ? 'active' : ''} >
                                {number}
                            </Pagination.Item>
                        </Button>
                    )
                })}
                <Pagination.Next 
                onClick={()=>handleNext(currentPage)}
                />
            </Pagination>
        </div>


    );
}

export default PaginationTable;