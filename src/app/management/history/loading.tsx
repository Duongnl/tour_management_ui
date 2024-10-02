import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Spinner from 'react-bootstrap/Spinner';
import "@/styles/account.css"
export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <>
        <div className='div-spinner' >
            <Spinner  animation="border" variant="primary" />
        </div>
            {/* <Skeleton></Skeleton> */}
        </>
    )
  }