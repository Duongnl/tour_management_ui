'use server'
import { Container, Row } from "react-bootstrap"
import { getSessionId } from "@/utils/session_store"
import "@/styles/category.css"
import { Suspense } from "react";
import CategoryTable from "@/components/category/category_table";
const CategoryPage = async() => {


    const res = await fetch(
        "http://localhost:8080/api/category",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getSessionId()}`, // Set Authorization header
            },
        }
    );

    const data = await res.json();
    const categories = data.result;

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
}

export default CategoryPage