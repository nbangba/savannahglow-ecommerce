

## 🚀 Quick start

1.  **A single product ecommerce website**.
Savannah glow is a responsive single product ecommerce website that sells a shea butter product with 
the potential to grow and sell more products.
It was built with Gatsby (A react static site generator) but has dynamic component. It uses 
Contentful as a headless CMS and data stored in firebase for the dynamic components.
React Styles is used for the styling. 
Google cloud functions is used for hosting and executing serverless functions.
React-pdf was used for creating the receipts.
 
2.  **Logic**
 It consists of a homepage, product, blog and faq page for non logged in users,
 additional profile, orders,settings page for logged in users and user orders and users page for admin.
 Users have the option to buy now or place items in a cart for later. They can then check out where they have the option to pay 
 with a credit card or pay on delivery. At the check out page user will need to provide an address 
 if one is not already in the system. On completeion of order status of order will be set to "received" and a mail will automatically be sent 
 to the email provided by the user with order details and status. User can cancel order at anytime if status of order has not changed from received 
 and if payment has already been made, a refund will be made by the pay service provider. Logged in users can always check the status of their order
 and download receipt on the orders page.
 
 On completion of an order it appears in the list of user orders of an admin. Admin has the option to dispatch received orders,and this changes
 the status of an order from received to dispatch and buyer automatically receives an email. 
 Dispatched items can assigned to users who have been ssigned the role of dispatchers.
 
 
 

    

3.  **Open the code and start customizing!**

    Your site is now running at https://www.savannahglow.com/!

    Edit `src/pages/index.js` to see your site update in real-time!

4.  **Learn more**

    - [Savannah Glow](https://www.savannahglow.com/)

    - [Tutorials](https://www.gatsbyjs.com/tutorial/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

    - [Guides](https://www.gatsbyjs.com/tutorial/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

    - [API Reference](https://www.gatsbyjs.com/docs/api-reference/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

    - [Plugin Library](https://www.gatsbyjs.com/plugins?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

    - [Cheat Sheet](https://www.gatsbyjs.com/docs/cheat-sheet/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

## 🚀 Quick start (Gatsby Cloud)

Deploy this starter with one click on [Gatsby Cloud](https://www.gatsbyjs.com/cloud/):

[<img src="https://www.gatsbyjs.com/deploynow.svg" alt="Deploy to Gatsby Cloud">](https://www.gatsbyjs.com/dashboard/deploynow?url=https://github.com/gatsbyjs/gatsby-starter-minimal)
