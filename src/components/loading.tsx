import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Spinner from 'react-bootstrap/Spinner';
export default function Loading() {
    return (
        <>
        <div className='div-spinner' >
            <Spinner  animation="border" variant="primary" />
        </div>
        </>
    )
  }