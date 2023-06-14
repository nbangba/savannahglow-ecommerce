import React from "react";
import wrapWithProvider from "./wrap-with-provider";
import LayoutSSR from "./src/components/layout/layout-ssr";
import Layout from "./src/components/layout/layout";

export const wrapPageElement = ({ element, props }) => {
  if (typeof window === "undefined")
    return <LayoutSSR {...props}>{element}</LayoutSSR>;

  return <Layout {...props}>{element}</Layout>;
};

export const wrapRootElement = wrapWithProvider;
