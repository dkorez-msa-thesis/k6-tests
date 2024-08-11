
const productFragment = `
    fragment ProductFields on product {
        id
        name
        description
        price
        quantity
        active
        brandName
        categoryName
        specs {
            name
            value
        }
        tags
    }
`;

const productBaseFragment = `
    fragment ProductFields on product {
        name
        description
        price
    }
`;

export const getAllProductsQuery = `
    query {
        products {
            ...ProductFields
        }
    }
    ${productFragment}
`;

export const getProductsByBrandQuery = `
    query {
        productsByBrand(brand: "brand-1") {
            ...ProductFields
        }
    }
    ${productFragment}
`;

export const getProductsByCategoryQuery = `
    query {
        productsByCategory(id: "1") {
            ...ProductFields
        }
    }
    ${productFragment}
`;

export const getProductsByTagQuery = `
    query {
        productsByTag(tag: "Tag 1") {
            ...ProductFields
        }
    }
    ${productFragment}
`;

export const searchProductsQuery = `
    query {
        searchProducts(q: "Product 1") {
            ...ProductFields
        }
    }
    ${productFragment}
`;

export const getProductByIdQuery = `
    query {
        product(id: 1) {
            id
            name
            description
            price
            quantity
            active
            brandName
            categoryName
            specs {
                name
                value
            }
            tags
        }
    }
`;

export const getAllProductsBaseDataQuery = `
    query {
        products {
            ...productBaseFragment
        }
    }
    ${productBaseFragment}
`;