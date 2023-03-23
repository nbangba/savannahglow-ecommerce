import React from "react";
import { graphql } from "gatsby";
import Layout from "../../components/layout";
import ProductItem from "../../components/productitem";
import styled from "styled-components";
import slugify from "@sindresorhus/slugify";
import { Link } from "gatsby";
import SEO from "../../components/seo";

const ProductsWrapper = styled.div`
  margin: 20px;
  font-family: "Montserrat", sans-serif;
  color: #35486f;
  ul {
    display: flex;
    width: 100%;
    padding: 0;
    flex-wrap: wrap;
    justify-content: center;
  }
  li {
    display: flex;
    width: fit-content;
    margin: 10px;
  }
`;
export default function Products({ data, pageContext }) {
  console.log(data);
  const sgproducts = data.productsInfo.nodes;
  const sgRatings = data.productsRatings.nodes[0].documents;
  console.log(sgproducts);
  console.log(pageContext);
  return (
    <>
      <ProductsWrapper>
        <ul>
          {sgproducts.map((node) => (
            <li>
              <Link
                to={`${slugify(node.name)}`}
                style={{ textDecoration: "none" }}
              >
                <ProductItem
                  name={node.name}
                  subName={node.varieties[0].name}
                  price={`GHS ${node.varieties[0].price}.00`}
                  imgSrc={
                    node.varieties[0].images[0].localFile.childImageSharp
                      .gatsbyImageData
                  }
                  id={node.id}
                  ratingInfo={sgRatings.filter(
                    (sgRating) => sgRating.fields.productName === node.name
                  )}
                />
              </Link>
            </li>
          ))}
        </ul>
      </ProductsWrapper>
    </>
  );
}

export const query = graphql`
  query {
    productsInfo: allStrapiProduct {
      nodes {
        name
        description
        id
        varieties {
          name
          description
          price
          images {
            localFile {
              childImageSharp {
                gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED)
              }
            }
          }
        }
      }
    }
    productsRatings: allProductRating {
      nodes {
        documents {
          fields {
            productName {
              stringValue
            }
            numberOfRating {
              integerValue
            }
            rating {
              integerValue
              doubleValue
            }
          }
        }
      }
    }
  }
`;
export function Head() {
  return (
    <SEO
      title={`Savannah Glow Products`}
      description={`All Savannah Glow produts`}
      pathname={`products`}
    ></SEO>
  );
}
