'use client';
import Pagination from 'react-bootstrap/Pagination';
import '@/styles/table.css'
import Link from "next/link";
import { Nav } from 'react-bootstrap';
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
    
     
    useEffect(()=>{
        setArrayNumberPages(
            Array.from({ length: numberPages }, (_, i) => i + 1)
        )
    },[numberPages])

    const handlePrev = () => {
        if (currentPage >1) {
            router.push(`${pathname}?page=${currentPage-1}${status != null?`&status=${status}`:''}`)
        }
    }

    const handleNext = () => {
        if (currentPage <numberPages) {
            router.push(`${pathname}?page=${currentPage+1}${status != null?`&status=${status}`:''}`)
        }
    }
  

    return (
        <div className='div-pgn' >
            <Pagination className='pgn' >
                <Pagination.Prev 
                onClick={()=>handlePrev()}
                />
                {arrayNumberPages?.map((number, index) => {
                    return (
                        <Link href={`${pathname}?page=${number}${status != null?`&status=${status}`:''}`} className='pgn-link'
                        >
                            <Pagination.Item as="span" className={currentPage === number ? 'active' : ''} >
                                {number}
                            </Pagination.Item>
                        </Link>
                    )
                })}
                <Pagination.Next 
                onClick={()=>handleNext()}
                />
            </Pagination>
        </div>


    );
}

export default PaginationTable;