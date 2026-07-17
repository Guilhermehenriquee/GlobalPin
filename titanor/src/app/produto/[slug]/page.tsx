import ProductPage, { generateMetadata, generateStaticParams } from "@/app/produtos/[slug]/page";

export const revalidate = 60;
export { generateMetadata, generateStaticParams };
export default ProductPage;
