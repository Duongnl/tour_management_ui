'use server'
import { Container, Row } from "react-bootstrap"
import { getSessionId } from "@/utils/session_store"
import "@/styles/category.css"
import { Suspense } from "react";
import CategoryTable from "@/components/category/category_table";
import { fetchGetCategories } from "@/utils/serviceApiServer";
const CategoryPage = async() => {

    try {
        const categories = await fetchGetCategories()
        return (
            <Container className="ctn-category">
                <Row>
                     <h4>Quản lý danh mục</h4>
                 </Row>
                 <Row>
                     <Suspense>
                         <CategoryTable 
                             categories={categories}
                         />
                     </Suspense>
                 </Row>
     
            </Container>
                     
            
         )
    } catch (error) {
        // console.error(error);
        // Handle error, e.g., show an error message
        return <div>Error fetching data</div>;
    }

    
}

export default CategoryPage